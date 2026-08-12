import { Router } from "express";
import { scheduleEmailController } from "../controllers/email.controller.js";

const router = Router();

router.post("/", scheduleEmailController);

export default router;