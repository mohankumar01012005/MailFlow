import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (options: { type: ToastType; title: string; message?: string }) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, message }: { type: ToastType; title: string; message?: string }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const showSuccess = useCallback((title: string, message?: string) => toast({ type: "success", title, message }), [toast]);
  const showError = useCallback((title: string, message?: string) => toast({ type: "error", title, message }), [toast]);
  const showInfo = useCallback((title: string, message?: string) => toast({ type: "info", title, message }), [toast]);
  const showWarning = useCallback((title: string, message?: string) => toast({ type: "warning", title, message }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, showSuccess, showError, showInfo, showWarning }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          const iconMap = {
            success: <CheckCircle2 className="h-5 w-5 text-status-sent shrink-0" />,
            error: <AlertCircle className="h-5 w-5 text-status-failed shrink-0" />,
            warning: <AlertTriangle className="h-5 w-5 text-status-scheduled shrink-0" />,
            info: <Info className="h-5 w-5 text-accent shrink-0" />,
          };

          const borderMap = {
            success: "border-status-sent/30 bg-surface-1/95",
            error: "border-status-failed/30 bg-surface-1/95",
            warning: "border-status-scheduled/30 bg-surface-1/95",
            info: "border-accent/30 bg-surface-1/95",
          };

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200 ${borderMap[t.type]}`}
            >
              {iconMap[t.type]}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary">{t.title}</p>
                {t.message && <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{t.message}</p>}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-text-tertiary hover:text-text-primary transition-colors p-0.5 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
