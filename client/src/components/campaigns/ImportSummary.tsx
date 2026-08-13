import { CheckCircle2, Copy, XCircle, FileText } from "lucide-react";
import type { ImportSummary as ImportSummaryType } from "../../types/campaign";
import { Surface } from "../ui/Surface";

interface ImportSummaryProps {
  summary: ImportSummaryType;
}

export function ImportSummary({ summary }: ImportSummaryProps) {
  const rows = [
    { icon: FileText, label: "Total rows", value: summary.totalRows, tone: "text-text-secondary" },
    { icon: CheckCircle2, label: "Valid recipients", value: summary.validEmails, tone: "text-status-completed" },
    { icon: Copy, label: "Duplicates removed", value: summary.duplicates, tone: "text-status-paused" },
    { icon: XCircle, label: "Invalid emails skipped", value: summary.invalidEmails, tone: "text-status-failed" },
  ];

  return (
    <Surface className="divide-y divide-border-subtle">
      {rows.map(({ icon: Icon, label, value, tone }) => (
        <div key={label} className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${tone}`} aria-hidden="true" />
            <span className="text-sm text-text-secondary">{label}</span>
          </div>
          <span className={`text-sm font-semibold tabular-nums ${tone}`}>{value}</span>
        </div>
      ))}
    </Surface>
  );
}