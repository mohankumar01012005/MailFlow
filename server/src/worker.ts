import "dotenv/config";
import { Worker } from "bullmq";
import { redis } from "./redis.js";
import { prisma } from "./prisma.js";
import { sendEmail } from "./mailer.js";

export const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("Processing job:", job.id);

    const {
      scheduledEmailId,
      recipient,
      subject,
      body,
    } = job.data;

    const scheduledEmail =
      await prisma.scheduledEmail.findUnique({
        where: {
          id: scheduledEmailId,
        },
        include: {
          campaign: true,
        },
      });

    if (!scheduledEmail) {
      throw new Error(
        "Scheduled email record not found"
      );
    }

    if (scheduledEmail.status === "CANCELLED") {
      console.log(
        `Job ${job.id} skipped because email is cancelled`
      );

      return {
        skipped: true,
        reason: "Email cancelled",
      };
    }

    if (
      scheduledEmail.campaign.status ===
        "CANCELLED" ||
      scheduledEmail.campaign.status === "PAUSED"
    ) {
      console.log(
        `Job ${job.id} skipped because campaign is ${scheduledEmail.campaign.status}`
      );

      return {
        skipped: true,
        reason: `Campaign is ${scheduledEmail.campaign.status}`,
      };
    }

    const updatedEmailRecord = await prisma.scheduledEmail.update({
      where: {
        id: scheduledEmailId,
      },
      data: {
        status: "PROCESSING",
        attempts: {
          increment: 1,
        },
      },
    });

    if (
      scheduledEmail.campaign.status === "SCHEDULED"
    ) {
      await prisma.campaign.update({
        where: {
          id: scheduledEmail.campaignId,
        },
        data: {
          status: "RUNNING",
        },
      });
    }

    try {
      const result = await sendEmail(
        recipient,
        subject,
        body,
        updatedEmailRecord.attempts
      );

      await prisma.scheduledEmail.update({
        where: {
          id: scheduledEmailId,
        },
        data: {
          status: "SENT",
          sentAt: new Date(),
          errorMessage: null,
        },
      });

      const remainingEmails =
        await prisma.scheduledEmail.count({
          where: {
            campaignId: scheduledEmail.campaignId,
            status: {
              in: ["SCHEDULED", "PROCESSING"],
            },
          },
        });

      if (remainingEmails === 0) {
        await prisma.campaign.update({
          where: {
            id: scheduledEmail.campaignId,
          },
          data: {
            status: "COMPLETED",
          },
        });
      }

      console.log(
        "Email sent successfully:",
        result.messageId
      );

      if (result.previewUrl) {
        console.log(
          "Preview URL:",
          result.previewUrl
        );
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown email sending error";

      await prisma.scheduledEmail.update({
        where: {
          id: scheduledEmailId,
        },
        data: {
          status: "FAILED",
          failedAt: new Date(),
          errorMessage,
        },
      });

      const remainingEmails =
        await prisma.scheduledEmail.count({
          where: {
            campaignId: scheduledEmail.campaignId,
            status: {
              in: ["SCHEDULED", "PROCESSING"],
            },
          },
        });

      if (remainingEmails === 0) {
        await prisma.campaign.update({
          where: {
            id: scheduledEmail.campaignId,
          },
          data: {
            status: "COMPLETED",
          },
        });
      }

      console.error(
        `Email job ${job.id} failed:`,
        errorMessage
      );

      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, error) => {
  console.error(
    `Job ${job?.id} failed:`,
    error.message
  );
});