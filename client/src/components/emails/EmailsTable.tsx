import { Mail } from "lucide-react";
import type { ScheduledEmail } from "../../types/email";
import { EmailStatusBadge } from "./EmailStatusBadge";
import { Skeleton } from "../ui/Skeleton";
import { EmptyState } from "../ui/EmptyState";
import { Button } from "../ui/Button";
import { formatDate } from "../../lib/format";

interface EmailsTableProps {
  emails: ScheduledEmail[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function EmailsTable({ emails, isLoading, isError, onRetry }: EmailsTableProps) {
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-text-tertiary">
            <th scope="col" className="px-5 py-3 font-medium">Recipient</th>
            <th scope="col" className="px-5 py-3 font-medium">Status</th>
            <th scope="col" className="px-5 py-3 font-medium">Scheduled</th>
            <th scope="col" className="px-5 py-3 font-medium">Sent</th>
            <th scope="col" className="px-5 py-3 font-medium">Attempts</th>
            <th scope="col" className="px-5 py-3 font-medium">Error</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => (
            <tr
              key={email.id}
              className="border-b border-border-subtle transition-colors last:border-b-0 hover:bg-surface-2"
            >
              <td className="px-5 py-3 text-text-primary">{email.recipient}</td>
              <td className="px-5 py-3">
                <EmailStatusBadge status={email.status} />
              </td>
              <td className="px-5 py-3 text-text-secondary">{formatDate(email.scheduledAt)}</td>
              <td className="px-5 py-3 text-text-secondary">{formatDate(email.sentAt)}</td>
              <td className="px-5 py-3 text-text-secondary">{email.attempts}</td>
              <td className="max-w-xs truncate px-5 py-3 text-status-failed">
                {email.errorMessage ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}