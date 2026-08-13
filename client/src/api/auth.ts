import { apiClient } from "./client";
import type { AuthResponse, MeResponse } from "../types/auth";

export const authApi = {
  signup: (payload: { name: string; email: string; password: string }) =>
    apiClient.post<AuthResponse>("/api/auth/signup", payload),

  login: (payload: { email: string; password: string }) =>
    apiClient.post<AuthResponse>("/api/auth/login", payload),

  getMe: () => apiClient.get<MeResponse>("/api/auth/me"),
};
