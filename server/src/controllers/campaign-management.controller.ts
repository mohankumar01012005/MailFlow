import { Request, Response } from "express";
import {
  getAllCampaigns,
  getCampaignById,
  getCampaignEmails,
} from "../services/campaign-management.service.js";

export async function getAllCampaignsController(
  _req: Request,
  res: Response
) {
  try {
    const campaigns = await getAllCampaigns();

    return res.status(200).json({
      success: true,
      campaigns,
    });
  } catch (error) {
    console.error(
      "Failed to fetch campaigns:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
    });
  }
}

export async function getCampaignByIdController(
  req: Request,
  res: Response
) {
  try {
    const campaignId = String(req.params.campaignId);

    const campaign = await getCampaignById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    return res.status(200).json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error(
      "Failed to fetch campaign:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaign",
    });
  }
}

export async function getCampaignEmailsController(
  req: Request,
  res: Response
) {
  try {
    const campaignId = String(req.params.campaignId);

    const emails = await getCampaignEmails(campaignId);

    if (emails === null) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    return res.status(200).json({
      success: true,
      emails,
    });
  } catch (error) {
    console.error(
      "Failed to fetch campaign emails:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaign emails",
    });
  }
}