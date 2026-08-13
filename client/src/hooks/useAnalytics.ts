import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: () => dashboardApi.getAnalytics(),
    refetchInterval: 3000,
  });
}
