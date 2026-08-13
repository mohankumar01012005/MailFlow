import { Info } from "lucide-react";
import { Surface } from "../ui/Surface";

interface SchedulePreviewProps {
  startTime: string;
  delayBetweenEmails: number;
  hourlyLimit: number;
}

/**
 * Frontend-only estimate. No recipient count exists yet at this step
 * (recipients are added in the CSV import step), so this shows the
 * sending cadence only — not a recipient-based completion estimate,
 * to avoid calculating a value the backend hasn't confirmed.
 */
export function SchedulePreview({ startTime, delayBetweenEmails, hourlyLimit }: SchedulePreviewProps) {
  const formattedStart = startTime
    ? new Date(startTime).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

  return (
    <Surface className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Info className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-text-primary">Estimated schedule</h2>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-text-tertiary">First scheduled email</dt>
          <dd className="mt-1 text-sm font-medium text-text-primary">{formattedStart}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-tertiary">Sending interval</dt>
          <dd className="mt-1 text-sm font-medium text-text-primary">
            {delayBetweenEmails > 0 ? `Every ${delayBetweenEmails}s` : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-text-tertiary">Hourly cap</dt>
          <dd className="mt-1 text-sm font-medium text-text-primary">
            {hourlyLimit > 0 ? `${hourlyLimit} emails/hour` : "—"}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-text-tertiary">
        Recipient count and full completion estimate will appear once recipients are added.
      </p>
    </Surface>
  );
}