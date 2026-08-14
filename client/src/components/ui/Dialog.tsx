import { type ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "./Button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: "primary" | "danger";
  onConfirm: () => void;
  isConfirming?: boolean;
  children?: ReactNode;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  confirmVariant = "primary",
  onConfirm,
  isConfirming,
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    if (dialogRef.current && !dialogRef.current.contains(document.activeElement)) {
      dialogRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        tabIndex={-1}
        className="w-full max-w-sm rounded-md border border-border bg-surface-1 p-5 shadow-xl outline-none"
      >
        <div className="flex items-start justify-between">
          <h2 id="dialog-title" className="text-sm font-semibold text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-text-tertiary hover:bg-surface-2 hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p id="dialog-description" className="mt-2 text-sm text-text-secondary">
          {description}
        </p>
        {children}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            size="sm"
            onClick={onConfirm}
            isLoading={isConfirming}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}