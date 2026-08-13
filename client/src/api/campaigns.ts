import { apiClient } from "./client";
import type {
  Campaign,
  CampaignListResponse,
  CampaignWithStats,
  CreateCampaignResponse,
  ScheduleCampaignResponse,
  ScheduleCampaignCsvResponse,
} from "../types/campaign";
import type { CampaignEmailsResponse } from "../types/email";

export interface CreateCampaignPayload {
  // TEMPORARY: sent explicitly until real auth exists. Once auth is
  // built, this should come from the session/token, not the payload.
  userId: string;
  subject: string;
  body: string;
  startTime: string;
  delayBetweenEmails: number;
  hourlyLimit: number;
}

export interface ScheduleCampaignPayload {
  recipients: string[];
  startTime: string;
  delayBetweenEmails: number;
  hourlyLimit: number;
}

export const campaignsApi = {
  list: () => apiClient.get<CampaignListResponse>("/api/campaigns"),

  getById: (campaignId: string) =>
    apiClient.get<{ success: boolean; campaign: CampaignWithStats }>(
      `/api/campaigns/${campaignId}`
    ),

  getEmails: (campaignId: string) =>
    apiClient.get<CampaignEmailsResponse>(`/api/campaigns/${campaignId}/emails`),

  create: (payload: CreateCampaignPayload) =>
    apiClient.post<CreateCampaignResponse>("/api/campaigns", payload),

  schedule: (campaignId: string, payload: ScheduleCampaignPayload) =>
    apiClient.post<ScheduleCampaignResponse>(
      `/api/campaigns/${campaignId}/schedule`,
      payload
    ),

  scheduleCsv: (campaignId: string, formData: FormData) =>
    apiClient.post<ScheduleCampaignCsvResponse>(
      `/api/campaigns/${campaignId}/schedule-csv`,
      formData
    ),

  pause: (campaignId: string) =>
    apiClient.post<{ success: boolean; campaign: Campaign }>(
      `/api/campaigns/${campaignId}/pause`
    ),

  resume: (campaignId: string) =>
    apiClient.post<{ success: boolean; campaign: Campaign }>(
      `/api/campaigns/${campaignId}/resume`
    ),

  cancel: (campaignId: string) =>
    apiClient.post<{ success: boolean; campaign: Campaign }>(
      `/api/campaigns/${campaignId}/cancel`
    ),
};