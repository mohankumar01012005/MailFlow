import { prisma } from "../prisma.js";

export interface CreateSenderInput {
  name: string;
  email: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function getUserSenders(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return prisma.sender.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createSender(userId: string, input: CreateSenderInput) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();

  if (!name) {
    throw new Error("Sender name is required");
  }

  if (name.length > 100) {
    throw new Error("Sender name must be under 100 characters");
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    throw new Error("A valid sender email address is required");
  }

  if (email.length > 255) {
    throw new Error("Sender email must be under 255 characters");
  }

  return prisma.sender.create({
    data: {
      userId,
      name,
      email,
    },
  });
}

export async function deleteSender(userId: string, senderId: string) {
  if (!userId || !senderId) {
    throw new Error("User ID and Sender ID are required");
  }

  const sender = await prisma.sender.findUnique({
    where: {
      id: senderId,
    },
  });

  if (!sender || sender.userId !== userId) {
    throw new Error("Sender not found or access denied");
  }

  return prisma.sender.delete({
    where: {
      id: senderId,
    },
  });
}
