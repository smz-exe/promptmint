"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

const promptCardSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  description: z.string().min(1, "Description is required"),
  promptText: z
    .string()
    .min(1, "Prompt text is required")
    .max(5000, "Prompt text must be at most 5000 characters"),
  categoryId: z.string().min(1, "Category is required"),
  aiModelId: z.string().min(1, "AI model is required"),
  parentPromptId: z.string().optional(),
});

type PromptCardForm = z.infer<typeof promptCardSchema>;

interface PromptCardFormProps {
  parentPrompt?: {
    id: string;
    title: string;
    author: {
      username: string;
      displayName: string;
    };
  };
  onSuccess?: (card: {
    id: string;
    title: string;
    description: string;
    promptText: string;
    author: {
      username: string;
      displayName: string;
    };
  }) => void;
  onCancel?: () => void;
}

export function PromptCardForm({
  parentPrompt,
  onSuccess,
  onCancel,
}: PromptCardFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { data: categoriesData } = api.metadata.getCategories.useQuery();
  const { data: aiModelsData } = api.metadata.getAIModels.useQuery();

  const createMutation = api.promptCard.create.useMutation({
    onSuccess: (data) => {
      toast.success("Prompt card created successfully!");
      if (onSuccess) {
        onSuccess(data.card);
      } else {
        router.push(`/cards/${data.card.id}`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<PromptCardForm>({
    resolver: zodResolver(promptCardSchema),
    defaultValues: {
      title: "",
      description: "",
      promptText: "",
      categoryId: "",
      aiModelId: "",
      parentPromptId: parentPrompt?.id,
    },
  });

  const onSubmit = async (data: PromptCardForm) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = categoriesData?.categories ?? [];
  const aiModels = aiModelsData?.aiModels ?? [];

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {parentPrompt ? "Create Fork" : "Create Prompt Card"}
        </CardTitle>
        <CardDescription>
          {parentPrompt
            ? `Create a new version based on "${parentPrompt.title}" by ${parentPrompt.author.displayName}`
            : "Share your AI prompt as a beautiful trading card"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a descriptive title for your prompt"
              disabled={isSubmitting}
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Describe what this prompt does and how to use it"
              disabled={isSubmitting}
              className={cn(
                "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                form.formState.errors.description && "border-red-500",
              )}
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="promptText">Prompt Text</Label>
            <textarea
              id="promptText"
              placeholder="Enter your prompt text here..."
              disabled={isSubmitting}
              className={cn(
                "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[200px] w-full rounded-md border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                form.formState.errors.promptText && "border-red-500",
              )}
              {...form.register("promptText")}
            />
            {form.formState.errors.promptText && (
              <p className="text-sm text-red-500">
                {form.formState.errors.promptText.message}
              </p>
            )}
            <p className="text-muted-foreground text-xs">
              {form.watch("promptText")?.length || 0} / 5000 characters
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                disabled={isSubmitting}
                className={cn(
                  "border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  form.formState.errors.categoryId && "border-red-500",
                )}
                {...form.register("categoryId")}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.categoryId && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="aiModelId">Recommended AI Model</Label>
              <select
                id="aiModelId"
                disabled={isSubmitting}
                className={cn(
                  "border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  form.formState.errors.aiModelId && "border-red-500",
                )}
                {...form.register("aiModelId")}
              >
                <option value="">Select an AI model</option>
                {aiModels.map((aiModel) => (
                  <option key={aiModel.id} value={aiModel.id}>
                    {aiModel.displayName}
                  </option>
                ))}
              </select>
              {form.formState.errors.aiModelId && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.aiModelId.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
              className="flex-1"
            >
              {isSubmitting || createMutation.isPending
                ? "Creating..."
                : parentPrompt
                  ? "Create Fork"
                  : "Create Prompt Card"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
