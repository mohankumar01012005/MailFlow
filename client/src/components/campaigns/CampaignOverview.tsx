import type { CampaignStats } from "../../types/campaign";
import { Surface } from "../ui/Surface";
import { CampaignProgress } from "./CampaignProgress";

interface CampaignOverviewProps {
  stats: CampaignStats;
}

const statItems: { key: keyof CampaignStats; label: string }[] = [
  { key: "total", label: "Total" },
  { key: "scheduled", label: "Scheduled" },
  { key: "processing", label: "Processing" },
  { key: "sent", label: "Sent" },
  { key: "failed", label: "Failed" },
];

export function CampaignOverview({ stats }: CampaignOverviewProps) {
  return (
    <Surface className="space-y-6 p-6">
      <CampaignProgress stats={stats} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {statItems.map(({ key, label }) => (
          <div key={key}>
            <p className="text-xs text-text-tertiary">{label}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-text-primary">
              {stats[key]}
            </p>
          </div>
        ))}
      </div>
    </Surface>
  );
}