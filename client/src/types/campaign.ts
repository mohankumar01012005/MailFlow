export type CampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED";

export interface Campaign {
  id: string;
  userId: string;
  subject: string;
  body: string;
  startTime: string | null;
  delayBetweenEmails: number | null;
  hourlyLimit: number | null;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Aggregate email counts for a single campaign, as included in
 * GET /api/campaigns/:campaignId (section 10).
 */
export interface CampaignStats {
  total: number;
  scheduled: number;
  processing: number;
  sent: number;
  failed: number;
}

export interface CampaignWithStats extends Campaign {
  stats: CampaignStats;
}

export interface ImportSummary {
  totalRows: number;
  validEmails: number;
  duplicates: number;
  invalidEmails: number;
}

export interface ScheduleCampaignResponse {
  success: boolean;
  message: string;
  campaign: Campaign;
  totalRecipients: number;
  intervalBetweenEmails: number;
  scheduledEmails: unknown[]; // shape not yet specified — refine when consumed
}

export interface SchedulingSummary {
  totalRecipients: number;
  intervalBetweenEmails: number;
}

export interface ScheduleCampaignCsvResponse {
  success: true;
  message: string;
  campaign: Campaign;
  importSummary: ImportSummary;
  schedulingSummary: SchedulingSummary;
  scheduledEmails: unknown[]; // exact item shape not yet confirmed against a live response
}

/**
 * Shape of the error body when the CSV has zero valid recipients.
 * Distinct from a generic error: the backend flattens the breakdown
 * fields directly onto the body instead of nesting under importSummary.
 */
export interface CsvValidationErrorData {
  success: false;
  message: string;
  totalRows?: number;
  validEmails?: number;
  duplicates?: number;
  invalidEmails?: number;
}

export interface CreateCampaignResponse {
  success: boolean;
  campaign: Campaign;
}

export interface CampaignListResponse {
  success: boolean;
  campaigns: Campaign[];
}