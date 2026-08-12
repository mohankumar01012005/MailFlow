import { Request, Response } from "express";
import multer from "multer";
import { parseRecipientCsv } from "../services/recipient.service.js";
import { scheduleCampaign } from "../services/campaign-scheduler.service.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadCampaignCsv = upload.single("file");

export async function scheduleCampaignFromCsvController(
  req: Request,
  res: Response
) {
  try {
    const campaignId = String(req.params.campaignId);

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    const csvContent = req.file.buffer.toString("utf-8");

    const importResult = parseRecipientCsv(csvContent);

    if (importResult.recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "CSV contains no valid email addresses",
        totalRows: importResult.totalRows,
        validEmails: importResult.validEmails,
        duplicates: importResult.duplicates,
        invalidEmails: importResult.invalidEmails,
      });
    }

    const scheduleResult = await scheduleCampaign({
      campaignId,
      recipients: importResult.recipients,
    });

    return res.status(201).json({
      success: true,
      message: "Campaign scheduled from CSV successfully",

      campaign: scheduleResult.campaign,

      importSummary: {
        totalRows: importResult.totalRows,
        validEmails: importResult.validEmails,
        duplicates: importResult.duplicates,
        invalidEmails: importResult.invalidEmails,
      },

      schedulingSummary: {
        totalRecipients: scheduleResult.totalRecipients,
        intervalBetweenEmails:
          scheduleResult.intervalBetweenEmails,
      },

      scheduledEmails: scheduleResult.scheduledEmails,
    });
  } catch (error) {
    console.error(
      "Failed to schedule campaign from CSV:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to schedule campaign from CSV";

    const statusCode =
      message === "Campaign not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}