import { apiClient } from "./client";
import type { SettingsResponse, TestEmailResponse } from "../types/settings";

export const settingsApi = {
  getSettings: () => apiClient.get<SettingsResponse>("/api/settings"),

  sendTestEmail: (recipient: string) =>
    apiClient.post<TestEmailResponse>("/api/settings/test-email", { recipient }),
};
