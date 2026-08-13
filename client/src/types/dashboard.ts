/**
 * Matches GET /api/dashboard/stats exactly as specified in section 10.
 */
export interface DashboardStats {
  totalCampaigns: number;
  totalEmails: number;
  scheduledEmails: number;
  processingEmails: number;
  sentEmails: number;
  failedEmails: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  stats: DashboardStats;
}