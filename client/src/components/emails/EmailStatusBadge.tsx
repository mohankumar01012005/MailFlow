import type { EmailStatus } from "../../types/email";
import { Badge } from "../ui/Badge";

export function EmailStatusBadge({ status }: { status: EmailStatus }) {
  return <Badge status={status} />;
}