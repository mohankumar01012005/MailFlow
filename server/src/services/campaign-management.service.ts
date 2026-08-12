import { prisma } from "../prisma.js";

export async function getAllCampaigns() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          emails: true,
        },
      },
    },
  });

  const campaignsWithStats = await Promise.all(
    campaigns.map(async (campaign) => {
      const [scheduled, processing, sent, failed] =
        await Promise.all([
          prisma.scheduledEmail.count({
            where: {
              campaignId: campaign.id,
              status: "SCHEDULED",
            },
          }),

          prisma.scheduledEmail.count({
            where: {
              campaignId: campaign.id,
              status: "PROCESSING",
            },
          }),

          prisma.scheduledEmail.count({
            where: {
              campaignId: campaign.id,
              status: "SENT",
            },
          }),

          prisma.scheduledEmail.count({
            where: {
              campaignId: campaign.id,
              status: "FAILED",
            },
          }),
        ]);

      return {
        ...campaign,
        stats: {
          total: campaign._count.emails,
          scheduled,
          processing,
          sent,
          failed,
        },
      };
    })
  );

  return campaignsWithStats;
}

export async function getCampaignById(
  campaignId: string
) {
  const campaign = await prisma.campaign.findUnique({
    where: {
      id: campaignId,
    },
  });

  if (!campaign) {
    return null;
  }

  const [scheduled, processing, sent, failed] =
    await Promise.all([
      prisma.scheduledEmail.count({
        where: {
          campaignId,
          status: "SCHEDULED",
        },
      }),

      prisma.scheduledEmail.count({
        where: {
          campaignId,
          status: "PROCESSING",
        },
      }),

      prisma.scheduledEmail.count({
        where: {
          campaignId,
          status: "SENT",
        },
      }),

      prisma.scheduledEmail.count({
        where: {
          campaignId,
          status: "FAILED",
        },
      }),
    ]);

  return {
    ...campaign,
    stats: {
      total: scheduled + processing + sent + failed,
      scheduled,
      processing,
      sent,
      failed,
    },
  };
}

export async function getCampaignEmails(
  campaignId: string
) {
  const campaign = await prisma.campaign.findUnique({
    where: {
      id: campaignId,
    },
    select: {
      id: true,
    },
  });

  if (!campaign) {
    return null;
  }

  const emails = await prisma.scheduledEmail.findMany({
    where: {
      campaignId,
    },
    orderBy: {
      scheduledAt: "asc",
    },
  });

  return emails;
}