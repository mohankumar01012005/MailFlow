import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(
  recipient: string,
  subject: string,
  body: string,
  attempts: number = 1
) {
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

  const info = await transporter.sendMail({
    from: `"MailFlow" <${process.env.SMTP_USER}>`,
    to: recipient,
    subject,
    text: body,
    html: `<p>${body}</p>`,
  });

  return {
    messageId: info.messageId,
    previewUrl: nodemailer.getTestMessageUrl(info),
  };
}