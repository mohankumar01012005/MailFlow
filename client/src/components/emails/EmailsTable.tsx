import { useState } from "react";
import { Mail, RefreshCw, Search, Filter } from "lucide-react";
import type { ScheduledEmail } from "../../types/email";
import { EmailStatusBadge } from "./EmailStatusBadge";
import { Skeleton } from "../ui/Skeleton";
import { EmptyState } from "../ui/EmptyState";
import { Button } from "../ui/Button";
import { formatDate } from "../../lib/format";
import { useRetryEmail } from "../../hooks/useRetryEmail";

interface EmailsTableProps {
  emails: ScheduledEmail[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const EMAIL_STATUS_FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Sent", value: "SENT" },
  { label: "Failed", value: "FAILED" },
];

export function EmailsTable({ emails, isLoading, isError, onRetry }: EmailsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const firstCampaignId = emails?.[0]?.campaignId;
  const { retrySingle } = useRetryEmail(firstCampaignId);

  if (isLoading) {
    return (
      <div className="space-y-2 p-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={Mail}
        title="Couldn't load email activity"
        description="Something went wrong reaching the server."
        action={
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Retry
          </Button>
        }
      />
    );
  }

  if (!emails?.length) {
    return (
      <EmptyState
        icon={Mail}
        title="No email activity yet"
        description="Emails will appear here once the campaign is scheduled."
      />
    );
  }

  const filtered = emails.filter((e) => {
    const matchesSearch = e.recipient.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
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
            placeholder="Search recipient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-1 py-1.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-border-strong"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="mr-1 h-3.5 w-3.5 shrink-0 text-text-tertiary" />
          {EMAIL_STATUS_FILTERS.map((filter) => (
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
          No email records match your filter criteria.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-text-tertiary">
                  <th scope="col" className="px-5 py-3 font-medium">Recipient</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  <th scope="col" className="px-5 py-3 font-medium">Scheduled</th>
                  <th scope="col" className="px-5 py-3 font-medium">Sent</th>
                  <th scope="col" className="px-5 py-3 font-medium">Attempts</th>
                  <th scope="col" className="px-5 py-3 font-medium">Error</th>
                  <th scope="col" className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((email) => (
                  <tr
                    key={email.id}
                    className="border-b border-border-subtle transition-colors last:border-b-0 hover:bg-surface-2"
                  >
                    <td className="px-5 py-3 font-medium text-text-primary">{email.recipient}</td>
                    <td className="px-5 py-3">
                      <EmailStatusBadge status={email.status} />
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{formatDate(email.scheduledAt)}</td>
                    <td className="px-5 py-3 text-text-secondary">{formatDate(email.sentAt)}</td>
                    <td className="px-5 py-3 text-text-secondary">{email.attempts}</td>
                    <td className="max-w-xs truncate px-5 py-3 text-status-failed text-xs">
                      {email.errorMessage ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {email.status === "FAILED" ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => retrySingle.mutate(email.id)}
                          isLoading={retrySingle.isPending && retrySingle.variables === email.id}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Retry
                        </Button>
                      ) : (
                        <span className="text-xs text-text-tertiary">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="divide-y divide-border sm:hidden">
            {filtered.map((email) => (
              <div key={email.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-text-primary text-sm break-all">{email.recipient}</span>
                  <EmailStatusBadge status={email.status} />
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-text-secondary">
                  <div>Scheduled: {formatDate(email.scheduledAt)}</div>
                  <div>Sent: {formatDate(email.sentAt)}</div>
                  <div>Attempts: {email.attempts}</div>
                </div>
                {email.errorMessage && (
                  <div className="text-xs text-status-failed bg-status-failed/10 border border-status-failed/20 rounded p-2 break-all">
                    {email.errorMessage}
                  </div>
                )}
                {email.status === "FAILED" && (
                  <div className="pt-1 flex justify-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => retrySingle.mutate(email.id)}
                      isLoading={retrySingle.isPending && retrySingle.variables === email.id}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Retry Email
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}