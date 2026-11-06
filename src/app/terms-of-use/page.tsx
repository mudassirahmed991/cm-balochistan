import type { Metadata } from "next";
import { Container, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Use | Government of Balochistan",
  description: "Official terms and conditions for using the portal of the Chief Minister of Balochistan.",
};

export default function TermsOfUsePage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Legal & Governance"
        title="Terms of Use"
        description="Conditions of use, copyright notices, and citizen responsibilities when interacting with the official portal."
        crumbs={[{ label: "Terms of Use" }]}
      />

      <section className="py-16 sm:py-24">
        <Container className="max-w-4xl space-y-8 text-pine-900/80 leading-relaxed">
          <div className="rounded-3xl glass-card-3d p-8 sm:p-10 shadow-3d-card border border-white/95">
            <h2 className="font-display text-2xl font-bold text-pine-950">1. Acceptance of Terms</h2>
            <p className="mt-3 text-sm">
              By accessing and using this official portal, you accept and agree to be bound by the terms and provisions of this agreement. This portal is maintained for public information and citizen engagement by the Government of Balochistan.
            </p>

            <h2 className="font-display mt-8 text-2xl font-bold text-pine-950">2. Accuracy of Submitted Complaints</h2>
            <p className="mt-3 text-sm">
              Citizens using the Grievance Redressal Mechanism are expected to provide truthful, accurate, and non-frivolous information. Submitting fraudulent reports or abusive material is prohibited under applicable provincial laws.
            </p>

            <h2 className="font-display mt-8 text-2xl font-bold text-pine-950">3. Intellectual Property & Copyright</h2>
            <p className="mt-3 text-sm">
              The official emblem, insignia, photographs, press releases, and publications displayed on this website are the property of the Government of Balochistan and are protected by applicable copyright legislation.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
