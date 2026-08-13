import { Router } from "express";
import {
  getSettingsController,
  sendTestEmailController,
} from "../controllers/settings.controller.js";

const router = Router();

router.get("/", getSettingsController);
router.post("/test-email", sendTestEmailController);

export default router;
