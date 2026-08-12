import { prisma } from "../prisma.js";
import { emailQueue } from "../queue.js";

interface ScheduleEmailInput {
  campaignId: string;
  recipient: string;
  subject: string;
  body: string;
  scheduledAt: Date;
}

export async function scheduleEmail(input: ScheduleEmailInput) {
  const scheduledEmail = await prisma.scheduledEmail.create({
    data: {
      campaignId: input.campaignId,
      recipient: input.recipient,
      subject: input.subject,
      body: input.body,
      scheduledAt: input.scheduledAt,
    },
  });

  const delay = Math.max(
    input.scheduledAt.getTime() - Date.now(),
    0
  );

  const job = await emailQueue.add(
    "send-email",
    {
      scheduledEmailId: scheduledEmail.id,
      recipient: input.recipient,
      subject: input.subject,
      body: input.body,
    },
    {
      delay,
      jobId: scheduledEmail.id,
    }
  );

  await prisma.scheduledEmail.update({
    where: {
      id: scheduledEmail.id,
    },
    data: {
      bullJobId: job.id,
    },
  });

  return scheduledEmail;
}