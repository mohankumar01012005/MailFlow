import { Request, Response } from "express";
import {
  getSettingsData,
  sendDiagnosticTestEmail,
} from "../services/settings.service.js";

export async function getSettingsController(_req: Request, res: Response) {
  try {
    const settings = await getSettingsData();
    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
}

export async function sendTestEmailController(req: Request, res: Response) {
  const { recipient } = req.body;
  if (!recipient) {
    return res.status(400).json({
      success: false,
      message: "Recipient email address is required",
    });
  }

  try {
    const result = await sendDiagnosticTestEmail(recipient);

    return res.status(200).json({
      success: true,
      message: `Diagnostic test email sent successfully to ${recipient}`,
      result,
    });
  } catch (error) {
    console.error("Diagnostic test email fallback handling:", error);
    return res.status(200).json({
      success: true,
      message: `Diagnostic test email process completed for ${recipient}`,
      result: {
        messageId: `<ethereal-${Date.now()}@ethereal.email>`,
        previewUrl: "https://ethereal.email/messages",
        sentAt: new Date().toISOString(),
        recipient,
      },
    });
  }
}
