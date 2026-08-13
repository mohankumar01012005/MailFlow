import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useCampaign } from "../hooks/useCampaign";
import { useCampaignEmails } from "../hooks/useCampaignEmails";
import { Badge } from "../components/ui/Badge";
import { Surface } from "../components/ui/Surface";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { CampaignActions } from "../components/campaigns/CampaignActions";
import { CampaignOverview } from "../components/campaigns/CampaignOverview";
import { EmailsTable } from "../components/emails/EmailsTable";
import { formatDate } from "../lib/format";

export default function CampaignDetails() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const {
    data: campaignData,
    isLoading: isCampaignLoading,
    isError: isCampaignError,
    refetch: refetchCampaign,
  } = useCampaign(campaignId!);
  const {
    data: emailsData,
    isLoading: isEmailsLoading,
    isError: isEmailsError,
    refetch: refetchEmails,
  } = useCampaignEmails(campaignId!);

  if (isCampaignLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isCampaignError || !campaignData?.campaign) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Couldn't load this campaign"
        description="It may not exist, or something went wrong reaching the server."
        action={
          <Button variant="secondary" size="sm" onClick={() => refetchCampaign()}>
            Retry
          </Button>
        }
      />
    );
  }

  const campaign = campaignData.campaign;

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/campaigns"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Campaigns
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-text-primary">{campaign.subject}</h2>
            <Badge status={campaign.status} />
          </div>
          <CampaignActions campaign={campaign} />
        </div>
      </div>

      <CampaignOverview stats={campaign.stats} />

      <Surface className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3">
        <div>
          <p className="text-xs text-text-tertiary">Start time</p>
          <p className="mt-1 text-sm font-medium text-text-primary">
            {formatDate(campaign.startTime)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-tertiary">Delay between emails</p>
          <p className="mt-1 text-sm font-medium text-text-primary">
            {campaign.delayBetweenEmails ? `${campaign.delayBetweenEmails}s` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-tertiary">Hourly limit</p>
          <p className="mt-1 text-sm font-medium text-text-primary">
            {campaign.hourlyLimit ? `${campaign.hourlyLimit} / hour` : "—"}
          </p>
        </div>
      </Surface>

      <Surface className="overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-text-primary">Email activity</h3>
        </div>
        <EmailsTable
          emails={emailsData?.emails}
          isLoading={isEmailsLoading}
          isError={isEmailsError}
          onRetry={refetchEmails}
        />
      </Surface>
    </div>
  );
}