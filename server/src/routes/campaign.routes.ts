import { Router } from "express";
import { createCampaignController } from "../controllers/campaign.controller.js";
import { scheduleCampaignController } from "../controllers/campaign-scheduler.controller.js";
import {
  uploadCampaignCsv,
  scheduleCampaignFromCsvController,
} from "../controllers/campaign-csv.controller.js";
import {
  getAllCampaignsController,
  getCampaignByIdController,
  getCampaignEmailsController,
} from "../controllers/campaign-management.controller.js";
import {
  pauseCampaignController,
  resumeCampaignController,
  cancelCampaignController,
} from "../controllers/campaign-lifecycle.controller.js";

const router = Router();

router.post("/", createCampaignController);

router.get("/", getAllCampaignsController);

router.get(
  "/:campaignId",
  getCampaignByIdController
);

router.get(
  "/:campaignId/emails",
  getCampaignEmailsController
);

router.post(
  "/:campaignId/schedule",
  scheduleCampaignController
);

router.post(
  "/:campaignId/schedule-csv",
  uploadCampaignCsv,
  scheduleCampaignFromCsvController
);

router.post(
  "/:campaignId/pause",
  pauseCampaignController
);

router.post(
  "/:campaignId/resume",
  resumeCampaignController
);

router.post(
  "/:campaignId/cancel",
  cancelCampaignController
);

export default router;