import { apiClient } from "./client";
import type {
  SendersResponse,
  CreateSenderResponse,
  CreateSenderInput,
} from "../types/sender";

export const sendersApi = {
  getSenders: () => apiClient.get<SendersResponse>("/api/senders"),

  createSender: (input: CreateSenderInput) =>
    apiClient.post<CreateSenderResponse>("/api/senders", input),

  deleteSender: (id: string) =>
    apiClient.delete<{ success: boolean; message: string }>(`/api/senders/${id}`),
};
