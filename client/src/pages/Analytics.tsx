import { Link } from "react-router-dom";
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  Mail,
  AlertTriangle,
  ArrowRight,
  Activity,
} from "lucide-react";
import { useAnalytics } from "../hooks/useAnalytics";
import { Surface } from "../components/ui/Surface";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { EmailStatusBadge } from "../components/emails/EmailStatusBadge";
import { formatDate } from "../lib/format";

export default function Analytics() {
  const { data, isLoading, isError, refetch } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !data?.analytics) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Couldn't load analytics"
        description="Something went wrong reaching the server. Check that the backend is running."
        action={
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        }
      />
    );
  }

  const { overallStats, campaignPerformance, recentActivity } = data.analytics;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Analytics & Delivery Performance</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Real-time delivery efficiency and email delivery trends across all campaigns.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Success Rate */}
        <Surface className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
              Success Rate
            </span>
            <TrendingUp className="h-4 w-4 text-status-sent" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-text-primary">
              {overallStats.successRate}%
            </span>
            <span className="text-xs text-text-secondary">
              ({overallStats.sentEmails} of {overallStats.totalEmails})
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full bg-status-sent transition-all duration-500"
              style={{ width: `${overallStats.successRate}%` }}
            />
          </div>
        </Surface>

        {/* Total Sent */}
        <Surface className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
              Emails Sent
            </span>
            <CheckCircle2 className="h-4 w-4 text-status-sent" />
          </div>
          <div className="text-3xl font-bold text-text-primary">
            {overallStats.sentEmails.toLocaleString()}
          </div>
          <p className="text-xs text-text-secondary">
            {overallStats.processingEmails} currently processing
          </p>
        </Surface>

        {/* Total Failed */}
        <Surface className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
              Failed Emails
            </span>
            <XCircle className="h-4 w-4 text-status-failed" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-text-primary">
              {overallStats.failedEmails.toLocaleString()}
            </span>
            <span className="text-xs text-status-failed font-medium">
              ({overallStats.failureRate}% failure rate)
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            {overallStats.scheduledEmails} pending in queue
          </p>
        </Surface>

        {/* Total Campaigns */}
        <Surface className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
              Total Campaigns
            </span>
            <Mail className="h-4 w-4 text-accent" />
          </div>
          <div className="text-3xl font-bold text-text-primary">
            {overallStats.totalCampaigns}
          </div>
          <p className="text-xs text-text-secondary">
            Orchestrated campaigns stored
          </p>
        </Surface>
      </div>

      {/* Campaign Performance Table */}
      <Surface className="overflow-hidden">
        <div className="border-b border-border px-5 py-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Campaign Performance</h3>
          <span className="text-xs text-text-tertiary">
            {campaignPerformance.length} Total Campaigns
          </span>
        </div>

        {campaignPerformance.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-secondary">
            No campaign data available yet. Create and schedule a campaign to see insights.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-text-tertiary">
                  <th scope="col" className="px-5 py-3 font-medium">Campaign</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  <th scope="col" className="px-5 py-3 font-medium">Recipients</th>
                  <th scope="col" className="px-5 py-3 font-medium">Sent / Failed</th>
                  <th scope="col" className="px-5 py-3 font-medium">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {campaignPerformance.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border-subtle transition-colors last:border-b-0 hover:bg-surface-2"
                  >
                    <td className="px-5 py-3 font-medium text-text-primary">
                      <Link
                        to={`/campaigns/${c.id}`}
                        className="hover:underline flex items-center gap-1.5"
                      >
                        {c.subject}
                        <ArrowRight className="h-3.5 w-3.5 text-text-tertiary" />
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <Badge status={c.status as any} />
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{c.total}</td>
                    <td className="px-5 py-3 text-text-secondary">
                      <span className="text-status-sent font-medium">{c.sent}</span>
                      {" / "}
                      <span className="text-status-failed font-medium">{c.failed}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3 max-w-[160px]">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-3">
                          <div
                            className="h-full bg-status-sent transition-all duration-300"
                            style={{ width: `${c.successRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-text-primary">
                          {c.successRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Surface>

      {/* Recent Delivery Activity Log */}
      <Surface className="overflow-hidden">
        <div className="border-b border-border px-5 py-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-text-tertiary" />
          <h3 className="text-sm font-semibold text-text-primary">Live Delivery Log</h3>
        </div>

        {recentActivity.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-secondary">
            No email execution activity logged yet.
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {recentActivity.map((log) => (
              <div
                key={log.id}
                className="px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-surface-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <EmailStatusBadge status={log.status as any} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{log.recipient}</p>
                    <p className="text-xs text-text-tertiary">
                      Campaign: <span className="text-text-secondary">{log.campaign.subject}</span>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs text-text-secondary">{formatDate(log.updatedAt)}</p>
                  {log.errorMessage && (
                    <p className="text-xs text-status-failed truncate max-w-xs">
                      {log.errorMessage}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Surface>
    </div>
  );
}