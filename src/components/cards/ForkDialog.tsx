"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

const forkSchema = z.object({
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
});

type ForkFormData = z.infer<typeof forkSchema>;

interface ForkDialogProps {
  parentCard: {
    id: string;
    title: string;
    description: string;
    promptText: string;
    category: {
      id: string;
      name: string;
    };
    aiModel: {
      id: string;
      name: string;
    };
    author: {
      username: string;
      displayName: string;
    };
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function ForkDialog({
  parentCard,
  onSuccess,
  onCancel,
}: ForkDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForkFormData>({
    resolver: zodResolver(forkSchema),
    defaultValues: {
      title: `Fork of ${parentCard.title}`,
      description: parentCard.description,
      promptText: parentCard.promptText,
      categoryId: parentCard.category.id,
      aiModelId: parentCard.aiModel.id,
    },
  });

  const { data: categories } = api.metadata.getCategories.useQuery();
  const { data: aiModels } = api.metadata.getAIModels.useQuery();

  const createMutation = api.promptCard.create.useMutation({
    onSuccess: (data) => {
      toast.success("Card forked successfully!");
      onSuccess();
      router.push(`/cards/${data.card.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: ForkFormData) => {
    setIsSubmitting(true);
    createMutation.mutate({
      ...data,
      parentPromptId: parentCard.id,
    });
  };

  return (
    <div className="space-y-6">
      {/* Fork Information */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="mb-2 font-semibold">Forking from:</h3>
        <div className="text-muted-foreground text-sm">
          <p className="font-medium">{parentCard.title}</p>
          <p>by {parentCard.author.displayName}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter card title"
                    maxLength={200}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    placeholder="Describe your card"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="promptText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt Text</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    placeholder="Enter your prompt here"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full resize-none rounded-md border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    rows={6}
                    maxLength={5000}
                  />
                </FormControl>
                <div className="flex items-center justify-between">
                  <FormMessage />
                  <span className="text-muted-foreground text-xs">
                    {form.watch("promptText")?.length ?? 0}/5000
                  </span>
                </div>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a category</option>
                      {categories?.categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aiModelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Model</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select an AI model</option>
                      {aiModels?.aiModels?.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.displayName}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Fork..." : "Create Fork"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
