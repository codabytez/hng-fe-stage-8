import { LandingNav } from "@/components/landing/LandingNav";
import { LandingDocs } from "@/components/landing/LandingDocs";
import { LandingFooter } from "@/components/landing/LandingFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation | NexusDB Explorer",
  description: "Learn how to use NexusDB Explorer — field types, operators, keyboard shortcuts, query formats, and data import.",
};

export default function DocsPage() {
  return (
    <>
      <LandingNav />
      <main className="pt-24">
        <LandingDocs />
      </main>
      <LandingFooter />
    </>
  );
}
