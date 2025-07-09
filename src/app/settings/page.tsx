"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useAuth } from "~/lib/hooks/useAuth";
import { ProfileSettings } from "~/components/settings/ProfileSettings";
import { AccountSettings } from "~/components/settings/AccountSettings";
import { api } from "~/trpc/react";

type SettingsTab = "profile" | "account";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const { data: currentUser, isLoading } = api.auth.getCurrentUser.useQuery(
    undefined,
    {
      enabled: !!user,
    },
  );

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div className="mb-6 h-8 rounded bg-gray-300"></div>
            <div className="h-96 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground mb-6">
            Unable to load user settings. Please try again.
          </p>
          <Button onClick={() => router.push("/feed")}>Go to Feed</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-2xl font-bold">Settings</h1>

        {/* Settings Tabs */}
        <div className="mb-8">
          <nav className="bg-muted flex space-x-1 rounded-lg p-1">
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              onClick={() => setActiveTab("profile")}
              className="flex-1"
            >
              Profile
            </Button>
            <Button
              variant={activeTab === "account" ? "default" : "ghost"}
              onClick={() => setActiveTab("account")}
              className="flex-1"
            >
              Account
            </Button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileSettings user={currentUser} />
              </CardContent>
            </Card>
          )}

          {activeTab === "account" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <AccountSettings user={currentUser} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
