import type { Metadata } from "next";
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { site } from "@/lib/site";
import { ConnectHub } from "@/components/connect-hub";
import { SocialIcon } from "@/components/social-icons";
import { Reveal } from "@/components/reveal";
import { ContourPattern } from "@/components/patterns";
import { Container, Eyebrow, PageHero, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Connect with Us",
  description:
    "Contact the Office of the Chief Minister of Balochistan, register a complaint, or follow the office on social media.",
};

const contactCards = [
  {
    icon: MapPin,
    label: "Visit the office",
    value: "Chief Minister House, Zarghoon Road, Quetta",
    action: { label: "Open in maps", href: "https://www.google.com/maps/search/?api=1&query=Chief+Minister+House+Quetta" },
  },
  {
    icon: Phone,
    label: "Call us",
    value: site.phone,
    action: { label: "Call now", href: `tel:${site.phone.replace(/\s/g, "")}` },
  },
  {
    icon: Mail,
    label: "Email the office",
    value: site.email,
    action: { label: "Send an email", href: `mailto:${site.email}` },
  },
  {
    icon: Clock,
    label: "Office hours",
    value: site.officeHours,
    action: { label: "Public dealing hours", href: "#complaint" },
  },
];

const steps = [
  { title: "Acknowledged", body: "You receive a reference number as soon as your complaint is logged." },
  { title: "Routed", body: "The Complaint Cell assigns it to the responsible department and district office." },
  { title: "Tracked to closure", body: "Progress is followed up and you are informed of the outcome." },
];

