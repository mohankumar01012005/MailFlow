import { Link } from "react-router-dom";
import { Mail, Clock, Loader2, CheckCircle2, XCircle, PlusCircle } from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { StatCard } from "../components/dashboard/StatCard";
import { RecentCampaigns } from "../components/dashboard/RecentCampaigns";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useDashboardStats();
  const stats = data?.stats;

  if (isError) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Couldn't load dashboard stats"
        description="Something went wrong reaching the server. Check that the backend is running."
        action={
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-secondary">
          Overview of your campaign activity and delivery pipeline.
        </p>
        <Link to="/campaigns/new" className="sm:self-auto">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4" />
            Create Campaign
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Campaigns" value={stats?.totalCampaigns} icon={Mail} isLoading={isLoading} />
        <StatCard label="Total emails" value={stats?.totalEmails} icon={Mail} isLoading={isLoading} />
        <StatCard label="Scheduled" value={stats?.scheduledEmails} icon={Clock} isLoading={isLoading} />
        <StatCard label="Processing" value={stats?.processingEmails} icon={Loader2} isLoading={isLoading} />
        <StatCard label="Sent" value={stats?.sentEmails} icon={CheckCircle2} isLoading={isLoading} />
        <StatCard label="Failed" value={stats?.failedEmails} icon={XCircle} isLoading={isLoading} />
      </div>

      <RecentCampaigns />
    </div>
  );
}