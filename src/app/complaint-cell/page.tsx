import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { site, grm } from "@/lib/site";
import { ConnectHub } from "@/components/connect-hub";
import { Reveal } from "@/components/reveal";
import { Container, Eyebrow, PageHero, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Complaint Cell & GRM | Office of the Chief Minister of Balochistan",
  description:
    "Official Citizen Grievance Redressal Mechanism (GRM) of Balochistan. Register and track public service complaints, inspect departmental resolution workflows, and learn about the multi-tier escalation procedure.",
};

const escalationTiers = [
  {
    tier: "Tier 1",
    authority: "District Officer / Executive Engineer",
    turnaround: "7 to 14 Days",
    role: "Direct field investigation, departmental site visit, and on-ground rectification of civic issues (schools, basic health units, water pipelines, local roads).",
  },
  {
    tier: "Tier 2",
    authority: "Administrative Department Secretary",
    turnaround: "21 Days Maximum",
    role: "Provincial departmental review for non-responsive field officers, inter-district administrative gridlocks, budgetary allocations, and tender disputes.",
  },
  {
    tier: "Tier 3",
    authority: "Chief Minister's Inspection Team (CMIT) & Secretariat Oversight Cell",
    turnaround: "Priority Action",
    role: "Direct oversight by the Chief Minister's secretariat for chronic public grievances, anti-corruption inquiries, high-level administrative negligence, and whistleblower disclosures.",
  },
];

const faqs = [
  {
    q: "What is the difference between AWAAZ (Official Provincial GRM) and the CM Secretariat Intake?",
    a: "AWAAZ (grmbalochistan.com) is the centralized government portal routing grievances directly across 37 district administrations and provincial line departments. The CM Secretariat Intake on this portal allows citizens to directly petition the Chief Minister's Office for high-priority monitoring, policy review, and escalation.",
  },
  {
    q: "How can I track my complaint after submission?",
    a: "When you submit a complaint, you receive a unique tracking code (e.g., CMB-2026-1001 or an AWAAZ ticket number). You can enter this code in the Track tab on this portal or on grmbalochistan.com/track to see real-time updates and departmental findings.",
  },
  {
    q: "What should I do if a public service grievance is urgent?",
    a: "For immediate public emergencies (hospital emergencies, broken electrical cables, active flood damage), citizens should immediately call the 24/7 hotline at 081-9202424 or contact the local District Commissioner's Control Room.",
  },
  {
    q: "What happens if a department marks my grievance resolved but the issue is not fixed?",
    a: "Our system features a guaranteed Right of Appeal. Under the tracking view, you can click 'Request Escalation (Appeal)' to immediately send the file to Tier 2 (Secretary level) or Tier 3 (CM Inspection Team) for independent verification.",
  },
  {
    q: "Can I submit an anonymous grievance?",
    a: "While a valid contact phone number is required to provide status SMS and verify the location of civic issues, your personal information is strictly protected under Balochistan Information Security standards and is never disclosed to accused parties.",
  },
  {
    q: "Which matters cannot be addressed by the Complaint Cell?",
    a: "Matters currently pending before judicial courts (sub-judice), private civil disputes between citizens, and armed forces jurisdiction fall outside the administrative mandate of the provincial grievance cell.",
  },
];

