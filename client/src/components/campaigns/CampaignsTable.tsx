import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Search, Filter } from "lucide-react";
import type { Campaign, CampaignStatus } from "../../types/campaign";
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

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Running", value: "RUNNING" },
  { label: "Paused", value: "PAUSED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function CampaignsTable({ campaigns, isLoading, isError, onRetry }: CampaignsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Search and Status Filter Bar */}
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-1 py-1.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-border-strong"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="mr-1 h-3.5 w-3.5 shrink-0 text-text-tertiary" />
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                statusFilter === filter.value
                  ? "bg-surface-3 text-text-primary"
                  : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 text-center text-sm text-text-secondary">
          No campaigns match your search criteria.
        </div>
      ) : (
        <>
          {/* Desktop Table view */}
          <div className="hidden sm:block overflow-x-auto">
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
                {filtered.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b border-border-subtle transition-colors last:border-b-0 hover:bg-surface-2"
                  >
                    <td className="max-w-xs truncate px-5 py-3 font-medium text-text-primary">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="hover:underline hover:text-text-primary"
                      >
                        {campaign.subject}
                      </Link>
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
                    <td className="px-5 py-3 text-right">
                      <CampaignActions campaign={campaign} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards view */}
          <div className="divide-y divide-border sm:hidden">
            {filtered.map((campaign) => (
              <div key={campaign.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/campaigns/${campaign.id}`}
                    className="font-medium text-text-primary hover:underline text-sm"
                  >
                    {campaign.subject}
                  </Link>
                  <Badge status={campaign.status} />
                </div>
                <div className="flex flex-col gap-1 text-xs text-text-secondary">
                  <div>Scheduled: {formatDate(campaign.startTime)}</div>
                  <div>Created: {formatDate(campaign.createdAt)}</div>
                </div>
                <div className="pt-2 flex justify-end">
                  <CampaignActions campaign={campaign} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}