import { Router } from "express";
import {
  getDashboardStatsController,
  getAnalyticsController,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/stats", getDashboardStatsController);
router.get("/analytics", getAnalyticsController);

export default router;