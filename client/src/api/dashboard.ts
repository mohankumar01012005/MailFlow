
import { apiClient } from "./client";
import type { DashboardStatsResponse, AnalyticsResponse } from "../types/dashboard.ts";

export const dashboardApi = {
  getStats: () => apiClient.get<DashboardStatsResponse>("/api/dashboard/stats"),
  getAnalytics: () => apiClient.get<AnalyticsResponse>("/api/dashboard/analytics"),
};