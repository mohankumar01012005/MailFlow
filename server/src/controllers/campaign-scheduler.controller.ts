import { Request, Response } from "express";
import { scheduleCampaign } from "../services/campaign-scheduler.service.js";

export async function scheduleCampaignController(
  req: Request,
  res: Response
) {
  try {
    const campaignId = String(req.params.campaignId);
    const { recipients } = req.body;

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      });
    }

    if (!Array.isArray(recipients)) {
      return res.status(400).json({
        success: false,
        message: "Recipients must be an array",
      });
    }

    const result = await scheduleCampaign({
      campaignId,
      recipients,
    });

    return res.status(201).json({
      success: true,
      message: "Campaign scheduled successfully",
      campaign: result.campaign,
      totalRecipients: result.totalRecipients,
      intervalBetweenEmails:
        result.intervalBetweenEmails,
      scheduledEmails: result.scheduledEmails,
    });
  } catch (error) {
    console.error(
      "Failed to schedule campaign:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to schedule campaign";

    const statusCode =
      message === "Campaign not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}