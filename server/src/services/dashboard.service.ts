import { prisma } from "../prisma.js";

export async function getDashboardStats() {
  const [
    totalCampaigns,
    totalEmails,
    scheduledEmails,
    processingEmails,
    sentEmails,
    failedEmails,
  ] = await Promise.all([
    prisma.campaign.count(),

    prisma.scheduledEmail.count(),

    prisma.scheduledEmail.count({
      where: {
        status: "SCHEDULED",
      },
    }),

    prisma.scheduledEmail.count({
      where: {
        status: "PROCESSING",
      },
    }),

    prisma.scheduledEmail.count({
      where: {
        status: "SENT",
      },
    }),

    prisma.scheduledEmail.count({
      where: {
        status: "FAILED",
      },
    }),
  ]);

  return {
    totalCampaigns,
    totalEmails,
    scheduledEmails,
    processingEmails,
    sentEmails,
    failedEmails,
  };
}

export async function getAnalyticsData() {
  const stats = await getDashboardStats();

  const successRate =
    stats.totalEmails > 0
      ? Math.round((stats.sentEmails / stats.totalEmails) * 100)
      : 0;

  const failureRate =
    stats.totalEmails > 0
      ? Math.round((stats.failedEmails / stats.totalEmails) * 100)
      : 0;

  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      emails: {
        select: {
          status: true,
        },
      },
    },
  });

  const campaignPerformance = campaigns.map((campaign) => {
    const total = campaign.emails.length;
    const sent = campaign.emails.filter((e) => e.status === "SENT").length;
    const failed = campaign.emails.filter((e) => e.status === "FAILED").length;
    const scheduled = campaign.emails.filter((e) => e.status === "SCHEDULED").length;
    const processing = campaign.emails.filter((e) => e.status === "PROCESSING").length;
    const rate = total > 0 ? Math.round((sent / total) * 100) : 0;

    return {
      id: campaign.id,
      subject: campaign.subject,
      status: campaign.status,
      createdAt: campaign.createdAt,
      total,
      sent,
      failed,
      scheduled,
      processing,
      successRate: rate,
    };
  });

  const recentActivity = await prisma.scheduledEmail.findMany({
    take: 10,
    orderBy: { updatedAt: "desc" },
    where: {
      status: { in: ["SENT", "FAILED", "PROCESSING"] },
    },
    include: {
      campaign: {
        select: { subject: true },
      },
    },
  });

  return {
    overallStats: {
      ...stats,
      successRate,
      failureRate,
    },
    campaignPerformance,
    recentActivity,
  };
}