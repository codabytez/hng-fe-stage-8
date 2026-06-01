import { LandingNav } from "@/components/landing/LandingNav";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingPreview } from "@/components/landing/LandingPreview";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingSchemas } from "@/components/landing/LandingSchemas";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <>
      <LandingNav />
      <main>
        <LandingHero />
        <LandingPreview />
        <LandingFeatures />
        <LandingSchemas />
        <LandingCTA />
      </main>
      <LandingFooter />
    </>
  );
}
