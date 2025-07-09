"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { api } from "~/trpc/react";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be at most 1000 characters"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  promptCardId: string;
  isEditing?: boolean;
  editingCommentId?: string;
  initialContent?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CommentForm({
  promptCardId,
  isEditing = false,
  editingCommentId,
  initialContent = "",
  onSuccess,
  onCancel,
}: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: initialContent,
    },
  });

  const utils = api.useUtils();

  const createMutation = api.comment.create.useMutation({
    onSuccess: () => {
      form.reset();
      void utils.comment.getByCard.invalidate({ promptCardId });
      void utils.promptCard.getById.invalidate({ id: promptCardId });
      toast.success("Comment posted successfully!");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const updateMutation = api.comment.update.useMutation({
    onSuccess: () => {
      void utils.comment.getByCard.invalidate({ promptCardId });
      toast.success("Comment updated successfully!");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true);

    if (isEditing && editingCommentId) {
      updateMutation.mutate({
        id: editingCommentId,
        content: data.content,
      });
    } else {
      createMutation.mutate({
        promptCardId,
        content: data.content,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <textarea
                  {...field}
                  placeholder={
                    isEditing ? "Edit your comment..." : "Write a comment..."
                  }
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                  maxLength={1000}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            {form.watch("content")?.length ?? 0}/1000
          </span>

          <div className="flex gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !form.watch("content")?.trim()}
            >
              {isSubmitting
                ? "Posting..."
                : isEditing
                  ? "Update Comment"
                  : "Post Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
