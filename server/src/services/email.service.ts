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

  return await prisma.scheduledEmail.update({
    where: {
      id: scheduledEmail.id,
    },
    data: {
      bullJobId: job.id,
    },
  });
}

export async function retryFailedEmail(emailId: string) {
  const email = await prisma.scheduledEmail.findUnique({
    where: { id: emailId },
    include: { campaign: true },
  });

  if (!email) {
    throw new Error("Scheduled email not found");
  }

  if (email.status !== "FAILED") {
    throw new Error("Only failed emails can be retried");
  }

  if (email.bullJobId) {
    try {
      const existingJob = await emailQueue.getJob(email.bullJobId);
      if (existingJob) {
        await existingJob.remove();
      }
    } catch {
      // Ignore if job missing from Redis
    }
  }

  const job = await emailQueue.add(
    "send-email",
    {
      scheduledEmailId: email.id,
      recipient: email.recipient,
      subject: email.subject,
      body: email.body,
    },
    {
      delay: 0,
      jobId: `${email.id}-retry-${Date.now()}`,
    }
  );

  const now = new Date();
  const updatedEmail = await prisma.scheduledEmail.update({
    where: { id: email.id },
    data: {
      status: "SCHEDULED",
      scheduledAt: now,
      failedAt: null,
      errorMessage: null,
      bullJobId: job.id,
    },
  });

  if (email.campaign.status === "COMPLETED") {
    await prisma.campaign.update({
      where: { id: email.campaignId },
      data: { status: "RUNNING" },
    });
  }

  return updatedEmail;
}

export async function retryAllFailedEmails(campaignId: string) {
  const failedEmails = await prisma.scheduledEmail.findMany({
    where: { campaignId, status: "FAILED" },
    include: { campaign: true },
  });

  if (failedEmails.length === 0) {
    return { count: 0, message: "No failed emails to retry." };
  }

  const now = new Date();
  for (const email of failedEmails) {
    if (email.bullJobId) {
      try {
        const existingJob = await emailQueue.getJob(email.bullJobId);
        if (existingJob) {
          await existingJob.remove();
        }
      } catch {
        // Ignore
      }
    }

    const job = await emailQueue.add(
      "send-email",
      {
        scheduledEmailId: email.id,
        recipient: email.recipient,
        subject: email.subject,
        body: email.body,
      },
      {
        delay: 0,
        jobId: `${email.id}-retry-${Date.now()}`,
      }
    );

    await prisma.scheduledEmail.update({
      where: { id: email.id },
      data: {
        status: "SCHEDULED",
        scheduledAt: now,
        failedAt: null,
        errorMessage: null,
        bullJobId: job.id,
      },
    });
  }

  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: "RUNNING" },
  });

  return { count: failedEmails.length, message: `Retrying ${failedEmails.length} failed emails.` };
}