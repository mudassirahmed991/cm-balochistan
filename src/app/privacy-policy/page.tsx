import type { Metadata } from "next";
import { Container, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy | Government of Balochistan",
  description: "Official Privacy Policy of the Office of the Chief Minister of Balochistan.",
};

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Legal & Governance"
        title="Privacy Policy"
        description="Official commitment to protecting citizen privacy, personal data, and public grievance information."
        crumbs={[{ label: "Privacy Policy" }]}
      />

      <section className="py-16 sm:py-24">
        <Container className="max-w-4xl space-y-8 text-pine-900/80 leading-relaxed">
          <div className="rounded-3xl glass-card-3d p-8 sm:p-10 shadow-3d-card border border-white/95">
            <h2 className="font-display text-2xl font-bold text-pine-950">1. Information Collection</h2>
            <p className="mt-3 text-sm">
              The Office of the Chief Minister of Balochistan collects personal information solely when citizens submit inquiries or register complaints through the official portal. This information includes your name, contact phone number, email address, district of residence, and complaint description.
            </p>

            <h2 className="font-display mt-8 text-2xl font-bold text-pine-950">2. Purpose of Processing</h2>
            <p className="mt-3 text-sm">
              Citizen information is used exclusively to examine, verify, and route grievances to the responsible provincial departments for redressal. We do not sell, rent, or share personal data with unauthorized third parties.
            </p>

            <h2 className="font-display mt-8 text-2xl font-bold text-pine-950">3. Grievance Redressal Data Protection</h2>
            <p className="mt-3 text-sm">
              All complaint submissions are stored securely. Access to grievance records is restricted to authorized departmental officers and complaint handling staff under strict administrative audit logging.
            </p>

            <h2 className="font-display mt-8 text-2xl font-bold text-pine-950">4. Contact Information</h2>
            <p className="mt-3 text-sm">
              If you have any questions regarding this Privacy Policy or your submitted data, please contact the Chief Minister’s Secretariat, Zarghoon Road, Quetta, Balochistan.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
