import { Router } from "express";
import {
  getDashboardStatsController,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/stats", getDashboardStatsController);

export default router;