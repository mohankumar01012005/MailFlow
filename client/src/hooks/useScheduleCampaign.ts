import { useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignsApi, type ScheduleCampaignPayload } from "../api/campaigns";

export function useScheduleCampaign(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ScheduleCampaignPayload) => {
      return campaignsApi.schedule(campaignId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
}
