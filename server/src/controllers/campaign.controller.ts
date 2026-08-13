import { Response } from "express";
import { createCampaign } from "../services/campaign.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function createCampaignController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const {
      subject,
      body,
      startTime,
      delayBetweenEmails,
      hourlyLimit,
    } = req.body;

    const targetUserId = req.user?.userId || req.body.userId;

    if (
      !targetUserId ||
      !subject ||
      !body ||
      !startTime ||
      delayBetweenEmails === undefined ||
      hourlyLimit === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All campaign fields are required",
      });
    }

    const campaign = await createCampaign({
      userId: targetUserId,
      subject,
      body,
      startTime: new Date(startTime),
      delayBetweenEmails: Number(delayBetweenEmails),
      hourlyLimit: Number(hourlyLimit),
    });

    return res.status(201).json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error("Failed to create campaign:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create campaign",
    });
  }
}