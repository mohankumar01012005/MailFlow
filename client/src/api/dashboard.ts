
import { apiClient } from "./client";
import type { DashboardStatsResponse } from "../types/dashboard.ts";

export const dashboardApi = {
  getStats: () => apiClient.get<DashboardStatsResponse>("/api/dashboard/stats"),
};