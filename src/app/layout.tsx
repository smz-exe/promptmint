import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { AuthProvider } from "~/lib/auth/context";
import { Toaster } from "~/components/ui/sonner";
import { Navigation } from "~/components/layout/Navigation";
import { ErrorBoundary } from "~/components/error/ErrorBoundary";

export const metadata: Metadata = {
  title: "PromptMint - Mint Your Genius",
  description:
    "Create, collect, and trade AI prompt cards on PromptMint. Join thousands minting their best prompts into beautiful digital collectibles.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <AuthProvider>
            <Navigation />
            <ErrorBoundary level="page">{children}</ErrorBoundary>
            <Toaster />
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
