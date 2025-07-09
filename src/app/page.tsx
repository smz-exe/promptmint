import { HydrateClient } from "~/trpc/server";
import { HeroSection } from "~/components/homepage/HeroSection";
import { InteractiveDemo } from "~/components/homepage/InteractiveDemo";
import { FeatureGrid } from "~/components/homepage/FeatureGrid";
import { SocialProof } from "~/components/homepage/SocialProof";
import { CtaSection } from "~/components/homepage/CtaSection";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="min-h-screen">
        <HeroSection />
        <InteractiveDemo />
        <FeatureGrid />
        <SocialProof />
        <CtaSection />
      </main>
    </HydrateClient>
  );
}
