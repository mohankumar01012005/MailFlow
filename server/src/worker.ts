import "dotenv/config";
import { Worker } from "bullmq";
import { redis } from "./redis.js";
import { prisma } from "./prisma.js";
import { sendEmail } from "./mailer.js";

const WORKER_CONCURRENCY = Math.max(
  1,
  Number(process.env.WORKER_CONCURRENCY || 5)
);

export async function checkAndIncrementHourlyRateLimit(
  campaignId: string,
  limit: number
): Promise<{ allowed: boolean; currentCount: number; limit: number; resetTimeMs: number }> {
  const now = new Date();
  const hourString = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}-${String(now.getUTCHours()).padStart(2, "0")}`;
  const rateLimitKey = `rate_limit:${campaignId}:${hourString}`;

  const currentCount = await redis.incr(rateLimitKey);

  if (currentCount === 1) {
    await redis.expire(rateLimitKey, 3600);
  }

  const nextHour = new Date(now);
  nextHour.setUTCHours(now.getUTCHours() + 1, 0, 0, 0);
  const resetTimeMs = Math.max(1000, nextHour.getTime() - now.getTime());

  const allowed = currentCount <= limit;

  return {
    allowed,
    currentCount,
    limit,
    resetTimeMs,
  };
}

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

    if (scheduledEmail.status === "SENT") {
      console.log(
        `[Idempotency Guard] Job ${job.id} skipped: Email ${scheduledEmailId} is already SENT.`
      );
      return {
        skipped: true,
        reason: "Email already SENT",
      };
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

    const lockKey = `email_lock:${scheduledEmailId}`;
    const lockAcquired = await redis.set(lockKey, "LOCKED", "EX", 60, "NX");

    if (!lockAcquired) {
      console.log(
        `[Idempotency Guard] Job ${job.id} skipped: Lock for email ${scheduledEmailId} is held by another worker.`
      );
      return {
        skipped: true,
        reason: "Duplicate execution prevented by Redis lock",
      };
    }

    const rateLimitCheck = await checkAndIncrementHourlyRateLimit(
      scheduledEmail.campaignId,
      scheduledEmail.campaign.hourlyLimit
    );

    console.log(
      `[Rate Limit Check] Campaign ${scheduledEmail.campaignId} hour count: ${rateLimitCheck.currentCount}/${rateLimitCheck.limit}`
    );

    if (!rateLimitCheck.allowed) {
      const delaySeconds = Math.round(rateLimitCheck.resetTimeMs / 1000);
      console.log(
        `[Rate Limit Exceeded] Campaign ${scheduledEmail.campaignId} count (${rateLimitCheck.currentCount}) > limit (${rateLimitCheck.limit}). Postponing job ${job.id} for ${delaySeconds}s until next hour window.`
      );

      const { emailQueue } = await import("./queue.js");
      await emailQueue.add(
        "send-email",
        {
          scheduledEmailId: scheduledEmail.id,
          recipient,
          subject,
          body,
          index: job.data.index,
        },
        {
          delay: rateLimitCheck.resetTimeMs,
          jobId: `${scheduledEmail.id}-delayed-${Date.now()}`,
        }
      );

      await prisma.scheduledEmail.update({
        where: { id: scheduledEmailId },
        data: {
          status: "SCHEDULED",
          scheduledAt: new Date(Date.now() + rateLimitCheck.resetTimeMs),
        },
      });

      return {
        postponed: true,
        reason: "Hourly rate limit reached, postponed to next hour window",
        resetTimeMs: rateLimitCheck.resetTimeMs,
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
      const jobIndex = typeof job.data.index === "number" ? job.data.index : job.attemptsMade;
      const result = await sendEmail(
        recipient,
        subject,
        body,
        updatedEmailRecord.attempts,
        jobIndex
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
        `Email sent successfully via [${result.senderAddress}]:`,
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
    } finally {
      await redis.del(lockKey);
    }
  },
  {
    connection: redis,
    concurrency: WORKER_CONCURRENCY,
  }
);

console.log(
  `Worker initialized: BullMQ emailQueue running with WORKER_CONCURRENCY=${WORKER_CONCURRENCY}`
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