import { prisma } from "../prisma.js";
import { emailQueue } from "../queue.js";

interface ScheduleCampaignInput {
  campaignId: string;
  recipients: string[];
}

export async function scheduleCampaign(
  input: ScheduleCampaignInput
) {
  const campaign = await prisma.campaign.findUnique({
    where: {
      id: input.campaignId,
    },
  });

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  if (campaign.status !== "DRAFT") {
    throw new Error(
      `Campaign cannot be scheduled from ${campaign.status.toLowerCase()} state`
    );
  }

  if (input.recipients.length === 0) {
    throw new Error("At least one recipient is required");
  }

  const uniqueRecipients = [
    ...new Set(
      input.recipients
        .map((recipient) => recipient.trim().toLowerCase())
        .filter(Boolean)
    ),
  ];

  if (uniqueRecipients.length === 0) {
    throw new Error("No valid recipients provided");
  }

  const delayInterval = Math.max(
    campaign.delayBetweenEmails * 1000,
    Math.ceil(3600000 / campaign.hourlyLimit)
  );

  const startTime = new Date(campaign.startTime);

  const scheduledEmails = [];

  const now = Date.now();
  for (
    let index = 0;
    index < uniqueRecipients.length;
    index++
  ) {
    const recipient = uniqueRecipients[index];

    const scheduledAt = new Date(
      startTime.getTime() + index * delayInterval
    );

    const isElapsed = scheduledAt.getTime() < now - 5000;

    const scheduledEmail =
      await prisma.scheduledEmail.create({
        data: {
          campaignId: campaign.id,
          recipient,
          subject: campaign.subject,
          body: campaign.body,
          scheduledAt,
          status: isElapsed ? "FAILED" : "SCHEDULED",
          failedAt: isElapsed ? new Date() : null,
          errorMessage: isElapsed ? "Scheduled start time elapsed before dispatch" : null,
        },
      });

    if (!isElapsed) {
      const delay = Math.max(
        scheduledAt.getTime() - now,
        0
      );

      const job = await emailQueue.add(
        "send-email",
        {
          scheduledEmailId: scheduledEmail.id,
          recipient,
          subject: campaign.subject,
          body: campaign.body,
          index,
        },
        {
          delay,
          jobId: scheduledEmail.id,
        }
      );

      const updatedScheduledEmail =
        await prisma.scheduledEmail.update({
          where: {
            id: scheduledEmail.id,
          },
          data: {
            bullJobId: job.id,
          },
        });

      scheduledEmails.push(updatedScheduledEmail);
    } else {
      scheduledEmails.push(scheduledEmail);
    }
  }

  const allFailed = scheduledEmails.length > 0 && scheduledEmails.every((e) => e.status === "FAILED");
  const campaignStatus = allFailed
    ? "COMPLETED"
    : startTime.getTime() > Date.now()
    ? "SCHEDULED"
    : "RUNNING";

  const updatedCampaign =
    await prisma.campaign.update({
      where: {
        id: campaign.id,
      },
      data: {
        status: campaignStatus,
      },
    });

  return {
    campaign: updatedCampaign,
    scheduledEmails,
    totalRecipients: uniqueRecipients.length,
    intervalBetweenEmails: delayInterval,
  };
}