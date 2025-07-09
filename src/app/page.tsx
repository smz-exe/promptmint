import Link from "next/link";

import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            AI <span className="text-[hsl(280,100%,70%)]">Prompt</span> Trading
            Cards
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="/feed"
            >
              <h3 className="text-2xl font-bold">Browse Cards →</h3>
              <div className="text-lg">
                Discover amazing AI prompts shared by the community in beautiful trading card format.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="/sign-up"
            >
              <h3 className="text-2xl font-bold">Get Started →</h3>
              <div className="text-lg">
                Create your account and start sharing AI prompts as beautiful
                trading cards.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="/sign-in"
            >
              <h3 className="text-2xl font-bold">Sign In →</h3>
              <div className="text-lg">
                Already have an account? Sign in to continue building your
                collection.
              </div>
            </Link>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
