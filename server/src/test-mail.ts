import "dotenv/config";
import nodemailer from "nodemailer";
import { transporter } from "./mailer.js";

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"MailFlow" <${process.env.SMTP_USER}>`,
      to: "mohankumar.work12@gmail.com",
      subject: "MailFlow SMTP Test",
      text: "This is a test email from MailFlow.",
      html: "<p>This is a test email from <strong>MailFlow</strong>.</p>",
    });

    console.log("Email sent successfully");
    console.log("Message ID:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Failed to send test email:", error);
  }
}

sendTestEmail();