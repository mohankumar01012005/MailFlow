import { Surface } from "../ui/Surface";
import { Input } from "../ui/Input";
import { Link } from "react-router-dom";
import { AlertTriangle, Plus } from "lucide-react";
import type { Sender } from "../../types/sender";

interface CampaignDetailsSectionProps {
  subject: string;
  body: string;
  senderId: string;
  senders: Sender[];
  isLoadingSenders?: boolean;
  onSubjectChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onSenderChange: (value: string) => void;
  errors: { subject?: string; body?: string; senderId?: string };
}

export function CampaignDetailsSection({
  subject,
  body,
  senderId,
  senders,
  isLoadingSenders,
  onSubjectChange,
  onBodyChange,
  onSenderChange,
  errors,
}: CampaignDetailsSectionProps) {
  return (
    <Surface className="p-6 space-y-4">
      <div className="mb-2">
        <h2 className="text-sm font-semibold text-text-primary">Campaign details</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Configure sender identity, subject line, and email body content.
        </p>
      </div>

      {/* Sender Selection Field */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="campaign-sender" className="text-sm font-medium text-text-secondary">
          Sender Identity
        </label>
        {isLoadingSenders ? (
          <div className="h-10 w-full animate-pulse rounded-md bg-surface-2" />
        ) : senders.length === 0 ? (
          <div className="rounded-md border border-status-scheduled/30 bg-status-scheduled/10 p-3 text-xs text-status-scheduled flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>No senders available. Please create a sender identity first.</span>
            </div>
            <Link
              to="/settings"
              className="inline-flex items-center gap-1 font-semibold underline hover:text-text-primary"
            >
              <Plus className="h-3 w-3" />
              Add Sender in Settings
            </Link>
          </div>
        ) : (
          <select
            id="campaign-sender"
            value={senderId}
            onChange={(e) => onSenderChange(e.target.value)}
            className="rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
          >
            <option value="">-- Select Sender Identity --</option>
            {senders.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
        )}
        {errors.senderId && (
          <span className="text-xs text-status-failed">{errors.senderId}</span>
        )}
      </div>

      <Input
        label="Subject"
        placeholder="Q3 product announcement"
        value={subject}
        onChange={(e) => onSubjectChange(e.target.value)}
        error={errors.subject}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="campaign-body" className="text-sm font-medium text-text-secondary">
          Email body
        </label>
        <textarea
          id="campaign-body"
          rows={8}
          placeholder="Write your email content here..."
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          aria-invalid={!!errors.body}
          aria-describedby={errors.body ? "campaign-body-error" : undefined}
          className="rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
        />
        {errors.body && (
          <span id="campaign-body-error" className="text-xs text-status-failed">
            {errors.body}
          </span>
        )}
      </div>
    </Surface>
  );
}