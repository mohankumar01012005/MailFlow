import { Request, Response } from "express";
import {
  pauseCampaign,
  resumeCampaign,
  cancelCampaign,
} from "../services/campaign-lifecycle.service.js";

export async function pauseCampaignController(
  req: Request,
  res: Response
) {
  try {
    const campaignId = String(req.params.campaignId);

    const campaign = await pauseCampaign(campaignId);

    return res.status(200).json({
      success: true,
      message: "Campaign paused successfully",
      campaign,
    });
  } catch (error) {
    console.error(
      "Failed to pause campaign:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to pause campaign";

    const statusCode =
      message === "Campaign not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}

export async function resumeCampaignController(
  req: Request,
  res: Response
) {
  try {
    const campaignId = String(req.params.campaignId);

    const campaign = await resumeCampaign(campaignId);

    return res.status(200).json({
      success: true,
      message: "Campaign resumed successfully",
      campaign,
    });
  } catch (error) {
    console.error(
      "Failed to resume campaign:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to resume campaign";

    const statusCode =
      message === "Campaign not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}

export async function cancelCampaignController(
  req: Request,
  res: Response
) {
  try {
    const campaignId = String(req.params.campaignId);

    const campaign = await cancelCampaign(campaignId);

    return res.status(200).json({
      success: true,
      message: "Campaign cancelled successfully",
      campaign,
    });
  } catch (error) {
    console.error(
      "Failed to cancel campaign:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to cancel campaign";

    const statusCode =
      message === "Campaign not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}