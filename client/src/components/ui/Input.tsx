import { type InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            "h-9 rounded-md border bg-surface-1 px-3 text-sm text-text-primary placeholder:text-text-tertiary transition-colors",
            "focus:border-accent focus:outline-none",
            error ? "border-status-failed" : "border-border",
            className
          )}
          {...props}
        />
        {error ? (
          <span id={`${inputId}-error`} className="text-xs text-status-failed">
            {error}
          </span>
        ) : hint ? (
          <span id={`${inputId}-hint`} className="text-xs text-text-tertiary">
            {hint}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";