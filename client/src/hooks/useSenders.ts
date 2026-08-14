import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sendersApi } from "../api/senders";
import type { CreateSenderInput } from "../types/sender";

export function useSenders() {
  return useQuery({
    queryKey: ["senders"],
    queryFn: () => sendersApi.getSenders(),
  });
}

export function useCreateSender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSenderInput) => sendersApi.createSender(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["senders"] });
    },
  });
}

export function useDeleteSender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sendersApi.deleteSender(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["senders"] });
    },
  });
}
