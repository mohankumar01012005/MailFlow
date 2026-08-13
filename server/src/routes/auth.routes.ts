import { Router } from "express";
import {
  signupController,
  loginController,
  getMeController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { strictActionLimiter } from "../middleware/rate-limiter.js";

const router = Router();

router.post("/signup", strictActionLimiter, signupController);
router.post("/login", strictActionLimiter, loginController);
router.get("/me", authMiddleware, getMeController);

export default router;
