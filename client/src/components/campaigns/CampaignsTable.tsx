import { Link } from "react-router-dom";
import { Send } from "lucide-react";
import type { Campaign } from "../../types/campaign";
import { Badge } from "../ui/Badge";
import { Skeleton } from "../ui/Skeleton";
import { EmptyState } from "../ui/EmptyState";
import { Button } from "../ui/Button";
import { CampaignActions } from "./CampaignActions";
import { formatDate } from "../../lib/format";

interface CampaignsTableProps {
  campaigns: Campaign[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function CampaignsTable({ campaigns, isLoading, isError, onRetry }: CampaignsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={Send}
        title="Couldn't load campaigns"
        description="Something went wrong reaching the server."
        action={
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Retry
          </Button>
        }
      />
    );
  }

  if (!campaigns?.length) {
    return (
      <EmptyState
        icon={Send}
        title="No campaigns yet"
        description="Create your first campaign to start sending."
        action={
          <Link to="/campaigns/new">
            <Button size="sm">Create Campaign</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-text-tertiary">
            <th scope="col" className="px-5 py-3 font-medium">Campaign</th>
            <th scope="col" className="px-5 py-3 font-medium">Status</th>
            <th scope="col" className="px-5 py-3 font-medium">Scheduled time</th>
            <th scope="col" className="px-5 py-3 font-medium">Created</th>
            <th scope="col" className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr
              key={campaign.id}
              className="border-b border-border-subtle transition-colors last:border-b-0 hover:bg-surface-2"
            >
              <td className="max-w-xs truncate px-5 py-3 font-medium text-text-primary">
                {campaign.subject}
              </td>
              <td className="px-5 py-3">
                <Badge status={campaign.status} />
              </td>
              <td className="px-5 py-3 text-text-secondary">
                {formatDate(campaign.startTime)}
              </td>
              <td className="px-5 py-3 text-text-secondary">
                {formatDate(campaign.createdAt)}
              </td>
              <td className="px-5 py-3">
                <CampaignActions campaign={campaign} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}