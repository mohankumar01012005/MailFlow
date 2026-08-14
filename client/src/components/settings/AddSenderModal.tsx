import { useState } from "react";
import { Dialog } from "../ui/Dialog";
import { Input } from "../ui/Input";
import { useCreateSender } from "../../hooks/useSenders";
import { useToast } from "../../context/ToastContext";

interface AddSenderModalProps {
  open: boolean;
  onClose: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AddSenderModal({ open, onClose }: AddSenderModalProps) {
  const createSender = useCreateSender();
  const { showSuccess, showError } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  function resetForm() {
    setName("");
    setEmail("");
    setNameError(null);
    setEmailError(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit() {
    setNameError(null);
    setEmailError(null);

    let hasError = false;
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setNameError("Sender display name is required.");
      hasError = true;
    }

    if (!trimmedEmail) {
      setEmailError("Sender email address is required.");
      hasError = true;
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }

    if (hasError) return;

    createSender.mutate(
      { name: trimmedName, email: trimmedEmail },
      {
        onSuccess: (res) => {
          showSuccess("Sender Added", `"${res.sender.name}" has been created successfully.`);
          handleClose();
        },
        onError: (err: any) => {
          showError("Failed to Add Sender", err.message || "Failed to create sender identity.");
        },
      }
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Add New Sender"
      description="Create a custom sender identity for your outgoing email campaigns."
      confirmLabel="Add Sender"
      confirmVariant="primary"
      onConfirm={handleSubmit}
      isConfirming={createSender.isPending}
    >
      <div className="mt-4 space-y-4">
        <Input
          label="Sender Name"
          placeholder="e.g. MailFlow Growth Team"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError || undefined}
        />
        <Input
          label="Sender Email Address"
          type="email"
          placeholder="e.g. growth@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError || undefined}
        />
      </div>
    </Dialog>
  );
}
