import type { LucideIcon } from "lucide-react";
import { Surface } from "../ui/Surface";
import { Skeleton } from "../ui/Skeleton";

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: LucideIcon;
  isLoading: boolean;
}

export function StatCard({ label, value, icon: Icon, isLoading }: StatCardProps) {
  return (
    <Surface className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">{label}</span>
        <Icon className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
      </div>
      {isLoading ? (
        <Skeleton className="mt-3 h-7 w-16" />
      ) : (
        <span className="mt-2 block text-2xl font-semibold tabular-nums text-text-primary">
          {value?.toLocaleString() ?? "—"}
        </span>
      )}
    </Surface>
  );
}