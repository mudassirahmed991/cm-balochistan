import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCheck, Layers, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { Container, PageHero } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { coreInitiatives } from "@/lib/site";
import { db } from "@/lib/db";
import { InitiativesGrid, type InitiativeItem } from "@/components/initiatives-grid";

export const metadata: Metadata = {
  title: "Development Initiatives | Government of Balochistan",
  description:
    "Explore the flagship development projects approved and executed by the Government of Balochistan across transportation, healthcare, digital infrastructure, and education.",
};

export default function InitiativesPage() {
  let displayInitiatives: InitiativeItem[] = coreInitiatives.map((i) => ({
    id: i.id,
    title: i.title,
    category: i.category,
    description: i.description,
    impact: i.impact,
    status: i.status,
    bgImage: i.bgImage,
  }));

  try {
    const dbI = db.initiatives.findMany();
    displayInitiatives = dbI.map((i, index) => {
      let bgImage: string | undefined;
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
    console.warn("Falling back to static initiatives data:", err);
  }

  return (
    <main id="main-content">
      {/* 1. Page Hero */}
      <PageHero
        eyebrow=""
        title="Transforming Balochistan Through Key Initiatives"
        description="Flagship development projects approved by the Government of Balochistan to modernize public transit, healthcare, digital governance, clean water, and youth employment under the leadership of Mir Sarfraz Bugti."
        crumbs={[{ label: "Development Initiatives" }]}
      >
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <p className="mt-2 text-2xl font-bold text-white">6+</p>
            <p className="text-[11px] font-medium text-white/60">Flagship Programs</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
            <Users className="h-5 w-5 text-teal-300" />
            <p className="mt-2 text-2xl font-bold text-white">36</p>
            <p className="text-[11px] font-medium text-white/60">Districts Covered</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            <p className="mt-2 text-2xl font-bold text-white">100%</p>
            <p className="text-[11px] font-medium text-white/60">Active Delivery</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
            <ShieldCheck className="h-5 w-5 text-gold-300" />
            <p className="mt-2 text-2xl font-bold text-white">KPI</p>
            <p className="text-[11px] font-medium text-white/60">Real-Time Audit</p>
          </div>
        </div>
      </PageHero>

      {/* 2. Main Initiatives Grid with Pure White Text */}
      <section className="py-10 sm:py-16 md:py-24 bg-pine-950 text-white relative overflow-hidden">
        {/* Subtle ambient light glow */}
        <div className="pointer-events-none absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[140px]" />
        <div className="pointer-events-none absolute -right-32 bottom-1/4 h-[500px] w-[500px] rounded-full bg-teal-600/10 blur-[140px]" />

        <Container className="relative z-10">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Major Public Programs in Action
              </h2>
              <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed">
                Direct intervention projects designed to produce tangible, measurable improvements in everyday lives of citizens across Balochistan.
              </p>
            </div>
          </Reveal>

          <InitiativesGrid items={displayInitiatives} />
        </Container>
      </section>

      {/* 3. Delivery & Oversight Principles */}
      <section className="py-10 sm:py-16 md:py-20 bg-white border-t border-b border-pine-900/10">
        <Container>
          <Reveal>
            <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-pine-950 sm:text-4xl">
                Accountability & Progress Tracking
              </h2>
              <p className="mt-3 text-pine-900/70 text-sm sm:text-base">
                Every initiative is governed by strict milestones, physical on-ground inspections, and transparent timelines.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl glass-card-3d p-8 border border-pine-900/10 transition-all hover:-translate-y-1.5 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl icon-box-3d text-pine-800 mb-6">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-pine-950 mb-2">Milestone Audits</h3>
              <p className="text-sm text-pine-900/70 leading-relaxed">
                Project delivery phases undergo independent validation and expenditure reviews before subsequent funds are disbursed.
              </p>
            </div>

            <div className="rounded-3xl glass-card-3d p-8 border border-pine-900/10 transition-all hover:-translate-y-1.5 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl icon-box-3d text-pine-800 mb-6">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-pine-950 mb-2">Cabinet Dashboard</h3>
              <p className="text-sm text-pine-900/70 leading-relaxed">
                The Chief Minister directly reviews bi-weekly status updates on each initiative via an integrated executive digital dashboard.
              </p>
            </div>

            <div className="rounded-3xl glass-card-3d p-8 border border-pine-900/10 transition-all hover:-translate-y-1.5 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl icon-box-3d text-pine-800 mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-pine-950 mb-2">Citizen Feedback</h3>
              <p className="text-sm text-pine-900/70 leading-relaxed">
                Grievance redressal teams collect real-time citizen feedback regarding service delivery quality to take immediate corrective measures.
              </p>
            </div>
          </div>

          {/* Quick Action Footer Banner */}
          <div className="mt-14 rounded-3xl bg-pine-950 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-display">
                Have feedback on an initiative in your district?
              </h3>
              <p className="mt-1.5 text-sm text-white/70">
                Lodge a formal grievance or submit observations through the Chief Minister Complaint Cell.
              </p>
            </div>
            <Link
              href="/complaint-cell"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white transition-all shadow-lg shadow-emerald-900/40 shrink-0"
            >
              <span>Citizen Complaint Cell</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
