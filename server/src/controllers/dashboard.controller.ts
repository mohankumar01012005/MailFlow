import { Request, Response } from "express";
import {
  getDashboardStats,
  getAnalyticsData,
} from "../services/dashboard.service.js";

export async function getDashboardStatsController(
  _req: Request,
  res: Response
) {
  try {
    const stats = await getDashboardStats();

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error(
      "Failed to fetch dashboard stats:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
}

export async function getAnalyticsController(
  _req: Request,
  res: Response
) {
  try {
    const analytics = await getAnalyticsData();

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