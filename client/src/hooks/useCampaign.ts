import { useQuery } from "@tanstack/react-query";
import { campaignsApi } from "../api/campaigns";

export function useCampaign(campaignId: string) {
  return useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: () => campaignsApi.getById(campaignId),
    enabled: !!campaignId,
    refetchInterval: (query) => {
      const status = query.state.data?.campaign?.status;
      return status === "RUNNING" || status === "SCHEDULED" ? 2000 : false;
    },
  });
}