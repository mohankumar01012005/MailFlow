import { Router } from "express";
import {
  scheduleEmailController,
  retryEmailController,
} from "../controllers/email.controller.js";

const router = Router();

router.post("/", scheduleEmailController);
router.post("/:emailId/retry", retryEmailController);

export default router;