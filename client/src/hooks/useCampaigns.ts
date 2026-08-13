import { useQuery } from "@tanstack/react-query";
import { campaignsApi } from "../api/campaigns";

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: campaignsApi.list,
  });
}