import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, UploadCloud, UserPlus } from "lucide-react";
import { CampaignDetailsSection } from "../components/campaigns/CampaignDetailsSection";
import { SchedulingSection } from "../components/campaigns/SchedulingSection";
import { SchedulePreview } from "../components/campaigns/SchedulePreview";
import { CsvUpload } from "../components/campaigns/CsvUpload";
import { ImportSummary } from "../components/campaigns/ImportSummary";
import { Button } from "../components/ui/Button";
import { Surface } from "../components/ui/Surface";
import { useCreateCampaign } from "../hooks/useCreateCampaign";
import { useScheduleCampaign } from "../hooks/useScheduleCampaign";
import { useAuth } from "../context/AuthContext";
import type { Campaign, ScheduleCampaignCsvResponse } from "../types/campaign";
import { cn } from "../lib/utils";

import { useToast } from "../context/ToastContext";

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
  const { user } = useAuth();
  const { showSuccess, showInfo, showError } = useToast();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [startTime, setStartTime] = useState("");
  const [delayBetweenEmails, setDelayBetweenEmails] = useState(60);
  const [hourlyLimit, setHourlyLimit] = useState(100);
  const [errors, setErrors] = useState<FormErrors>({});

  const [draftCampaign, setDraftCampaign] = useState<Campaign | null>(null);
  const [scheduleResult, setScheduleResult] = useState<ScheduleCampaignCsvResponse | null>(null);

  // Recipient input mode: CSV or Manual
  const [recipientTab, setRecipientTab] = useState<"csv" | "manual">("csv");
  const [manualRecipientsText, setManualRecipientsText] = useState("");
  const [manualError, setManualError] = useState<string | null>(null);

  const scheduleCampaign = useScheduleCampaign(draftCampaign?.id ?? "");

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
        userId: user?.id ?? import.meta.env.VITE_DEV_USER_ID,
        subject,
        body,
        startTime: new Date(startTime).toISOString(),
        delayBetweenEmails,
        hourlyLimit,
      },
      {
        onSuccess: (response) => {
          setDraftCampaign(response.campaign);
          showSuccess("Draft Saved", `"${response.campaign.subject}" has been saved as a draft.`);
        },
        onError: (err: any) => {
          showError("Failed to Save Draft", err.message || "Failed to create campaign draft.");
        },
      }
    );
  }

  function handleManualSchedule() {
    setManualError(null);
    const rawList = manualRecipientsText
      .split(/[\n,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (rawList.length === 0) {
      setManualError("Please enter at least one email address.");
      return;
    }

    if (!draftCampaign) return;

    scheduleCampaign.mutate(
      {
        recipients: rawList,
        startTime: draftCampaign.startTime,
        delayBetweenEmails: draftCampaign.delayBetweenEmails ?? 60,
        hourlyLimit: draftCampaign.hourlyLimit ?? 100,
      },
      {
        onSuccess: (res) => {
          showInfo("Campaign Scheduled", `${res.totalRecipients} recipients scheduled into sending pipeline.`);
          setScheduleResult({
            success: true,
            message: res.message,
            campaign: res.campaign,
            importSummary: {
              totalRows: res.totalRecipients,
              validEmails: res.totalRecipients,
              duplicates: 0,
              invalidEmails: 0,
            },
            schedulingSummary: {
              totalRecipients: res.totalRecipients,
              intervalBetweenEmails: res.intervalBetweenEmails,
            },
            scheduledEmails: res.scheduledEmails,
          });
        },
        onError: (err: any) => {
          showError("Scheduling Error", err.message || "Failed to schedule campaign recipients.");
        },
      }
    );
  }

  // Step 2: recipients / CSV upload or Manual Input, once draft exists.
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
            "{draftCampaign.subject}" has been saved as a draft. Choose how to add recipients to schedule it.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setRecipientTab("csv")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              recipientTab === "csv"
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            <UploadCloud className="h-4 w-4" />
            Upload CSV File
          </button>
          <button
            onClick={() => setRecipientTab("manual")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              recipientTab === "manual"
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            <UserPlus className="h-4 w-4" />
            Enter Emails Manually
          </button>
        </div>

        {recipientTab === "csv" ? (
          <CsvUpload campaignId={draftCampaign.id} onScheduled={setScheduleResult} />
        ) : (
          <Surface className="p-6 space-y-4">
            <div>
              <label htmlFor="manual-emails" className="block text-sm font-medium text-text-primary mb-1">
                Recipient Email Addresses
              </label>
              <p className="text-xs text-text-tertiary mb-2">
                Enter or paste email addresses separated by commas or new lines.
              </p>
              <textarea
                id="manual-emails"
                rows={5}
                value={manualRecipientsText}
                onChange={(e) => setManualRecipientsText(e.target.value)}
                placeholder="alice@example.com, bob@example.com&#10;fail-once@example.com"
                className="w-full rounded-md border border-border bg-surface-1 p-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
              />
            </div>

            {manualError && (
              <div className="flex items-center gap-2 rounded-md border border-status-failed/40 bg-status-failed/10 px-4 py-3 text-sm text-status-failed">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {manualError}
              </div>
            )}

            {scheduleCampaign.isError && (
              <div className="flex items-center gap-2 rounded-md border border-status-failed/40 bg-status-failed/10 px-4 py-3 text-sm text-status-failed">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Failed to schedule campaign recipients.
              </div>
            )}

            <Button onClick={handleManualSchedule} isLoading={scheduleCampaign.isPending}>
              Schedule Campaign
            </Button>
          </Surface>
        )}

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