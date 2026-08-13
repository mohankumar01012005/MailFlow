import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { CampaignDetailsSection } from "../components/campaigns/CampaignDetailsSection";
import { SchedulingSection } from "../components/campaigns/SchedulingSection";
import { SchedulePreview } from "../components/campaigns/SchedulePreview";
import { CsvUpload } from "../components/campaigns/CsvUpload";
import { ImportSummary } from "../components/campaigns/ImportSummary";
import { Button } from "../components/ui/Button";
import { Surface } from "../components/ui/Surface";
import { useCreateCampaign } from "../hooks/useCreateCampaign";
import type { Campaign, ScheduleCampaignCsvResponse } from "../types/campaign";

interface FormErrors {
  subject?: string;
  body?: string;
  startTime?: string;
  delayBetweenEmails?: string;
  hourlyLimit?: string;
}

export default function CreateCampaign() {
  const navigate = useNavigate();
  const createCampaign = useCreateCampaign();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [startTime, setStartTime] = useState("");
  const [delayBetweenEmails, setDelayBetweenEmails] = useState(60);
  const [hourlyLimit, setHourlyLimit] = useState(100);
  const [errors, setErrors] = useState<FormErrors>({});

  const [draftCampaign, setDraftCampaign] = useState<Campaign | null>(null);
  const [scheduleResult, setScheduleResult] = useState<ScheduleCampaignCsvResponse | null>(null);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!subject.trim()) next.subject = "Subject is required.";
    if (!body.trim()) next.body = "Email body is required.";
    if (!startTime) {
      next.startTime = "Start time is required.";
    } else if (new Date(startTime).getTime() < Date.now()) {
      next.startTime = "Start time must be in the future.";
    }
    if (delayBetweenEmails <= 0) next.delayBetweenEmails = "Must be greater than 0.";
    if (hourlyLimit <= 0) next.hourlyLimit = "Must be greater than 0.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSaveDraft() {
    if (!validate()) return;
    createCampaign.mutate(
      {
        // TEMPORARY: no auth yet, using a fixed dev user. Replace once login exists.
        userId: import.meta.env.VITE_DEV_USER_ID,
        subject,
        body,
        startTime: new Date(startTime).toISOString(),
        delayBetweenEmails,
        hourlyLimit,
      },
      { onSuccess: (response) => setDraftCampaign(response.campaign) }
    );
  }

  // Step 2: recipients / CSV upload, once the draft exists.
  if (draftCampaign) {
    if (scheduleResult) {
      return (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex items-center gap-2 rounded-md border border-status-completed/40 bg-status-completed/10 px-4 py-3 text-sm text-status-completed">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {scheduleResult.message}
          </div>
          <ImportSummary summary={scheduleResult.importSummary} />
          <Surface className="p-4">
            <p className="text-sm text-text-secondary">
              {scheduleResult.schedulingSummary.totalRecipients} recipients scheduled, sending
              every {scheduleResult.schedulingSummary.intervalBetweenEmails}s.
            </p>
          </Surface>
          <div className="flex justify-end">
            <Button onClick={() => navigate("/campaigns")}>Done</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Add recipients</h2>
          <p className="mt-1 text-sm text-text-secondary">
            "{draftCampaign.subject}" has been saved as a draft. Upload recipients to schedule
            it.
          </p>
        </div>

        <CsvUpload campaignId={draftCampaign.id} onScheduled={setScheduleResult} />

        <div className="flex justify-end">
          <Button variant="secondary" onClick={() => navigate("/campaigns")}>
            Finish later
          </Button>
        </div>
      </div>
    );
  }

  // Step 1: campaign details + scheduling config.
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">New campaign</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Set up your message and sending schedule. You'll add recipients in the next step.
        </p>
      </div>

      <CampaignDetailsSection
        subject={subject}
        body={body}
        onSubjectChange={setSubject}
        onBodyChange={setBody}
        errors={errors}
      />

      <SchedulingSection
        startTime={startTime}
        delayBetweenEmails={delayBetweenEmails}
        hourlyLimit={hourlyLimit}
        onStartTimeChange={setStartTime}
        onDelayChange={setDelayBetweenEmails}
        onHourlyLimitChange={setHourlyLimit}
        errors={errors}
      />

      <SchedulePreview
        startTime={startTime}
        delayBetweenEmails={delayBetweenEmails}
        hourlyLimit={hourlyLimit}
      />

      {createCampaign.isError && (
        <div className="flex items-center gap-2 rounded-md border border-status-failed/40 bg-status-failed/10 px-4 py-3 text-sm text-status-failed">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Something went wrong creating the campaign. Please try again.
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => navigate("/campaigns")}>
          Cancel
        </Button>
        <Button onClick={handleSaveDraft} isLoading={createCampaign.isPending}>
          Save Draft
        </Button>
      </div>
    </div>
  );
}