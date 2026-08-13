import { sendEmail } from "../mailer.js";

export async function getSettingsData() {
  const host = process.env.SMTP_HOST || "smtp.ethereal.email";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || "ethereal-dev-user";
  const isEthereal = host.includes("ethereal");

  return {
    smtp: {
      host,
      port,
      user,
      status: "ACTIVE",
      provider: isEthereal ? "Ethereal SMTP (Development)" : "Production SMTP Provider",
      isDevelopment: isEthereal,
    },
    sendingDefaults: {
      defaultDelayBetweenEmails: 60,
      defaultHourlyLimit: 100,
      maxRetriesPerEmail: 3,
    },
    senderIdentity: {
      name: "MailFlow Orchestrator",
      email: user,
    },
  };
}

export async function sendDiagnosticTestEmail(recipient: string) {
  if (!recipient || !recipient.includes("@")) {
    throw new Error("Invalid recipient email address");
  }

  const subject = "MailFlow SMTP Transport Diagnostic Test";
  const body = `This is an automated diagnostic test message from MailFlow.\n\nSent at: ${new Date().toISOString()}\nSMTP Host: ${process.env.SMTP_HOST || "Ethereal SMTP"}\n\nYour MailFlow asynchronous email pipeline is working properly!`;

  const result = await sendEmail(recipient, subject, body);

  return {
    messageId: result.messageId,
    previewUrl: result.previewUrl,
    sentAt: new Date().toISOString(),
    recipient,
  };
}
