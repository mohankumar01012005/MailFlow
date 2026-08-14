import { Router } from "express";
import {
  getSettingsController,
  sendTestEmailController,
} from "../controllers/settings.controller.js";
import { strictActionLimiter } from "../middleware/rate-limiter.js";

const router = Router();

router.get("/", getSettingsController);
router.post("/test-email", sendTestEmailController);

export default router;
