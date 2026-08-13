import { useQuery } from "@tanstack/react-query";
import { campaignsApi } from "../api/campaigns";

export function useCampaign(campaignId: string) {
  return useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: () => campaignsApi.getById(campaignId),
    enabled: !!campaignId,
  });
}