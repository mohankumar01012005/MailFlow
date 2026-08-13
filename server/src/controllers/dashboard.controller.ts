import { Response } from "express";
import {
  getDashboardStats,
  getAnalyticsData,
} from "../services/dashboard.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function getDashboardStatsController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user?.userId;
    const stats = await getDashboardStats(userId);

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
}

export async function getAnalyticsController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user?.userId;
    const analytics = await getAnalyticsData(userId);

    return res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
    });
  }
}