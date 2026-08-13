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

export interface CampaignAnalyticsItem {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  total: number;
  sent: number;
  failed: number;
  scheduled: number;
  processing: number;
  successRate: number;
}

export interface RecentActivityItem {
  id: string;
  campaignId: string;
  recipient: string;
  status: string;
  sentAt: string | null;
  failedAt: string | null;
  errorMessage: string | null;
  updatedAt: string;
  campaign: {
    subject: string;
  };
}

export interface AnalyticsData {
  overallStats: DashboardStats & {
    successRate: number;
    failureRate: number;
  };
  campaignPerformance: CampaignAnalyticsItem[];
  recentActivity: RecentActivityItem[];
}

export interface AnalyticsResponse {
  success: boolean;
  analytics: AnalyticsData;
}