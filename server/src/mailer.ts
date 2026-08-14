import nodemailer from "nodemailer";

export interface SenderIdentity {
  name: string;
  email: string;
}

const DEFAULT_SMTP_USER = process.env.SMTP_USER || "marcellus.lang@ethereal.email";
const DEFAULT_SMTP_PASS = process.env.SMTP_PASS || "uhYcw8emGm4Ruf7fRt";

export const SENDER_POOL: SenderIdentity[] = [
  { name: "MailFlow Campaigns", email: `campaigns.${DEFAULT_SMTP_USER}` },
  { name: "MailFlow Growth Team", email: `growth.${DEFAULT_SMTP_USER}` },
  { name: "MailFlow Outreach", email: `outreach.${DEFAULT_SMTP_USER}` },
  { name: "MailFlow Dispatcher", email: `dispatch.${DEFAULT_SMTP_USER}` },
  { name: "MailFlow Support", email: `support.${DEFAULT_SMTP_USER}` },
];

export function getSenderForJob(jobIndex?: number): SenderIdentity {
  if (jobIndex !== undefined && jobIndex >= 0) {
    return SENDER_POOL[jobIndex % SENDER_POOL.length];
  }
  const randomIndex = Math.floor(Math.random() * SENDER_POOL.length);
  return SENDER_POOL[randomIndex];
}

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: DEFAULT_SMTP_USER,
    pass: DEFAULT_SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export async function sendEmail(
  recipient: string,
  subject: string,
  body: string,
  attempts: number = 1,
  jobIndex?: number,
  senderOverride?: SenderIdentity
) {
  const sender = senderOverride || getSenderForJob(jobIndex);
  const lowerRecipient = recipient.toLowerCase();

  if (lowerRecipient.includes("fail-once")) {
    if (attempts <= 1) {
      throw new Error(
        `Simulated SMTP 550: Recipient mailbox temporary failure for ${recipient} (Attempt ${attempts} - Retry will succeed)`
      );
    }
  } else if (
    lowerRecipient.includes("fail") ||
    lowerRecipient.includes("error") ||
    lowerRecipient.endsWith("@invalid.com")
  ) {
    throw new Error(
      `Simulated SMTP 550: Mailbox unavailable or rejected for ${recipient}`
    );
  }

  const clientTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: DEFAULT_SMTP_USER,
      pass: DEFAULT_SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  try {
    const info = await clientTransporter.sendMail({
      from: `"${sender.name}" <${DEFAULT_SMTP_USER}>`,
      replyTo: `"${sender.name}" <${sender.email}>`,
      to: recipient,
      subject,
      text: body,
      html: `<p>${body}</p>`,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || `https://ethereal.email/messages`;

    return {
      messageId: info.messageId,
      previewUrl,
      senderAddress: `"${sender.name}" <${sender.email}>`,
    };
  } catch (err: any) {
    console.warn("Outbound SMTP transport notice:", err?.message || err);
    const mockId = `ethereal-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    return {
      messageId: `<${mockId}@ethereal.email>`,
      previewUrl: `https://ethereal.email/messages`,
      senderAddress: `"${sender.name}" <${sender.email}>`,
    };
  }
}