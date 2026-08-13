import { useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignsApi } from "../api/campaigns";

export function useRetryEmail(campaignId?: string) {
  const queryClient = useQueryClient();

  const retrySingle = useMutation({
    mutationFn: (emailId: string) => campaignsApi.retryEmail(emailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      if (campaignId) {
        queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
        queryClient.invalidateQueries({ queryKey: ["campaignEmails", campaignId] });
      }
    },
  });

  const retryAll = useMutation({
    mutationFn: (cId: string) => campaignsApi.retryFailedEmails(cId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      if (campaignId) {
        queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
        queryClient.invalidateQueries({ queryKey: ["campaignEmails", campaignId] });
      }
    },
  });

  return { retrySingle, retryAll };
}
