import { Request, Response } from "express";
import {
  scheduleEmail,
  retryFailedEmail,
  retryAllFailedEmails,
} from "../services/email.service.js";

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

export async function retryEmailController(
  req: Request,
  res: Response
) {
  try {
    const { emailId } = req.params;
    if (!emailId || typeof emailId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email ID is required",
      });
    }

    const email = await retryFailedEmail(emailId as string);

    return res.status(200).json({
      success: true,
      message: "Email retried successfully",
      email,
    });
  } catch (error) {
    console.error("Failed to retry email:", error);
    const message =
      error instanceof Error ? error.message : "Failed to retry email";

    return res.status(400).json({
      success: false,
      message,
    });
  }
}

export async function retryAllFailedEmailsController(
  req: Request,
  res: Response
) {
  try {
    const { campaignId } = req.params;
    if (!campaignId || typeof campaignId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      });
    }

    const result = await retryAllFailedEmails(campaignId as string);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Failed to retry campaign failed emails:", error);
    const message =
      error instanceof Error ? error.message : "Failed to retry emails";

    return res.status(400).json({
      success: false,
      message,
    });
  }
}