export default function ComplaintCellPage() {
  return (
    <main id="main-content">
      {/* PAGE HERO */}
      <PageHero
        eyebrow="Citizen Voice & Accountability"
        title={
          <>
            Grievance Redressal <em className="text-pine-200">Mechanism.</em>
          </>
        }
        description="A direct, transparent, and enforceable accountability channel between the people of Balochistan and the Chief Minister's Secretariat."
        crumbs={[
          { label: "Connect", href: "/connect" },
          { label: "Complaint Cell (GRM)" },
        ]}
      >
        <div className="rounded-2xl border border-white/12 bg-white/[0.05] p-5 backdrop-blur">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-white/40 uppercase">
            Official 24/7 Redressal Helpline
          </p>
          <a
            href={`tel:${grm.hotline.replace(/[^0-9]/g, "")}`}
            className="font-display mt-2 block text-2xl text-white transition-colors hover:text-gold-200"
          >
            {grm.hotline}
          </a>
          <p className="mt-1 text-[11px] text-white/45">{grm.hours}</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <a
              href={grm.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-gold inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold"
            >
              Register on Official GRM
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <a
              href={grm.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-glass text-white border-white/20 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold"
            >
              Track on Official GRM
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </PageHero>

      {/* DUAL ARCHITECTURE TRANSPARENCY BANNER */}
      <section className="border-b border-pine-900/10 bg-sand/40 py-8">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass-card-3d rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="icon-box-3d flex h-10 w-10 items-center justify-center rounded-xl bg-pine-900 text-gold-300">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Provincial Network
                  </span>
                </div>
                <h3 className="font-display mt-4 text-xl font-bold text-pine-950">
                  AWAAZ — Official Provincial GRM
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-pine-900/70">
                  Centralized portal routing complaints directly to Deputy Commissioners, Executive Engineers, and District Health/Education officers across all 37 districts of Balochistan.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-pine-900/10">
                <a
                  href={grm.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d-emerald inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white"
                >
                  Register on AWAAZ
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={grm.trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d-glass text-pine-950 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold"
                >
                  Track AWAAZ Ticket
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="glass-card-3d rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="icon-box-3d flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400 text-pine-950">
                    <Scale className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-gold-100 text-pine-950 border border-gold-300 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Secretariat Intake
                  </span>
                </div>
                <h3 className="font-display mt-4 text-xl font-bold text-pine-950">
                  Chief Minister Secretariat Direct Intake
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-pine-900/70">
                  Direct public petitions, whistleblower reports, and unresolved departmental grievances submitted straight to the Chief Minister&apos;s Secretariat for independent scrutiny.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-pine-900/10">
                <a
                  href="#portal"
                  className="btn-3d-gold inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-pine-950"
                >
                  Submit Secretariat Petition
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* INTERACTIVE GRM PORTAL (REGISTER & TRACK) */}
      <section id="portal" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Eyebrow>Online Grievance Desk</Eyebrow>
              <h2 className="font-display mt-3 text-3xl sm:text-4xl font-extrabold text-pine-950">
                Register or Track a Public Grievance
              </h2>
              <p className="mt-2 text-sm text-pine-900/65 max-w-xl mx-auto">
                Every grievance filed with the Chief Minister&apos;s Secretariat is recorded in the provincial database, assigned a tracking code, and tracked to closure.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={grm.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d-emerald inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold text-white"
                >
                  <ExternalLink className="h-4 w-4 text-gold-300" />
                  Register Complaint on Official GRM
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-80" />
                </a>
                <a
                  href={grm.trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d-glass text-pine-950 inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold"
                >
                  <ExternalLink className="h-4 w-4 text-pine-700" />
                  Track Complaint Status
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-80" />
                </a>
              </div>
            </div>

            <ConnectHub initialTab="complaint" />
          </div>
        </Container>
      </section>

      {/* MULTI-TIER ESCALATION PROCEDURE */}
      <section id="escalation" className="scroll-mt-24 border-y border-pine-900/8 bg-mist py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Government Accountability"
            title="Multi-Tier Grievance Escalation Procedure"
            description="Our tiered resolution structure ensures that complaints do not languish in bureaucratic red tape. If lower-tier officers do not resolve an issue within the statutory turnaround time, the system automatically enables citizen escalation."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {escalationTiers.map((tier, index) => (
              <Reveal key={tier.tier} delay={index * 80}>
                <div className="glass-card-3d flex h-full flex-col justify-between rounded-3xl p-7">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black uppercase tracking-widest text-pine-700">
                        {tier.tier}
                      </span>
                      <span className="rounded-full bg-pine-100 text-pine-900 border border-pine-200 px-2.5 py-0.5 text-[10px] font-bold">
                        {tier.turnaround}
                      </span>
                    </div>
                    <h3 className="font-display mt-4 text-lg font-bold text-pine-950">
                      {tier.authority}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-pine-900/70">
                      {tier.role}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-pine-900/8 flex items-center gap-2 text-[11px] font-bold text-pine-900">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Statutory Redressal Benchmark</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* PRIVACY & WHISTLEBLOWER PROTECTION CHARTER */}
      <section className="py-16 sm:py-20 bg-pine-950 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="icon-box-3d inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-gold-300 mb-4 border border-white/20">
              <ShieldAlert className="h-7 w-7" />
            </span>
            <Eyebrow tone="light">Citizen Protection Guarantee</Eyebrow>
            <h2 className="font-display mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              Official Privacy & Whistleblower Charter
            </h2>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-white/70">
              Under the directive of Chief Minister Mir Sarfraz Bugti, the Government of Balochistan provides ironclad protection to all citizens registering grievances or reporting corruption. Your identity, telephone contact, and residential address are classified and accessible only to designated inquiry magistrates. Retaliation against any complainant is a criminal offense under provincial law.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="glass-dark-3d rounded-2xl p-4 border border-gold-400/30">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gold-300">Confidential Identity</p>
                <p className="mt-1 text-xs text-white/70">Phone numbers and legal names are masked in public reports.</p>
              </div>
              <div className="glass-dark-3d rounded-2xl p-4 border border-gold-400/30">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gold-300">Anti-Retaliation</p>
                <p className="mt-1 text-xs text-white/70">Strict administrative penalties against hostile departmental actions.</p>
              </div>
              <div className="glass-dark-3d rounded-2xl p-4 border border-gold-400/30">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gold-300">Right of Appeal</p>
                <p className="mt-1 text-xs text-white/70">Immediate escalation to the Chief Minister&apos;s Inspection Team.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <SectionHeading
            eyebrow="Help & Guidance"
            title="Frequently Asked Questions"
            description="Clear answers regarding complaint eligibility, registration requirements, departmental procedures, and escalation avenues."
          />

          <div className="mt-10 max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.q}
                className="glass-card-3d rounded-2xl p-5 sm:p-6 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="icon-box-3d flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pine-900 text-[11px] font-bold text-gold-300 mt-0.5">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-pine-950 text-sm sm:text-base">
                      {faq.q}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-pine-900/70">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CONTACT & HELPLINE DIRECTORY */}
      <section className="border-t border-pine-900/10 bg-sand/30 py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glass-card-3d rounded-2xl p-6">
              <span className="icon-box-3d flex h-10 w-10 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                <Phone className="h-5 w-5" />
              </span>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-pine-900/50">24/7 GRM Hotline</p>
              <p className="mt-1 font-mono text-base font-bold text-pine-950">{grm.hotline}</p>
              <p className="mt-1 text-[11px] text-pine-900/50">Toll-free across Balochistan</p>
            </div>

            <div className="glass-card-3d rounded-2xl p-6">
              <span className="icon-box-3d flex h-10 w-10 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                <Phone className="h-5 w-5" />
              </span>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-pine-900/50">Secretariat Exchange</p>
              <p className="mt-1 font-mono text-base font-bold text-pine-950">{site.phone}</p>
              <p className="mt-1 text-[11px] text-pine-900/50">{site.officeHours}</p>
            </div>

            <div className="glass-card-3d rounded-2xl p-6">
              <span className="icon-box-3d flex h-10 w-10 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                <Mail className="h-5 w-5" />
              </span>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-pine-900/50">Official Email</p>
              <p className="mt-1 text-sm font-bold text-pine-950 truncate">{site.email}</p>
              <p className="mt-1 text-[11px] text-pine-900/50">Electronic correspondence</p>
            </div>

            <div className="glass-card-3d rounded-2xl p-6">
              <span className="icon-box-3d flex h-10 w-10 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                <MapPin className="h-5 w-5" />
              </span>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-pine-900/50">Physical Location</p>
              <p className="mt-1 text-xs font-bold text-pine-950 leading-snug">Chief Minister House, Zarghoon Road, Quetta</p>
              <p className="mt-1 text-[11px] text-pine-900/50">Public Grievance Reception</p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
