import { Router } from "express";
import {
  getSendersController,
  createSenderController,
  deleteSenderController,
} from "../controllers/sender.controller.js";

const router = Router();

router.get("/", getSendersController);
router.post("/", createSenderController);
router.delete("/:id", deleteSenderController);

export default router;
