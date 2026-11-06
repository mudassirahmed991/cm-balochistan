import type { Metadata } from "next";
import { Container, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Accessibility Statement | Government of Balochistan",
  description: "Official accessibility statement for the Office of the Chief Minister of Balochistan website.",
};

export default function AccessibilityPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Citizen Services"
        title="Accessibility Statement"
        description="Our commitment to ensuring the official portal is accessible to all citizens, including individuals with disabilities."
        crumbs={[{ label: "Accessibility" }]}
      />

      <section className="py-16 sm:py-24">
        <Container className="max-w-4xl space-y-8 text-pine-900/80 leading-relaxed">
          <div className="rounded-3xl glass-card-3d p-8 sm:p-10 shadow-3d-card border border-white/95">
            <h2 className="font-display text-2xl font-bold text-pine-950">1. Standards and Conformance</h2>
            <p className="mt-3 text-sm">
              The Office of the Chief Minister is committed to making this portal accessible according to the Web Content Accessibility Guidelines (WCAG 2.1) Level AA standards.
            </p>

            <h2 className="font-display mt-8 text-2xl font-bold text-pine-950">2. Accessibility Features</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
              <li><strong>Text Sizing:</strong> Fast text scaling controls (A / A+) available in the header bar.</li>
              <li><strong>High Contrast & Color Palette:</strong> Strict compliance with minimum 4.5:1 text-to-background contrast ratios.</li>
              <li><strong>Keyboard Navigation:</strong> Full focus ring visibility, logical tab order, and skip-to-content links.</li>
              <li><strong>Screen Reader Support:</strong> Semantic HTML5 landmarks, ARIA labels on interactive elements, and descriptive alt text for official photographs.</li>
              <li><strong>Reduced Motion:</strong> Full support for OS reduced-motion preferences, disabling non-essential transitions.</li>
            </ul>

            <h2 className="font-display mt-8 text-2xl font-bold text-pine-950">3. Feedback & Contact</h2>
            <p className="mt-3 text-sm">
              If you experience any difficulty accessing content on this portal, please submit your feedback through our Contact page or call the helpline at +92 81 920 1234.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
