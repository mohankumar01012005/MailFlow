import { useState } from "react";
import {
  Server,
  Send,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useSettings, useSendTestEmail } from "../hooks/useSettings";
import { Surface } from "../components/ui/Surface";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";

export default function Settings() {
  const { data, isLoading, isError, refetch } = useSettings();
  const sendTestEmail = useSendTestEmail();

  const [testEmailRecipient, setTestEmailRecipient] = useState("");
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !data?.settings) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Couldn't load settings"
        description="Something went wrong reaching the server. Check that the backend is running."
        action={
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        }
      />
    );
  }

  const { smtp, sendingDefaults, senderIdentity } = data.settings;

  function handleSendTestEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!testEmailRecipient.trim()) return;

    setTestSuccessMessage(null);
    setPreviewUrl(null);

    sendTestEmail.mutate(testEmailRecipient, {
      onSuccess: (res) => {
        setTestSuccessMessage(res.message);
        if (typeof res.result.previewUrl === "string") {
          setPreviewUrl(res.result.previewUrl);
        }
      },
    });
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Settings & Transport Configuration</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your email transport layer, default sending parameters, and diagnostic tools.
        </p>
      </div>

      {/* SMTP Transport Card */}
      <Surface className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <Server className="h-5 w-5 text-accent" />
            <div>
              <h3 className="text-sm font-semibold text-text-primary">SMTP Transport Layer</h3>
              <p className="text-xs text-text-tertiary">Current email sending infrastructure provider</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-status-sent/10 border border-status-sent/30 px-3 py-1 text-xs font-medium text-status-sent">
            <ShieldCheck className="h-3.5 w-3.5" />
            {smtp.status}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-surface-1 p-3">
            <p className="text-xs text-text-tertiary font-medium">Provider</p>
            <p className="mt-1 text-sm font-semibold text-text-primary">{smtp.provider}</p>
          </div>
          <div className="rounded-md border border-border bg-surface-1 p-3">
            <p className="text-xs text-text-tertiary font-medium">SMTP Host & Port</p>
            <p className="mt-1 text-sm font-semibold text-text-primary">
              {smtp.host}:{smtp.port}
            </p>
          </div>
          <div className="rounded-md border border-border bg-surface-1 p-3">
            <p className="text-xs text-text-tertiary font-medium">Authenticated Account</p>
            <p className="mt-1 text-sm font-semibold text-text-primary truncate">{smtp.user}</p>
          </div>
        </div>
      </Surface>

      {/* Diagnostic Test Email Dispatcher */}
      <Surface className="p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-border pb-4">
          <Send className="h-5 w-5 text-accent" />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">SMTP Transport Diagnostic Test</h3>
            <p className="text-xs text-text-tertiary">Send a live test email through Nodemailer to verify delivery</p>
          </div>
        </div>

        <form onSubmit={handleSendTestEmail} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="email"
            placeholder="Enter target recipient email (e.g. test@example.com)..."
            value={testEmailRecipient}
            onChange={(e) => setTestEmailRecipient(e.target.value)}
            required
            className="flex-1 rounded-md border border-border bg-surface-1 py-2 px-3.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-border-strong"
          />
          <Button type="submit" isLoading={sendTestEmail.isPending} className="shrink-0">
            Send Test Email
          </Button>
        </form>

        {sendTestEmail.isError && (
          <div className="flex items-center gap-2 rounded-md border border-status-failed/40 bg-status-failed/10 px-4 py-3 text-sm text-status-failed">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {sendTestEmail.error?.message || "Failed to send test email"}
          </div>
        )}

        {testSuccessMessage && (
          <div className="space-y-2 rounded-md border border-status-completed/40 bg-status-completed/10 p-4 text-sm text-status-completed">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {testSuccessMessage}
            </div>
            {previewUrl && (
              <div className="pt-1">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium underline text-xs hover:text-text-primary"
                >
                  View message in Ethereal Inbox Preview
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        )}
      </Surface>

      {/* Default Sending Limits */}
      <Surface className="p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-border pb-4">
          <Clock className="h-5 w-5 text-accent" />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Default Campaign Controls</h3>
            <p className="text-xs text-text-tertiary">Pre-configured rate controls applied to new email campaigns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-surface-1 p-4 space-y-1">
            <p className="text-xs text-text-tertiary">Default Delay Between Emails</p>
            <p className="text-xl font-bold text-text-primary">{sendingDefaults.defaultDelayBetweenEmails}s</p>
            <p className="text-xs text-text-secondary">Staggers BullMQ job execution timestamps</p>
          </div>

          <div className="rounded-md border border-border bg-surface-1 p-4 space-y-1">
            <p className="text-xs text-text-tertiary">Default Hourly Limit</p>
            <p className="text-xl font-bold text-text-primary">{sendingDefaults.defaultHourlyLimit} / hr</p>
            <p className="text-xs text-text-secondary">Prevents domain throttling</p>
          </div>

          <div className="rounded-md border border-border bg-surface-1 p-4 space-y-1">
            <p className="text-xs text-text-tertiary">Max Retries Per Email</p>
            <p className="text-xl font-bold text-text-primary">{sendingDefaults.maxRetriesPerEmail} Attempts</p>
            <p className="text-xs text-text-secondary">BullMQ automatic retry attempt cap</p>
          </div>
        </div>
      </Surface>

      {/* Sender Identity Card */}
      <Surface className="p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-border pb-4">
          <User className="h-5 w-5 text-accent" />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Sender Identity Preset</h3>
            <p className="text-xs text-text-tertiary">Default credentials stamped on outgoing email headers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-text-tertiary">Sender Display Name</p>
            <p className="mt-1 text-sm font-medium text-text-primary">{senderIdentity.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-text-tertiary">Sender Email Address</p>
            <p className="mt-1 text-sm font-medium text-text-primary truncate">{senderIdentity.email}</p>
          </div>
        </div>
      </Surface>
    </div>
  );
}