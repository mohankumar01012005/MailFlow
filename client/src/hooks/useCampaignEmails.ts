import { useQuery } from "@tanstack/react-query";
import { campaignsApi } from "../api/campaigns";

export function useCampaignEmails(campaignId: string) {
  return useQuery({
    queryKey: ["campaign", campaignId, "emails"],
    queryFn: () => campaignsApi.getEmails(campaignId),
    enabled: !!campaignId,
    refetchInterval: 2000,
  });
}