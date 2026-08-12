import { parse } from "csv-parse/sync";

export interface RecipientImportResult {
  recipients: string[];
  totalRows: number;
  validEmails: number;
  duplicates: number;
  invalidEmails: number;
}

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseRecipientCsv(
  csvContent: string
): RecipientImportResult {
  const rows = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  const recipients: string[] = [];
  const seen = new Set<string>();

  let duplicates = 0;
  let invalidEmails = 0;

  for (const row of rows) {
    const emailEntry =
      row.email ??
      row.Email ??
      row.EMAIL ??
      "";

    const email = emailEntry.trim().toLowerCase();

    if (!EMAIL_REGEX.test(email)) {
      invalidEmails++;
      continue;
    }

    if (seen.has(email)) {
      duplicates++;
      continue;
    }

    seen.add(email);
    recipients.push(email);
  }

  return {
    recipients,
    totalRows: rows.length,
    validEmails: recipients.length,
    duplicates,
    invalidEmails,
  };
}