import { Surface } from "../ui/Surface";
import { Input } from "../ui/Input";

interface SchedulingSectionProps {
  startTime: string;
  delayBetweenEmails: number;
  hourlyLimit: number;
  onStartTimeChange: (value: string) => void;
  onDelayChange: (value: number) => void;
  onHourlyLimitChange: (value: number) => void;
  errors: { startTime?: string; delayBetweenEmails?: string; hourlyLimit?: string };
}

export function SchedulingSection({
  startTime,
  delayBetweenEmails,
  hourlyLimit,
  onStartTimeChange,
  onDelayChange,
  onHourlyLimitChange,
  errors,
}: SchedulingSectionProps) {
  return (
    <Surface className="p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-text-primary">Scheduling</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Your campaign will send emails at a controlled interval based on your configured
          delay and hourly limit.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Start time"
          type="datetime-local"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          error={errors.startTime}
        />
        <Input
          label="Delay between emails (seconds)"
          type="number"
          min={1}
          value={delayBetweenEmails}
          onChange={(e) => onDelayChange(Number(e.target.value))}
          error={errors.delayBetweenEmails}
        />
        <Input
          label="Hourly limit"
          type="number"
          min={1}
          value={hourlyLimit}
          onChange={(e) => onHourlyLimitChange(Number(e.target.value))}
          error={errors.hourlyLimit}
          hint="Max emails sent per hour"
        />
      </div>
    </Surface>
  );
}