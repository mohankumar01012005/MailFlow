import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2;
}

export function Surface({ className, level = 1, ...props }: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border",
        level === 1 ? "bg-surface-1" : "bg-surface-2",
        className
      )}
      {...props}
    />
  );
}