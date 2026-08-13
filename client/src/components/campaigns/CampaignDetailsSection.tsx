import { Surface } from "../ui/Surface";
import { Input } from "../ui/Input";

interface CampaignDetailsSectionProps {
  subject: string;
  body: string;
  onSubjectChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  errors: { subject?: string; body?: string };
}

export function CampaignDetailsSection({
  subject,
  body,
  onSubjectChange,
  onBodyChange,
  errors,
}: CampaignDetailsSectionProps) {
  return (
    <Surface className="p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-text-primary">Campaign details</h2>
        <p className="mt-1 text-sm text-text-secondary">
          The subject and message your recipients will see.
        </p>
      </div>

      <div className="space-y-4">
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
      </div>
    </Surface>
  );
}