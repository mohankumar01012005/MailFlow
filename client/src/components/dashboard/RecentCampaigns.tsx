import { Link } from "react-router-dom";
import { Inbox } from "lucide-react";
import { useCampaigns } from "../../hooks/useCampaigns";
import { Surface } from "../ui/Surface";
import { Skeleton } from "../ui/Skeleton";
import { EmptyState } from "../ui/EmptyState";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export function RecentCampaigns() {
  const { data, isLoading, isError, refetch } = useCampaigns();

  return (
    <Surface>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-text-primary">Recent campaigns</h2>
        <Link to="/campaigns" className="text-sm text-accent hover:text-accent-hover">
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3 p-5">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={Inbox}
          title="Couldn't load campaigns"
          description="Something went wrong reaching the server."
          action={
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : !data?.campaigns.length ? (
        <EmptyState
          icon={Inbox}
          title="No campaigns yet"
          description="Create your first campaign to see it appear here."
          action={
            <Link to="/campaigns/new">
              <Button size="sm">Create Campaign</Button>
            </Link>
          }
        />
      ) : (
        <ul>
          {data.campaigns.slice(0, 5).map((campaign) => (
            <li key={campaign.id} className="border-b border-border-subtle last:border-b-0">
              <Link
                to={`/campaigns/${campaign.id}`}
                className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-surface-2"
              >
                <span className="truncate text-sm text-text-primary">{campaign.subject}</span>
                <Badge status={campaign.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Surface>
  );
}