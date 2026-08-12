import { Request, Response } from "express";
import { getDashboardStats } from "../services/dashboard.service.js";

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