import { Request, Response } from "express";
import { parseRecipientCsv } from "../services/recipient.service.js";

export async function uploadRecipientsController(
  req: Request,
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    const csvContent = req.file.buffer.toString("utf-8");

    const result = parseRecipientCsv(csvContent);

    return res.status(200).json({
      success: true,
      message: "Recipients imported successfully",
      ...result,
    });
  } catch (error) {
    console.error(
      "Failed to import recipients:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        "Invalid CSV file. Make sure it contains an email column.",
    });
  }
}