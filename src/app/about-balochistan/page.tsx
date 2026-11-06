import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Compass, Landmark, Mail, MapPin, Phone, Users } from "lucide-react";
import { aboutBalochistan } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container, PageHero, SectionHeading, TextLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Balochistan",
  description:
    "Quick stats, history, geography, economy, people and tourism — an introduction to Pakistan's largest province.",
};

const stats = [
  { value: "347,190", unit: "km²", label: "Land area" },
  { value: "36", unit: "", label: "Districts" },
  { value: "15.4", unit: "M", label: "People (est.)" },
  { value: "1,000", unit: "+ km", label: "Coastline" },
];

export default function AboutBalochistanPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="About Balochistan"
        title={
          <>
            A land of ancient civilisations and <span className="heading-accent-gold">unbounded potential</span>.
          </>
        }
        description={aboutBalochistan.intro}
        crumbs={[{ label: "About Balochistan" }]}
      >
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl glass-dark-3d p-4">
              <p className="font-display text-xl leading-none text-white font-extrabold">
                {stat.value}
                <span className="text-gold-300">{stat.unit}</span>
              </p>
              <p className="mt-1.5 text-[9px] tracking-[0.14em] text-white/50 uppercase font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="py-10 sm:py-16 md:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-14">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[10px] font-bold tracking-[0.2em] text-pine-900/50 uppercase">On this page</p>
              <nav aria-label="About Balochistan sections" className="mt-4 border-l border-pine-900/12">
                {aboutBalochistan.sections.map((section, index) => (
                  <Link
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-center gap-3 border-l-2 border-transparent py-2.5 pl-4 text-[12px] font-bold text-pine-900/60 transition-all hover:border-pine-700 hover:text-pine-950 hover:translate-x-1"
                  >
                    <span className="text-[9px] tracking-widest text-pine-900/35">0{index + 1}</span>
                    {section.title}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 hidden rounded-3xl glass-panel-3d p-5 lg:block border border-white/80">
                <div className="h-9 w-9 rounded-xl icon-box-3d flex items-center justify-center text-pine-700 mb-3">
                  <Compass className="h-5 w-5" aria-hidden="true" strokeWidth={1.6} />
                </div>
                <p className="text-[12px] leading-relaxed text-pine-900/70 font-medium">
                  Balochistan borders Iran, Afghanistan and the Arabian Sea — a crossroads of trade, culture and ecology.
                </p>
                <TextLink href="/priorities/environment" className="mt-4 text-[11px]">
                  Our environment agenda
                </TextLink>
              </div>
            </aside>

            <div>
              <Reveal>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl glass-card-3d p-4 shadow-3d-card transition-all duration-300 hover:-translate-y-1">
                      <p className="font-display text-2xl leading-none text-pine-950 font-extrabold">
                        {stat.value}
                        <span className="text-pine-600 font-bold">{stat.unit}</span>
                      </p>
                      <p className="mt-2 text-[10px] tracking-[0.12em] text-pine-900/50 uppercase font-bold">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>

              <div className="mt-10 space-y-6">
                {aboutBalochistan.sections.map((section, index) => (
                  <Reveal key={section.id} delay={40}>
                    <section id={section.id} className="scroll-mt-28 rounded-3xl glass-card-3d p-6 sm:p-8 shadow-3d-card border border-white/95">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.2em] text-pine-600 uppercase">
                            {String(index + 1).padStart(2, "0")} · Balochistan
                          </p>
                          <h2 className="font-display mt-2 text-2xl text-pine-950 sm:text-3xl font-extrabold">{section.title}</h2>
                        </div>
                        <span className="font-display hidden text-5xl text-pine-900/[0.07] sm:block font-black" aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-pine-900/70">{section.body}</p>

                      <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-pine-900/8 pt-5 sm:grid-cols-2">
                        {section.facts.map((fact) => (
                          <div key={fact.label} className="flex items-start justify-between gap-4">
                            <dt className="text-[10px] font-bold tracking-[0.12em] text-pine-900/50 uppercase">{fact.label}</dt>
                            <dd className="max-w-[58%] text-right text-[12px] font-bold leading-snug text-pine-950">{fact.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </section>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-pine-900/8 bg-mist/60 py-16">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Explore further"
              title={
                <>
                  From the province&apos;s story to its <span className="heading-accent">next chapter</span>.
                </>
              }
              description="Learn how the office is working across the province — or get in touch with a question."
              action={{ href: "/priorities", label: "Our priorities" }}
              className="mb-10"
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Landmark, title: "Leadership & Cabinet", body: "Leaders and ministers", href: "/chief-ministers" },
              { icon: Users, title: "Know Your CM", body: "Profile and vision", href: "/chief-minister" },
              { icon: Compass, title: "Tourism", body: "Places worth the journey", href: "#tourism" },
              { icon: Mail, title: "Contact the office", body: "Questions and complaints", href: "/connect" },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex items-start justify-between gap-4 rounded-3xl glass-card-3d p-5 transition-all duration-300 hover:-translate-y-1 shadow-3d-card border border-white/95"
              >
                <span>
                  <div className="h-9 w-9 rounded-xl icon-box-3d flex items-center justify-center text-pine-700">
                    <item.icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.6} />
                  </div>
                  <span className="mt-4 block text-[13px] font-bold text-pine-950">{item.title}</span>
                  <span className="mt-0.5 block text-[11px] text-pine-900/55">{item.body}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-pine-900/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pine-700" aria-hidden="true" />
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href="/connect" variant="primary">Contact the office</ButtonLink>
            <ButtonLink href="/news" variant="outline">Latest news</ButtonLink>
            <span className="flex items-center gap-2 text-[11px] text-pine-900/40">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Quetta, Balochistan
            </span>
            <a href="tel:+92819201234" className="ml-auto hidden items-center gap-2 text-[11px] text-pine-900/45 sm:flex">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              +92 81 920 1234
            </a>
          </div>
        </Container>
      </section>
    </main>
  );
}
