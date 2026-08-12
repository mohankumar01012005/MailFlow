import { Request, Response } from "express";
import { scheduleEmail } from "../services/email.service.js";

export async function scheduleEmailController(
  req: Request,
  res: Response
) {
  try {
    const {
      campaignId,
      recipient,
      subject,
      body,
      scheduledAt,
    } = req.body;

    if (
      !campaignId ||
      !recipient ||
      !subject ||
      !body ||
      !scheduledAt
    ) {
      return res.status(400).json({
        success: false,
        message: "All email scheduling fields are required",
      });
    }

    const scheduledEmail = await scheduleEmail({
      campaignId,
      recipient,
      subject,
      body,
      scheduledAt: new Date(scheduledAt),
    });

    return res.status(201).json({
      success: true,
      scheduledEmail,
    });
  } catch (error) {
    console.error("Failed to schedule email:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to schedule email",
    });
  }
}