import { useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignsApi } from "../api/campaigns";

export function useScheduleCampaignCsv(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return campaignsApi.scheduleCsv(campaignId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
}