"use client";

import { useState } from "react";
import { Flag, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { useAuth } from "~/lib/hooks/useAuth";

interface ReportDialogProps {
  promptCardId: string;
  trigger?: React.ReactNode;
}

const REPORT_REASONS = [
  {
    value: "SPAM",
    label: "Spam",
    description: "This content is spam or repetitive",
  },
  {
    value: "INAPPROPRIATE_CONTENT",
    label: "Inappropriate Content",
    description: "This content is offensive, harmful, or inappropriate",
  },
  {
    value: "COPYRIGHT_VIOLATION",
    label: "Copyright Violation",
    description: "This content violates copyright or intellectual property",
  },
  {
    value: "MALICIOUS_PROMPT",
    label: "Malicious Prompt",
    description:
      "This prompt is designed to cause harm or generate inappropriate content",
  },
  {
    value: "OTHER",
    label: "Other",
    description: "Other reason not listed above",
  },
] as const;

export function ReportDialog({ promptCardId, trigger }: ReportDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportMutation = api.report.create.useMutation({
    onSuccess: () => {
      toast.success(
        "Report submitted successfully. Thank you for helping keep our community safe.",
      );
      setOpen(false);
      setSelectedReason("");
      setDescription("");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to report content");
      return;
    }

    if (!selectedReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    setIsSubmitting(true);

    reportMutation.mutate({
      promptCardId,
      reason: selectedReason as
        | "SPAM"
        | "INAPPROPRIATE_CONTENT"
        | "COPYRIGHT_VIOLATION"
        | "MALICIOUS_PROMPT"
        | "OTHER",
      description: description.trim() || undefined,
    });
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedReason("");
    setDescription("");
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-red-500"
    >
      <Flag className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Report Content
          </DialogTitle>
          <DialogDescription>
            Help us keep our community safe by reporting inappropriate content.
            All reports are reviewed by our moderation team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Why are you reporting this content?
            </Label>
            <RadioGroup
              value={selectedReason}
              onValueChange={setSelectedReason}
              className="space-y-2"
            >
              {REPORT_REASONS.map((reason) => (
                <div key={reason.value} className="flex items-start space-x-2">
                  <RadioGroupItem
                    value={reason.value}
                    id={reason.value}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={reason.value}
                      className="cursor-pointer text-sm font-medium"
                    >
                      {reason.label}
                    </Label>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Additional Details (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Please provide any additional context or details about your report..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-right">
              <span className="text-muted-foreground text-xs">
                {description.length}/500
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting || !selectedReason}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