export default function ConnectPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Connect with us"
        title={
          <>
            A government that <em className="text-pine-200">listens.</em>
          </>
        }
        description="Ask a question, share a suggestion or register a complaint about a public service. The Chief Minister's Office is here to help — wherever you are in Balochistan."
        crumbs={[{ label: "Connect" }]}
      >
        <div className="rounded-2xl border border-white/12 bg-white/[0.05] p-5 backdrop-blur">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-white/40 uppercase">Official GRM Helpline</p>
          <a href={`tel:${site.grm.phone.replace(/[^0-9]/g, "")}`} className="font-display mt-2 block text-2xl text-white transition-colors hover:text-gold-200">
            {site.grm.phone}
          </a>
          <p className="mt-1 text-[11px] text-white/45">{site.grm.hours}</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <a
              href={site.grm.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-gold inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold"
            >
              Register on Official GRM
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <a
              href={site.grm.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-glass text-white border-white/20 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold"
            >
              Track Complaint
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card, index) => (
              <Reveal key={card.label} delay={index * 50}>
                <div className="glass-card-3d flex h-full flex-col rounded-3xl p-6">
                  <span className="icon-box-3d flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-50 text-pine-700">
                    <card.icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.8} />
                  </span>
                  <p className="mt-5 text-[10px] font-bold tracking-[0.16em] text-pine-900/50 uppercase">{card.label}</p>
                  <p className="mt-1.5 text-[13px] font-bold leading-relaxed text-pine-950">{card.value}</p>
                  <a
                    href={card.action.href}
                    target={card.action.href.startsWith("http") ? "_blank" : undefined}
                    rel={card.action.href.startsWith("http") ? "noreferrer" : undefined}
                    className="mt-auto inline-flex items-center gap-2 pt-5 text-[11px] font-bold text-pine-700 transition-colors hover:text-pine-950"
                  >
                    {card.action.label}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="complaint" className="scroll-mt-24 border-y border-pine-900/8 bg-mist py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <Eyebrow>Complaint cell</Eyebrow>
              <h2 className="font-display mt-4 text-3xl leading-[1.08] text-balance text-pine-950 sm:text-4xl">
                Tell us what needs to <span className="text-pine-600">change.</span>
              </h2>
              <p className="mt-5 text-[0.98rem] leading-relaxed text-pine-900/65">
                If a public service is not working — a school, a clinic, a water scheme, a road — the Complaint Cell exists to make sure your
                concern reaches the right desk and gets an answer.
              </p>

              <ol className="mt-8 space-y-4">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine-900 text-[11px] font-semibold text-gold-300">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-pine-950">{step.title}</p>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-pine-900/55">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="glass-card-3d mt-8 rounded-3xl p-6 sm:p-7 space-y-4">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.16em] text-pine-900/50 uppercase">Prefer to speak to someone?</p>
                  <a
                    href={`tel:${site.grm.phone.replace(/[^0-9]/g, "")}`}
                    className="font-display mt-1.5 flex items-center gap-2 text-xl font-bold text-pine-950 transition-colors hover:text-pine-700"
                  >
                    <Phone className="h-4 w-4 text-pine-700" aria-hidden="true" />
                    {site.grm.phone}
                  </a>
                  <p className="mt-1 text-[11px] text-pine-900/60 font-medium">{site.grm.hours} (Official Grievance Cell)</p>
                </div>
                <div className="pt-3 border-t border-pine-900/10 flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={site.grm.registerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-3d-emerald inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white"
                  >
                    Register on Official GRM
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={site.grm.trackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-3d-glass inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-pine-950"
                  >
                    Track Complaint Status
                    <ArrowUpRight className="h-3.5 w-3.5 text-pine-700" />
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div id="track" className="scroll-mt-32">
                <div id="guidelines" className="scroll-mt-32">
                  <ConnectHub />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <div className="glass-dark-3d relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl p-7 sm:p-8 text-white border border-gold-400/30">
                <ContourPattern className="text-white/10" />
                <div className="relative z-10">
                  <Eyebrow tone="light">Find us</Eyebrow>
                  <h2 className="font-display mt-4 text-2xl font-bold leading-snug sm:text-3xl">Chief Minister House, Quetta</h2>
                  <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-white/70">{site.address}</p>
                </div>

                <div className="relative z-10 mt-10">
                  <div
                    className="relative h-32 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-sm shadow-inner"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  >
                    <div className="absolute left-[38%] top-[46%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                      <MapPin className="h-7 w-7 text-gold-300 drop-shadow" aria-hidden="true" />
                      <span className="mt-1 rounded-full bg-pine-950/90 border border-gold-400/40 px-2.5 py-1 text-[9px] font-bold tracking-[0.12em] text-white uppercase shadow-soft">
                        CM House
                      </span>
                    </div>
                    <svg viewBox="0 0 400 140" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
                      <path d="M0 100 C90 70, 140 120, 220 80 S 340 40, 420 70" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                      <path d="M120 0 C130 50, 90 100, 150 150" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                      <path d="M280 0 C270 40, 310 90, 290 150" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                    </svg>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Chief+Minister+House+Quetta"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-3d-gold mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold"
                  >
                    Open directions
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div id="social" className="glass-panel-3d scroll-mt-24 flex h-full flex-col rounded-3xl p-7 sm:p-8">
                <Eyebrow>Social media</Eyebrow>
                <h2 className="font-display mt-4 text-2xl font-bold text-pine-950 sm:text-3xl">Follow the office</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-pine-900/70">
                  Announcements, visits and stories from across the province — as they happen.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {site.social.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="glass-card-3d group flex items-center gap-3 rounded-2xl p-3.5 transition-all"
                    >
                      <span className="icon-box-3d flex h-10 w-10 items-center justify-center rounded-xl bg-pine-50 text-pine-700 transition-colors group-hover:bg-pine-900 group-hover:text-gold-300">
                        <SocialIcon name={item.icon} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[12px] font-bold text-pine-950">{item.label}</span>
                        <span className="block truncate text-[10px] text-pine-900/50">{item.handle || "@CMOBalochistan"}</span>
                      </span>
                      <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-pine-900/35 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pine-700" aria-hidden="true" />
                    </a>
                  ))}
                </div>

                <div className="mt-auto border-t border-pine-900/10 pt-5">
                  <p className="text-[11px] leading-relaxed text-pine-900/50">
                    For official correspondence, please use the email address or helpline above. Social media messages are monitored during
                    office hours.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-pine-900/8 bg-mist py-12">
        <Container>
          <SectionHeading
            eyebrow="Before you go"
            title={<span className="text-2xl sm:text-3xl">Looking for something specific?</span>}
            action={{ href: "/priorities", label: "Browse our priorities" }}
          />
        </Container>
      </section>
    </main>
  );
}
