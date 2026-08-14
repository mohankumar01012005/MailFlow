import { prisma } from "../prisma.js";

interface CreateCampaignInput {
  userId: string;
  senderId?: string | null;
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

  let validSenderId: string | null = null;
  if (input.senderId) {
    const sender = await prisma.sender.findUnique({
      where: { id: input.senderId },
    });
    if (!sender || sender.userId !== input.userId) {
      throw new Error("Invalid sender identity or access denied");
    }
    validSenderId = sender.id;
  }

  const campaign = await prisma.campaign.create({
    data: {
      userId: input.userId,
      senderId: validSenderId,
      subject: input.subject,
      body: input.body,
      startTime: input.startTime,
      delayBetweenEmails: input.delayBetweenEmails,
      hourlyLimit: input.hourlyLimit,
      status: "DRAFT",
    },
    include: {
      sender: true,
    },
  });

  return campaign;
}