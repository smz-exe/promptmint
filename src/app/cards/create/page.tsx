"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "~/lib/hooks/useAuth";
import { PromptCardForm } from "~/components/forms/PromptCardForm";
import { SmartBreadcrumb } from "~/components/navigation/SmartBreadcrumb";

export default function CreateCardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <SmartBreadcrumb />

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Prompt Card
            </h1>
            <p className="text-muted-foreground mt-2">
              Share your AI prompt with the community and help others discover
              great prompts
            </p>
          </div>

          <PromptCardForm />
        </div>
      </div>
    </div>
  );
}
