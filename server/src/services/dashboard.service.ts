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