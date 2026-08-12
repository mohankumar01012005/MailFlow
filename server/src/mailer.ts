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
  body: string
) {
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