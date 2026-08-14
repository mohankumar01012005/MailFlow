import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
  getUserSenders,
  createSender,
  deleteSender,
} from "../services/sender.service.js";

export async function getSendersController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const senders = await getUserSenders(userId);
    return res.status(200).json({
      success: true,
      senders,
    });
  } catch (error: any) {
    console.error("Failed to fetch senders:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch senders",
    });
  }
}

export async function createSenderController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { name, email } = req.body;
    const sender = await createSender(userId, { name, email });

    return res.status(201).json({
      success: true,
      sender,
    });
  } catch (error: any) {
    console.error("Failed to create sender:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create sender",
    });
  }
}

export async function deleteSenderController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const senderId = String(req.params.id);
    await deleteSender(userId, senderId);

    return res.status(200).json({
      success: true,
      message: "Sender deleted successfully",
    });
  } catch (error: any) {
    console.error("Failed to delete sender:", error);
    const status = error.message?.includes("access denied") ? 403 : 400;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to delete sender",
    });
  }
}
