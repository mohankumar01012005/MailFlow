import { Router } from "express";
import multer from "multer";
import {
  uploadRecipientsController,
} from "../controllers/recipient.controller.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/upload",
  upload.single("file"),
  uploadRecipientsController
);

export default router;