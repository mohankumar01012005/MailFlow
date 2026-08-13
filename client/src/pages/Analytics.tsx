import { BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-surface-2">
        <BarChart3 className="h-6 w-6 text-text-tertiary" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">Analytics is coming soon</p>
        <p className="mt-1 max-w-sm text-sm text-text-secondary">
          Campaign performance insights and delivery trends will appear here once this is
          available.
        </p>
      </div>
    </div>
  );
}