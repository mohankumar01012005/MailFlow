import { prisma } from "../prisma.js";

interface CreateCampaignInput {
  userId: string;
  subject: string;
  body: string;
  startTime: Date;
  delayBetweenEmails: number;
  hourlyLimit: number;
}

export async function createCampaign(input: CreateCampaignInput) {
  if (input.delayBetweenEmails < 0) {
    throw new Error(
      "Delay between emails cannot be negative"
    );
  }

  if (input.hourlyLimit <= 0) {
    throw new Error(
      "Hourly limit must be greater than zero"
    );
  }

  const campaign = await prisma.campaign.create({
    data: {
      userId: input.userId,
      subject: input.subject,
      body: input.body,
      startTime: input.startTime,
      delayBetweenEmails: input.delayBetweenEmails,
      hourlyLimit: input.hourlyLimit,
      status: "DRAFT",
    },
  });

  return campaign;
}