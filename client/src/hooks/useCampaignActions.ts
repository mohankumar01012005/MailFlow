import { useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignsApi } from "../api/campaigns";

/**
 * Shared pause/resume/cancel mutations. Invalidates both the campaign
 * list and dashboard stats, since a status change affects counts shown
 * on the Dashboard too.
 */
export function useCampaignActions(campaignId: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
    queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
  };

  const pause = useMutation({
    mutationFn: () => campaignsApi.pause(campaignId),
    onSuccess: invalidate,
  });

  const resume = useMutation({
    mutationFn: () => campaignsApi.resume(campaignId),
    onSuccess: invalidate,
  });

  const cancel = useMutation({
    mutationFn: () => campaignsApi.cancel(campaignId),
    onSuccess: invalidate,
  });

  return { pause, resume, cancel };
}