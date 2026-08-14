import { useState } from "react";
import { UserCheck, Plus, Trash2, Mail, AlertTriangle } from "lucide-react";
import { useSenders, useDeleteSender } from "../../hooks/useSenders";
import { Surface } from "../ui/Surface";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Skeleton";
import { Dialog } from "../ui/Dialog";
import { AddSenderModal } from "./AddSenderModal";
import { useToast } from "../../context/ToastContext";
import type { Sender } from "../../types/sender";

export function SenderManagementSection() {
  const { data, isLoading, isError, refetch } = useSenders();
  const deleteSender = useDeleteSender();
  const { showSuccess, showError } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [senderToDelete, setSenderToDelete] = useState<Sender | null>(null);

  function handleDeleteConfirm() {
    if (!senderToDelete) return;

    deleteSender.mutate(senderToDelete.id, {
      onSuccess: () => {
        showSuccess("Sender Removed", `"${senderToDelete.name}" has been deleted.`);
        setSenderToDelete(null);
      },
      onError: (err: any) => {
        showError("Delete Failed", err.message || "Failed to delete sender identity.");
      },
    });
  }

  const senders = data?.senders || [];

  return (
    <Surface className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3">
        <div className="flex items-center gap-2.5">
          <UserCheck className="h-5 w-5 text-accent" />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Sender Identities</h3>
            <p className="text-xs text-text-tertiary">
              Manage your personal sender profiles for outgoing campaigns
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="self-start sm:self-auto">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Sender
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : isError ? (
        <div className="rounded-md border border-status-failed/40 bg-status-failed/10 p-4 text-xs text-status-failed flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Could not load your sender identities.</span>
          </div>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : senders.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-surface-1 p-6 text-center space-y-2">
          <Mail className="h-8 w-8 text-text-tertiary mx-auto" />
          <p className="text-sm font-medium text-text-primary">No senders yet</p>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            You haven't created any custom sender identities. Create one to use when sending campaigns.
          </p>
          <div className="pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Your First Sender
            </Button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-md border border-border bg-surface-1 overflow-hidden">
          {senders.map((sender) => (
            <div
              key={sender.id}
              className="flex items-center justify-between p-4 hover:bg-surface-2 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">{sender.name}</p>
                <p className="text-xs text-text-secondary">{sender.email}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSenderToDelete(sender)}
                className="text-status-failed hover:bg-status-failed/10 hover:border-status-failed/40"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add Sender Modal */}
      <AddSenderModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!senderToDelete}
        onClose={() => setSenderToDelete(null)}
        title="Delete Sender Identity"
        description={`Are you sure you want to delete "${senderToDelete?.name}" (${senderToDelete?.email})? Future campaigns will no longer be able to select this sender.`}
        confirmLabel="Delete Sender"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        isConfirming={deleteSender.isPending}
      />
    </Surface>
  );
}
