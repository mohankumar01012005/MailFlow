import { useQuery, useMutation } from "@tanstack/react-query";
import { settingsApi } from "../api/settings";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.getSettings(),
  });
}

export function useSendTestEmail() {
  return useMutation({
    mutationFn: (recipient: string) => settingsApi.sendTestEmail(recipient),
  });
}
