import type { CampaignStats } from "../../types/campaign";
import { formatPercent } from "../../lib/format";

interface CampaignProgressProps {
  stats: CampaignStats;
}

export function CampaignProgress({ stats }: CampaignProgressProps) {
  const percent = formatPercent(stats.sent, stats.total);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm text-text-secondary">
          {stats.sent} / {stats.total} emails sent
        </span>
        <span className="text-sm font-semibold text-text-primary">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Campaign send progress"
        className="h-2 w-full overflow-hidden rounded-full bg-surface-2"
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}