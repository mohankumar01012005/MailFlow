import { prisma } from "../prisma.js";

export async function getDashboardStats(userId?: string) {
  const userFilter = userId ? { userId } : {};
  const emailUserFilter = userId ? { campaign: { userId } } : {};

  const [
    totalCampaigns,
    totalEmails,
    scheduledEmails,
    processingEmails,
    sentEmails,
    failedEmails,
  ] = await Promise.all([
    prisma.campaign.count({ where: userFilter }),

    prisma.scheduledEmail.count({ where: emailUserFilter }),

    prisma.scheduledEmail.count({
      where: {
        ...emailUserFilter,
        status: "SCHEDULED",
      },
    }),

    prisma.scheduledEmail.count({
      where: {
        ...emailUserFilter,
        status: "PROCESSING",
      },
    }),

    prisma.scheduledEmail.count({
      where: {
        ...emailUserFilter,
        status: "SENT",
      },
    }),

    prisma.scheduledEmail.count({
      where: {
        ...emailUserFilter,
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

export async function getAnalyticsData(userId?: string) {
  const stats = await getDashboardStats(userId);

  const successRate =
    stats.totalEmails > 0
      ? Math.round((stats.sentEmails / stats.totalEmails) * 100)
      : 0;

  const failureRate =
    stats.totalEmails > 0
      ? Math.round((stats.failedEmails / stats.totalEmails) * 100)
      : 0;

  const campaigns = await prisma.campaign.findMany({
    where: userId ? { userId } : {},
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
      ...(userId ? { campaign: { userId } } : {}),
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