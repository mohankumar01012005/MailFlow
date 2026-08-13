import { useRef, useState } from "react";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
import { useScheduleCampaignCsv } from "../../hooks/useScheduleCampaignCsv";
import { ApiError } from "../../api/client";
import type { CsvValidationErrorData, ScheduleCampaignCsvResponse } from "../../types/campaign";
import { Button } from "../ui/Button";
import { Surface } from "../ui/Surface";
import { ImportSummary } from "./ImportSummary";
import { cn } from "../../lib/utils";

interface CsvUploadProps {
  campaignId: string;
  onScheduled: (response: ScheduleCampaignCsvResponse) => void;
}

export function CsvUpload({ campaignId, onScheduled }: CsvUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scheduleCsv = useScheduleCampaignCsv(campaignId);

  const validationError =
    scheduleCsv.error instanceof ApiError
      ? (scheduleCsv.error.data as CsvValidationErrorData | undefined)
      : undefined;

  function handleFiles(fileList: FileList | null) {
    const selected = fileList?.[0];
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(".csv")) return;
    setFile(selected);
    scheduleCsv.reset();
  }

  function handleUpload() {
    if (!file) return;
    scheduleCsv.mutate(file, {
      onSuccess: (response) => onScheduled(response),
    });
  }

  return (
    <Surface className="p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-text-primary">Recipients</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Upload a CSV of recipient email addresses. This will schedule the campaign to start
          sending.
        </p>
      </div>

      {!file ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-6 py-10 text-center transition-colors",
            isDragging ? "border-accent bg-accent-muted/20" : "border-border hover:border-border-strong"
          )}
        >
          <UploadCloud className="h-6 w-6 text-text-tertiary" aria-hidden="true" />
          <p className="text-sm font-medium text-text-primary">
            Drag and drop your CSV, or click to browse
          </p>
          <p className="text-xs text-text-tertiary">CSV files only, up to 5MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            aria-label="Upload recipients CSV"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-md border border-border bg-surface-2 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-text-primary">
              <FileText className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
              {file.name}
            </div>
            <button
              onClick={() => {
                setFile(null);
                scheduleCsv.reset();
              }}
              aria-label="Remove file"
              className="rounded-md p-1 text-text-tertiary hover:bg-surface-3 hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {scheduleCsv.isError && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-md border border-status-failed/40 bg-status-failed/10 px-4 py-3 text-sm text-status-failed">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {validationError?.message ?? "Something went wrong uploading the CSV."}
              </div>
              {validationError?.totalRows !== undefined && (
                <ImportSummary
                  summary={{
                    totalRows: validationError.totalRows ?? 0,
                    validEmails: validationError.validEmails ?? 0,
                    duplicates: validationError.duplicates ?? 0,
                    invalidEmails: validationError.invalidEmails ?? 0,
                  }}
                />
              )}
            </div>
          )}

          <Button onClick={handleUpload} isLoading={scheduleCsv.isPending}>
            Upload & Schedule Campaign
          </Button>
        </div>
      )}
    </Surface>
  );
}