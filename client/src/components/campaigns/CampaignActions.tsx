import { useState } from "react";
import { Link } from "react-router-dom";
import { Pause, Play, XCircle, Eye } from "lucide-react";
import type { Campaign } from "../../types/campaign";
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import { useCampaignActions } from "../../hooks/useCampaignActions";

interface CampaignActionsProps {
  campaign: Campaign;
}

type PendingAction = "pause" | "resume" | "cancel" | null;

const actionCopy: Record<Exclude<PendingAction, null>, { title: string; description: string; confirmLabel: string }> = {
  pause: {
    title: "Pause campaign?",
    description: "Pending emails will remain in the campaign and can be resumed later.",
    confirmLabel: "Pause",
  },
  resume: {
    title: "Resume campaign?",
    description: "Pending emails will be placed back into the sending queue.",
    confirmLabel: "Resume",
  },
  cancel: {
    title: "Cancel campaign?",
    description:
      "This will stop all remaining scheduled emails. Already sent emails will not be affected.",
    confirmLabel: "Cancel campaign",
  },
};

export function CampaignActions({ campaign }: CampaignActionsProps) {
  const [pending, setPending] = useState<PendingAction>(null);
  const { pause, resume, cancel } = useCampaignActions(campaign.id);

  const mutationFor: Record<Exclude<PendingAction, null>, typeof pause> = {
    pause,
    resume,
    cancel,
  };

  const handleConfirm = () => {
    if (!pending) return;
    mutationFor[pending].mutate(undefined, {
      onSuccess: () => setPending(null),
    });
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {(campaign.status === "SCHEDULED" || campaign.status === "RUNNING") && (
          <Button variant="ghost" size="sm" onClick={() => setPending("pause")}>
            <Pause className="h-4 w-4" />
            Pause
          </Button>
        )}
        {campaign.status === "PAUSED" && (
          <Button variant="ghost" size="sm" onClick={() => setPending("resume")}>
            <Play className="h-4 w-4" />
            Resume
          </Button>
        )}
        {(campaign.status === "SCHEDULED" ||
          campaign.status === "RUNNING" ||
          campaign.status === "PAUSED") && (
          <Button variant="ghost" size="sm" onClick={() => setPending("cancel")}>
            <XCircle className="h-4 w-4" />
            Cancel
          </Button>
        )}
        <Link to={`/campaigns/${campaign.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
            View
          </Button>
        </Link>
      </div>

      {pending && (
        <Dialog
          open={!!pending}
          onClose={() => setPending(null)}
          title={actionCopy[pending].title}
          description={actionCopy[pending].description}
          confirmLabel={actionCopy[pending].confirmLabel}
          confirmVariant={pending === "cancel" ? "danger" : "primary"}
          onConfirm={handleConfirm}
          isConfirming={mutationFor[pending].isPending}
        />
      )}
    </>
  );
}