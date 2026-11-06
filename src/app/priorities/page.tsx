import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, BarChart3, Eye, MessagesSquare } from "lucide-react";
import { coreInitiatives, firstDayPriorities } from "@/lib/site";
import { db } from "@/lib/db";
import { Reveal } from "@/components/reveal";
import { Container, PageHero, SectionHeading } from "@/components/ui";
import { PrioritiesSlider } from "@/components/priorities-slider";

export const metadata: Metadata = {
  title: "Priorities & Initiatives | Government of Balochistan",
  description:
    "First-day directives and core government development initiatives for the people of Balochistan.",
};

export default function PrioritiesPage() {
  let displayPriorities = firstDayPriorities;
  let displayInitiatives = coreInitiatives;

  try {
    const dbP = db.priorities.findMany({ isFirstDay: true });
    displayPriorities = dbP.map((p) => {
      const staticMatch = firstDayPriorities.find((f) => f.id === p.slug);
      return {
        id: p.slug,
        title: p.titleEn,
        fullTitle: staticMatch?.fullTitle || p.titleEn,
        description: p.descriptionEn,
        directiveMessage: staticMatch?.directiveMessage || "",
        officialRef: staticMatch?.officialRef || "D.O. PS-CM/1-3/189",
        assignedDept: staticMatch?.assignedDept || "All Departments",
        reformTasks: staticMatch?.reformTasks || [],
        icon: p.icon,
        iconImage: p.iconImage || staticMatch?.iconImage || `/images/priorities/${p.slug}.png`,
        bgImage: p.bgImage || staticMatch?.bgImage || `/images/priorities/${p.slug}-bg.jpg`,
        status: "Active Implementation",
      };
    });

    const dbI = db.initiatives.findMany();
    displayInitiatives = dbI.map((i, index) => {
      let bgImage: string | undefined = i.bgImage || undefined;
        if (!bgImage) {
          if (i.id.includes("green-bus") || i.titleEn.toLowerCase().includes("green bus") || index === 0) {
            bgImage = "/images/initiatives/green-bus.png";
          } else if (i.id.includes("pink-bus") || i.titleEn.toLowerCase().includes("pink bus") || index === 1) {
            bgImage = "/images/initiatives/pink-bus.jpg";
          } else if (i.id.includes("healthcare") || i.titleEn.toLowerCase().includes("sehat") || i.titleEn.toLowerCase().includes("health") || index === 2) {
            bgImage = "/images/initiatives/sehat-card.png";
          } else if (i.id.includes("skills") || i.titleEn.toLowerCase().includes("freelancing") || i.titleEn.toLowerCase().includes("youth") || index === 3) {
            bgImage = "/images/initiatives/youth-skills.png";
          } else if (i.id.includes("digital") || i.titleEn.toLowerCase().includes("digital") || i.titleEn.toLowerCase().includes("e-office") || index === 4) {
            bgImage = "/images/initiatives/digital-balochistan.png";
          } else if (i.id.includes("solar") || i.titleEn.toLowerCase().includes("water") || i.titleEn.toLowerCase().includes("desalination") || index === 5) {
            bgImage = "/images/initiatives/solar-water.png";
          }
        }
        return {
          id: i.id,
          title: i.titleEn,
          category: i.category,
          description: i.descriptionEn,
          impact: `${i.progressPercent}% Target Progress`,
          status: i.status,
          bgImage: bgImage || coreInitiatives[index]?.bgImage,
        };
      });
  } catch (err) {
    console.warn("Falling back to static priorities data:", err);
  }

  return (
    <main id="main-content">
      <PageHero
        eyebrow="Provincial Agenda"
        title={
          <>
            Priorities and <em className="text-pine-200">Core Initiatives.</em>
          </>
        }
        description="A clear, measurable governance roadmap for Balochistan — from day-one executive directives to multi-year development programs across all 36 districts."
        crumbs={[{ label: "Priorities & Initiatives" }]}
      >
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          {[
            { value: "08", label: "Immediate Directives" },
            { value: "06", label: "Core Initiatives" },
            { value: "36", label: "Districts Covered" },
            { value: "100%", label: "Publicly Monitored" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/12 bg-white/[0.05] p-3.5 backdrop-blur">
              <p className="font-display text-2xl text-white">{stat.value}</p>
              <p className="mt-1 text-[9px] leading-relaxed tracking-[0.14em] text-white/40 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </PageHero>

      {/* 1. First-Day Immediate Action Priorities (Continuous 3D Flip Card Slider) */}
      <section className="py-10 sm:py-16 md:py-20 bg-white border-b border-pine-900/10 overflow-hidden w-full max-w-full">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Day-One Directives"
              title={
                <>
                  Priorities for <span className="text-pine-600">Immediate Action.</span>
                </>
              }
              description="Directives announced by the Chief Minister upon taking oath of office to eliminate bottlenecks and enforce institutional discipline."
              className="mb-8"
            />

            <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-600/20 text-center max-w-3xl mx-auto shadow-sm">
              <p className="text-xs sm:text-sm font-medium text-emerald-950 leading-relaxed">
                &ldquo;Our mission is to develop a healthy, sustainable, safe and prosperous Balochistan in which each citizen is empowered, educated and has social and global mobility.&rdquo;
              </p>
            </div>
          </Reveal>
        </Container>

        {/* Full-Screen Edge-to-Edge Continuous 3D Flip Card Slider */}
        <div className="w-full relative">
          <PrioritiesSlider items={displayPriorities} />
        </div>
      </section>

      {/* 2. Transforming the Province Through Key Initiatives */}
      <section id="initiatives" className="scroll-mt-24 py-10 sm:py-16 md:py-20 bg-pine-950 text-white relative overflow-hidden">
        <Container className="relative z-10">
          <Reveal>
            <div className="max-w-2xl mb-8 sm:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                Transforming the Province Through Key Initiatives
              </h2>
              <p className="mt-3 text-sm text-white/75">
                Flagship development projects approved by the Government of Balochistan to modernize infrastructure and deliver social welfare.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayInitiatives.map((init, index) => (
              <Reveal key={init.id} delay={(index % 3) * 60}>
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/20 bg-pine-950 p-7 shadow-2xl transition-all duration-300 hover:border-emerald-500/60 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)]">
                  {/* Background Image with Dark Backdrop */}
                  {init.bgImage && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <Image
                        src={init.bgImage}
                        alt={init.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover opacity-50 transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-35"
                      />
                      {/* Smooth dark vignette overlay for natural contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/80 to-pine-950/60 transition-all duration-500 group-hover:from-pine-950 group-hover:via-pine-950/90 group-hover:to-pine-950/75 pointer-events-none" />
                    </div>
                  )}

                  {/* Foreground Content with Pure White Crisp Typography */}
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20 backdrop-blur-md shadow-sm">
                          {init.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                          {init.status}
                        </span>
                      </div>
                      <h3 className="font-display mt-5 text-2xl font-bold leading-snug text-white transition-colors group-hover:text-gold-300">
                        {init.title}
                      </h3>
                      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/85 font-medium">
                        {init.description}
                      </p>
                    </div>
                    <div className="mt-6 border-t border-white/20 pt-4 flex items-center justify-between text-xs">
                      <span className="text-white font-semibold tracking-tight">{init.impact}</span>
                      <ArrowUpRight className="h-4 w-4 text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>


      {/* 4. Delivery & Accountability Framework */}
      <section className="bg-white py-10 sm:py-16 md:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Delivery & Oversight"
              title={
                <>
                  A promise is only as good as its <span className="text-pine-600">follow-through.</span>
                </>
              }
              description="How the Chief Minister's Office ensures executive commitments translate into tangible service delivery on the ground."
              className="mb-10"
            />
          </Reveal>

          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="glass-card-3d rounded-3xl p-7">
              <div className="icon-box-3d flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-50 text-pine-700">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-4 text-lg font-bold text-pine-950">Measurable Benchmarks</h3>
              <p className="mt-2 text-xs sm:text-sm text-pine-900/70 leading-relaxed">
                Every department operates with published milestones, delivery timelines, and transparent key performance indicators.
              </p>
            </div>

            <div className="glass-card-3d rounded-3xl p-7">
              <div className="icon-box-3d flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-50 text-pine-700">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-4 text-lg font-bold text-pine-950">Open Progress Audits</h3>
              <p className="mt-2 text-xs sm:text-sm text-pine-900/70 leading-relaxed">
                Quarterly reports and on-site inspection teams assess project completion across all 36 districts without political favor.
              </p>
            </div>

            <div className="glass-card-3d rounded-3xl p-7">
              <div className="icon-box-3d flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-50 text-pine-700">
                <MessagesSquare className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-4 text-lg font-bold text-pine-950">Direct Citizen Feedback</h3>
              <p className="mt-2 text-xs sm:text-sm text-pine-900/70 leading-relaxed">
                Citizen feedback collected through the Grievance Redressal Mechanism informs ongoing budget and policy recalibration.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
