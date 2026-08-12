import { prisma } from "../prisma.js";
import { emailQueue } from "../queue.js";

async function removeEmailJob(bullJobId: string | null) {
  if (!bullJobId) {
    return;
  }

  const job = await emailQueue.getJob(bullJobId);

  if (job) {
    await job.remove();
  }
}

export async function pauseCampaign(
  campaignId: string
) {
  const campaign = await prisma.campaign.findUnique({
    where: {
      id: campaignId,
    },
  });

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  if (
    campaign.status !== "SCHEDULED" &&
    campaign.status !== "RUNNING"
  ) {
    throw new Error(
      `Campaign cannot be paused from ${campaign.status.toLowerCase()} state`
    );
  }

  const pendingEmails =
    await prisma.scheduledEmail.findMany({
      where: {
        campaignId,
        status: "SCHEDULED",
      },
      select: {
        id: true,
        bullJobId: true,
      },
    });

  for (const email of pendingEmails) {
    await removeEmailJob(email.bullJobId);

    await prisma.scheduledEmail.update({
      where: {
        id: email.id,
      },
      data: {
        bullJobId: null,
      },
    });
  }

  return prisma.campaign.update({
    where: {
      id: campaignId,
    },
    data: {
      status: "PAUSED",
    },
  });
}

export async function resumeCampaign(
  campaignId: string
) {
  const campaign = await prisma.campaign.findUnique({
    where: {
      id: campaignId,
    },
  });

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  if (campaign.status !== "PAUSED") {
    throw new Error(
      "Only paused campaigns can be resumed"
    );
  }

  const pendingEmails =
    await prisma.scheduledEmail.findMany({
      where: {
        campaignId,
        status: "SCHEDULED",
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

  if (pendingEmails.length === 0) {
    return prisma.campaign.update({
      where: {
        id: campaignId,
      },
      data: {
        status: "COMPLETED",
      },
    });
  }

  for (const email of pendingEmails) {
    const delay = Math.max(
      email.scheduledAt.getTime() - Date.now(),
      0
    );

    const job = await emailQueue.add(
      "send-email",
      {
        scheduledEmailId: email.id,
        recipient: email.recipient,
        subject: email.subject,
        body: email.body,
      },
      {
        delay,
        jobId: email.id,
      }
    );

    await prisma.scheduledEmail.update({
      where: {
        id: email.id,
      },
      data: {
        bullJobId: job.id,
      },
    });
  }

  const status =
    pendingEmails[0].scheduledAt.getTime() > Date.now()
      ? "SCHEDULED"
      : "RUNNING";

  return prisma.campaign.update({
    where: {
      id: campaignId,
    },
    data: {
      status,
    },
  });
}

export async function cancelCampaign(
  campaignId: string
) {
  const campaign = await prisma.campaign.findUnique({
    where: {
      id: campaignId,
    },
  });

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  if (
    campaign.status === "CANCELLED" ||
    campaign.status === "COMPLETED"
  ) {
    throw new Error(
      `Campaign is already ${campaign.status.toLowerCase()}`
    );
  }

  const pendingEmails =
    await prisma.scheduledEmail.findMany({
      where: {
        campaignId,
        status: "SCHEDULED",
      },
      select: {
        id: true,
        bullJobId: true,
      },
    });

  for (const email of pendingEmails) {
    await removeEmailJob(email.bullJobId);
  }

  await prisma.scheduledEmail.updateMany({
    where: {
      campaignId,
      status: "SCHEDULED",
    },
    data: {
      status: "CANCELLED",
      bullJobId: null,
    },
  });

  return prisma.campaign.update({
    where: {
      id: campaignId,
    },
    data: {
      status: "CANCELLED",
    },
  });
}