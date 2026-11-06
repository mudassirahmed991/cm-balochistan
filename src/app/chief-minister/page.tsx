import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, Landmark, Quote, Shield, Target, UserRound } from "lucide-react";
import { cm, visionMission } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container, Eyebrow, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "About the Chief Minister | Mir Sarfraz Bugti",
  description: `${cm.name}, Chief Minister of Balochistan. Read the official profile, biography, leadership record, vision, and full message.`,
};

export default function ChiefMinisterPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Chief Minister's Office"
        title={cm.name}
        description={`${cm.title} · In office since ${cm.since}`}
        crumbs={[{ label: "About Chief Minister" }]}
      >
        <div className="grid w-full max-w-xs gap-3 sm:grid-cols-2 lg:w-80">
          {[
            { icon: CalendarDays, label: "In office since", value: "2 March 2024" },
            { icon: Landmark, label: "Party", value: "Pakistan Peoples Party" },
            { icon: UserRound, label: "Assembly", value: "Provincial Assembly" },
            { icon: Landmark, label: "Residence", value: "CM House, Quetta" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-white/12 bg-white/[0.05] p-3.5 backdrop-blur">
              <item.icon className="h-4 w-4 text-gold-300" aria-hidden="true" />
              <p className="mt-2 text-[9px] font-semibold tracking-[0.16em] text-white/40 uppercase">{item.label}</p>
              <p className="mt-0.5 text-[12px] font-semibold leading-snug text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Main Profile & Message Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white border-b border-pine-900/10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            {/* Left Column: Portrait & Facts */}
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <div className="image-3d-frame relative aspect-[4/5] w-full overflow-hidden rounded-t-[999px] rounded-b-3xl shadow-lift bg-pine-950">
                  <Image
                    src="/images/chief-minister-portrait.jpg"
                    alt="Mir Sarfraz Bugti, Chief Minister of Balochistan"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover object-top"
                    priority
                  />
                </div>
                <div className="glass-card-3d mt-5 rounded-2xl p-5">
                  <p className="text-[10px] font-bold tracking-widest text-pine-900/50 uppercase">Constitutional Office</p>
                  <dl className="mt-3 space-y-3">
                    {cm.facts.map((fact) => (
                      <div key={fact.label} className="flex items-start justify-between gap-4 border-b border-pine-900/8 pb-2.5 last:border-0 last:pb-0">
                        <dt className="text-[11px] font-semibold text-pine-900/60">{fact.label}</dt>
                        <dd className="text-right text-[12px] font-bold text-pine-950">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Reveal>

            {/* Right Column: 5 Subsections from Requirements */}
            <div className="space-y-12">
              {/* Subsection 1: Official Message from the Chief Minister */}
              <Reveal>
                <div className="glass-card-3d rounded-3xl p-8">
                  <Eyebrow>Official Address</Eyebrow>
                  <h2 className="font-display mt-3 text-2xl sm:text-3xl font-bold text-pine-950">
                    Message from the <span className="heading-accent">Chief Minister</span>
                  </h2>
                  <div className="mt-5 text-base leading-relaxed text-pine-950 font-medium space-y-4">
                    <p>{cm.welcomeMessage}</p>
                    <p className="text-sm text-pine-900/75 font-normal">
                      &ldquo;Our vision for Balochistan is rooted in the dignity and welfare of its citizens. By modernizing our institutions,
                      expanding schooling and digital opportunities for youth, and opening transparent grievance channels, we are establishing
                      a government that remains accountable to the public at all times.&rdquo;
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Subsection 2: Biography */}
              <Reveal delay={80}>
                <div>
                  <Eyebrow>Biography</Eyebrow>
                  <h3 className="font-display mt-3 text-2xl sm:text-3xl font-bold text-pine-950">
                    Leadership Committed to Service and Reform
                  </h3>
                  <div className="mt-5 space-y-4 text-sm sm:text-base leading-relaxed text-pine-900/75">
                    {cm.bio.map((paragraph) => (
                      <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Subsection 3: Quote Card */}
              <Reveal delay={120}>
                <figure className="glass-dark-3d relative overflow-hidden rounded-2xl p-7 text-white sm:p-8 shadow-lift border border-gold-400/30">
                  <Quote className="h-8 w-8 text-gold-400" aria-hidden="true" />
                  <blockquote className="font-display mt-4 text-xl leading-[1.45] text-balance sm:text-2xl text-white">
                    {cm.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                    <span className="font-semibold text-white">{cm.name}</span>
                    <span className="text-white/50">Chief Minister of Balochistan</span>
                  </figcaption>
                </figure>
              </Reveal>

              {/* Subsection 4: Leadership and Public Service */}
              <Reveal delay={160}>
                <div>
                  <Eyebrow>Public Service Record</Eyebrow>
                  <h3 className="font-display mt-3 text-2xl font-bold text-pine-950">
                    Devoted to Provincial Peace, Stability, and Progress
                  </h3>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-pine-900/75">
                    Throughout his tenure in public service, Mir Sarfraz Bugti has championed the development of remote border districts,
                    fostered youth engagement through technology and vocational training, and worked constructively with provincial institutions
                    to restore civil security and administrative transparency across Balochistan.
                  </p>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="glass-card-3d rounded-2xl p-5">
                      <div className="icon-box-3d h-10 w-10 flex items-center justify-center rounded-xl bg-white text-pine-700">
                        <Shield className="h-5 w-5" />
                      </div>
                      <h4 className="mt-3 text-sm font-bold text-pine-950">Peace & Rule of Law</h4>
                      <p className="mt-1 text-xs text-pine-900/65 leading-relaxed">
                        Modernized border management, local policing upgrades, and safeguarding citizen rights.
                      </p>
                    </div>
                    <div className="glass-card-3d rounded-2xl p-5">
                      <div className="icon-box-3d h-10 w-10 flex items-center justify-center rounded-xl bg-white text-pine-700">
                        <Target className="h-5 w-5" />
                      </div>
                      <h4 className="mt-3 text-sm font-bold text-pine-950">Institutional Reforms</h4>
                      <p className="mt-1 text-xs text-pine-900/65 leading-relaxed">
                        Digitization of land records, merit-based hiring, and public grievance cell accountability.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Subsection 5: Vision and Policy Direction */}
              <Reveal delay={200}>
                <div className="glass-panel-3d rounded-3xl p-8">
                  <Eyebrow>Policy Direction</Eyebrow>
                  <h3 className="font-display mt-2 text-2xl font-bold text-pine-950">
                    Vision for a Self-Sustaining Balochistan
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-pine-900/75">
                    {visionMission.vision}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <ButtonLink href="/priorities" variant="primary">
                      Explore Immediate Priorities
                    </ButtonLink>
                    <ButtonLink href="/cabinet" variant="outline">
                      Meet the Cabinet
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
