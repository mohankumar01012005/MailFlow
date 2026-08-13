import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useCampaigns } from "../hooks/useCampaigns";
import { CampaignsTable } from "../components/campaigns/CampaignsTable";
import { Surface } from "../components/ui/Surface";
import { Button } from "../components/ui/Button";

export default function Campaigns() {
  const { data, isLoading, isError, refetch } = useCampaigns();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-secondary">
          All campaigns and their current delivery status.
        </p>
        <Link to="/campaigns/new" className="sm:self-auto">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4" />
            Create Campaign
          </Button>
        </Link>
      </div>

      <Surface className="overflow-hidden">
        <CampaignsTable
          campaigns={data?.campaigns}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
      </Surface>
    </div>
  );
}