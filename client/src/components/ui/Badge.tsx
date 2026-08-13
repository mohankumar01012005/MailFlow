import { cn } from "../../lib/utils";

export type StatusValue =
  | "DRAFT"
  | "SCHEDULED"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED"
  | "PROCESSING"
  | "SENT"
  | "FAILED";

interface BadgeProps {
  status: StatusValue;
  className?: string;
}

const statusConfig: Record<StatusValue, { label: string; color: string; dot: string }> = {
  DRAFT: { label: "Draft", color: "text-text-secondary bg-surface-3", dot: "bg-status-draft" },
  SCHEDULED: { label: "Scheduled", color: "text-sky-300 bg-sky-950/60", dot: "bg-status-scheduled" },
  RUNNING: { label: "Running", color: "text-indigo-300 bg-indigo-950/60", dot: "bg-status-running" },
  PAUSED: { label: "Paused", color: "text-amber-300 bg-amber-950/60", dot: "bg-status-paused" },
  COMPLETED: { label: "Completed", color: "text-emerald-300 bg-emerald-950/60", dot: "bg-status-completed" },
  CANCELLED: { label: "Cancelled", color: "text-red-300 bg-red-950/60", dot: "bg-status-cancelled" },
  PROCESSING: { label: "Processing", color: "text-indigo-300 bg-indigo-950/60", dot: "bg-status-running" },
  SENT: { label: "Sent", color: "text-emerald-300 bg-emerald-950/60", dot: "bg-status-completed" },
  FAILED: { label: "Failed", color: "text-red-300 bg-red-950/60", dot: "bg-status-failed" },
};

export function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.color,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} aria-hidden="true" />
      {config.label}
    </span>
  );
}