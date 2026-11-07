import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  FileText,
  Headphones,
  Play,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  cm,
  coreInitiatives,
  firstDayPriorities,
  news,
  newsCategories,
  visionMission,
} from "@/lib/site";
import { Hero } from "@/components/hero";
import { NewsCard } from "@/components/news-card";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";
import { PrioritiesSlider } from "@/components/priorities-slider";
import { CMCardStack } from "@/components/cm-card-stack";

import { db, type DBGalleryItem } from "@/lib/db";

export default function HomePage() {
  let displayPriorities = firstDayPriorities;
  let displayInitiatives = coreInitiatives;
  let displayNews = news;

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
        bgImage: p.bgImage || staticMatch?.bgImage || `/images/priorities/${p.slug}-2026.jpg`,
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

    const dbN = db.news.findMany({ limit: 4 });
    displayNews = dbN.map((n) => ({
        slug: n.slug,
        title: n.titleEn,
        excerpt: n.excerptEn,
        category: n.category,
        date: new Date(n.publishedDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        dateISO: n.publishedDate,
        readTime: n.readTime,
        body: n.bodyEn ? n.bodyEn.split("\n\n") : [n.excerptEn],
        coverImageUrl: n.coverImageUrl || null,
        videoUrl: n.videoUrl || null,
      }));
  } catch (err) {
    console.warn("Falling back to static home data:", err);
  }

  const [featuredNews, ...otherNews] = displayNews;

  let galleryItems: DBGalleryItem[] = [];
  try {
    galleryItems = db.gallery.findAll({ limit: 3 });
  } catch {
    // fallback if table not yet initialized
  }

  return (
    <main id="main-content">
      {/* 1. Header & Navigation is rendered in layout via <SiteHeader /> */}

      {/* 2. Chief Minister Photograph, Profile & Hero */}
      <Hero />

      {/* 2.05 Quick Pathways Bar overlapping banner (3D Glass Floating Cards) */}
      <section className="relative z-20 -mt-8 sm:-mt-12 md:-mt-16 mb-6 sm:mb-8">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            <Link
              href="/initiatives"
              className="group pathway-card flex flex-col items-center text-center rounded-2xl glass-card-3d glass-sheen p-3 sm:p-5 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-600/40"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl pathway-icon-box transition-all duration-300">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300" />
              </div>
              <h3 className="mt-2.5 sm:mt-3 text-[11px] sm:text-[13px] font-bold text-pine-950 transition-colors duration-300 group-hover:text-emerald-700">
                Development Initiatives
              </h3>
            </Link>

            <Link
              href="/priorities"
              className="group pathway-card flex flex-col items-center text-center rounded-2xl glass-card-3d glass-sheen p-3 sm:p-5 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-600/40"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl pathway-icon-box transition-all duration-300">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300" />
              </div>
              <h3 className="mt-2.5 sm:mt-3 text-[11px] sm:text-[13px] font-bold text-pine-950 transition-colors duration-300 group-hover:text-emerald-700">
                Public Services
              </h3>
            </Link>

            <Link
              href="/news"
              className="group pathway-card flex flex-col items-center text-center rounded-2xl glass-card-3d glass-sheen p-3 sm:p-5 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-600/40"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl pathway-icon-box transition-all duration-300">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300" />
              </div>
              <h3 className="mt-2.5 sm:mt-3 text-[11px] sm:text-[13px] font-bold text-pine-950 transition-colors duration-300 group-hover:text-emerald-700">
                Media & Updates
              </h3>
            </Link>

            <a
              href="https://grmbalochistan.com/complain"
              target="_blank"
              rel="noopener noreferrer"
              className="group pathway-card flex flex-col items-center text-center rounded-2xl glass-card-3d glass-sheen p-3 sm:p-5 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-600/40"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl pathway-icon-box transition-all duration-300">
                <Headphones className="h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300" />
              </div>
              <h3 className="mt-2.5 sm:mt-3 text-[11px] sm:text-[13px] font-bold text-pine-950 transition-colors duration-300 group-hover:text-emerald-700">
                Citizen Facilitation
              </h3>
            </a>
          </div>
        </Container>
      </section>

      {/* 2.1 Chief Minister Welcome Message Section */}
      <section className="relative overflow-hidden py-10 sm:py-16 md:py-24 bg-white border-b border-pine-900/10">
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-pine-100/50 blur-[100px]" aria-hidden="true" />
        <Container>
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16 xl:gap-20">
            {/* CM Official Portrait 3D Card Stack (Fan Deck Effect) */}
            <Reveal>
              <div className="relative mx-auto w-full max-w-[480px]">
                <CMCardStack />

                {/* Floating 3D quote pill */}
                <div className="mt-4 sm:mt-5 rounded-2xl glass-card-3d p-4 sm:p-5 shadow-3d-card border border-white/90">
                  <div className="flex items-start gap-3">
                    <div className="p-2 icon-box-3d text-pine-700 shrink-0">
                      <Quote className="h-4 w-4" />
                    </div>
                    <p className="text-xs leading-relaxed text-pine-900/85">
                      &ldquo;{cm.quote}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Official Message from the Chief Minister */}
            <Reveal delay={100}>
              <div className="relative z-20 lg:pl-4 xl:pl-8">
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold leading-[1.12] text-pine-950">
                  Message from the <span className="heading-accent">Chief Minister</span>
                </h2>

                <div className="mt-6 space-y-4 text-base leading-relaxed text-pine-900/75 sm:text-lg">
                  <p className="font-medium text-pine-950">
                    {cm.welcomeMessage}
                  </p>
                  <p className="text-sm text-pine-900/70 leading-relaxed">
                    Every district of Balochistan possesses unique strengths and aspirations. Our service-delivery model is built
                    on accountability, regular monitoring of public works, direct interaction with local communities, and responsive governance.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-pine-900/10 pt-6 sm:grid-cols-4">
                  {cm.facts.map((fact) => (
                    <div key={fact.label}>
                      <p className="text-[10px] font-semibold tracking-wider text-pine-900/45 uppercase">{fact.label}</p>
                      <p className="mt-1 text-xs font-bold text-pine-950">{fact.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 3. Vision & Mission Section */}
      <section className="relative overflow-hidden py-10 sm:py-16 md:py-20 bg-mist border-b border-pine-900/10">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Provincial Mandate"
              title={
                <>
                  Our <span className="heading-accent">Vision & Mission</span>
                </>
              }
              description="Guided by principles of transparency, inclusive development, and institutional empowerment for every citizen of Balochistan."
              className="mb-12 text-center max-w-2xl mx-auto"
            />
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Our Vision Card (3D Glass) */}
            <Reveal delay={80}>
              <div className="relative h-full rounded-3xl glass-card-3d glass-sheen p-8 sm:p-10 transition-all duration-300 hover:-translate-y-2 hover:border-pine-600/40">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl icon-box-3d text-pine-800">
                  <Compass className="h-7 w-7" />
                </div>
                <span className="mt-6 inline-block text-[11px] font-bold tracking-[0.16em] text-pine-600 uppercase">
                  Long-Term Aspiration
                </span>
                <h3 className="font-display mt-2 text-2xl font-bold text-pine-950 sm:text-3xl">
                  Our Vision
                </h3>
                <p className="mt-4 text-base leading-relaxed text-pine-900/75">
                  {visionMission.vision}
                </p>
                <div className="mt-8 flex items-center gap-2 border-t border-pine-900/10 pt-4 text-xs font-semibold text-pine-700">
                  <Sparkles className="h-4 w-4 text-gold-500" />
                  Inclusive Growth · Peace · Opportunity
                </div>
              </div>
            </Reveal>

            {/* Our Mission Card (3D Glass) */}
            <Reveal delay={160}>
              <div className="relative h-full rounded-3xl glass-card-3d glass-sheen p-8 sm:p-10 transition-all duration-300 hover:-translate-y-2 hover:border-pine-600/40">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl icon-box-3d text-pine-900">
                  <Target className="h-7 w-7" />
                </div>
                <span className="mt-6 inline-block text-[11px] font-bold tracking-[0.16em] text-pine-600 uppercase">
                  Executive Commitment
                </span>
                <h3 className="font-display mt-2 text-2xl font-bold text-pine-950 sm:text-3xl">
                  Our Mission
                </h3>
                <p className="mt-4 text-base leading-relaxed text-pine-900/75">
                  {visionMission.mission}
                </p>
                <div className="mt-8 flex items-center gap-2 border-t border-pine-900/10 pt-4 text-xs font-semibold text-pine-700">
                  <ShieldCheck className="h-4 w-4 text-pine-600" />
                  Service Delivery · Institutional Reform · Citizen Trust
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 4. First-Day Priorities of the Chief Minister (Continuous 3D Flip Card Slider) */}
      <section className="pt-10 pb-12 sm:pt-14 sm:pb-18 md:pt-18 md:pb-22 bg-white border-b border-pine-900/10 overflow-hidden w-full max-w-full">
        <Container>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div>
                <Eyebrow>Day-One Directives</Eyebrow>
                <h2 className="font-display mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-pine-950">
                  Priorities for <span className="heading-accent">Immediate Action</span>
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-pine-900/65">
                  Key administrative directives announced by Chief Minister Mir Sarfraz Bugti upon assuming office, establishing measurable focus areas across provincial governance.
                </p>
              </div>
              <ButtonLink href="/priorities" variant="outline">
                View All Priorities
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>

            {/* Vision mission quote matching Punjab portal style */}
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

      {/* 5. Core Government Initiatives (3D Dark Glass Cards) */}
      <section className="py-10 sm:py-16 md:py-24 bg-pine-950 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-pine-600/20 blur-[140px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-gold-400/10 blur-[130px]" aria-hidden="true" />

        <Container className="relative z-10">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/15 px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-gold-300 uppercase tracking-widest backdrop-blur-md shadow-sm">
                Verified Active Programs
              </span>
              <h2 className="font-display mt-4 sm:mt-5 text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-white">
                Transforming the Province Through <span className="heading-accent-gold">Key Initiatives</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/70">
                Official development programs and public welfare investments driving infrastructure connectivity, healthcare access, and youth opportunities.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayInitiatives.map((init, index) => (
              <Reveal key={init.id} delay={(index % 3) * 70}>
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border-2 border-white/60 bg-pine-950 p-7 shadow-2xl transition-all duration-300 hover:border-white hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)]">
                  {/* Vivid, Transparent Background Image with Hover Blur */}
                  {init.bgImage && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <Image
                        src={init.bgImage}
                        alt={init.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover opacity-85 transition-all duration-500 ease-out group-hover:scale-110 group-hover:blur-md group-hover:opacity-45"
                      />
                      {/* Smooth dark vignette overlay that enriches on hover for effortless reading */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 transition-all duration-500 group-hover:from-black/95 group-hover:via-black/75 group-hover:to-black/55 pointer-events-none" />
                    </div>
                  )}

                  {/* Foreground Content with Pure White Text */}
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/40 backdrop-blur-xs shadow-md">
                          {init.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 uppercase tracking-widest drop-shadow-xs">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                          {init.status}
                        </span>
                      </div>

                      <h3 className="font-display mt-5 text-2xl font-bold leading-snug text-white drop-shadow-md group-hover:text-gold-200 transition-colors">
                        {init.title}
                      </h3>
                      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/95 font-medium drop-shadow-xs">
                        {init.description}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-white/30 pt-4 flex items-center justify-between text-xs">
                      <span className="text-white font-bold tracking-tight drop-shadow-xs">{init.impact}</span>
                      <ArrowUpRight className="h-4 w-4 text-emerald-300 font-bold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 drop-shadow-xs" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-12 rounded-2xl glass-dark-3d p-4 text-center text-xs text-white/60">
              <span className="font-bold text-gold-300">Official Note:</span> Only verified and officially approved government initiatives are presented as active provincial programs.
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 6. Complaint Cell / Grievance Redressal Mechanism (GRM) */}
      <section id="complaint-cell" className="py-10 sm:py-16 md:py-24 bg-white border-b border-pine-900/10">
        <Container>
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
              <Eyebrow className="justify-center">Citizen Grievance Redressal Mechanism</Eyebrow>
              <h2 className="font-display mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold leading-tight text-pine-950">
                <span className="heading-accent">Your Voice</span> Matters
              </h2>
              <p className="mt-4 text-base leading-relaxed text-pine-900/70">
                A direct, accountable channel connecting citizens with the Chief Minister&apos;s Secretariat.
                Submit complaints, monitor resolution milestones, and hold departments accountable.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Pathway 1: Register Complaint (Official GRM) */}
            <Reveal delay={80}>
              <div className="flex h-full flex-col justify-between rounded-3xl glass-card-3d glass-sheen p-8 transition-all duration-300 hover:-translate-y-2 hover:border-pine-600/40">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pine-700 to-pine-900 text-white shadow-md">
                      <FileCheck2 className="h-7 w-7" />
                    </div>
                    <span className="rounded-full bg-pine-200/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-pine-950 uppercase border border-pine-300/50">
                      Official Portal · AWAAZ
                    </span>
                  </div>
                  <h3 className="font-display mt-6 text-2xl font-bold text-pine-950">
                    Register a Complaint
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pine-900/70">
                    Submit grievances regarding healthcare, schooling, drinking water, roads, electricity, or administrative services across all 37 districts of Balochistan.
                  </p>
                </div>
                <div className="mt-8">
                  <a
                    href="https://grmbalochistan.com/complain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-xl py-3.5 text-xs font-bold btn-3d-emerald gap-2"
                  >
                    Register Complaint (Official GRM)
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Pathway 2: Track Your Complaint (Official Tracker) */}
            <Reveal delay={160}>
              <div className="flex h-full flex-col justify-between rounded-3xl glass-card-3d glass-sheen p-8 transition-all duration-300 hover:-translate-y-2 hover:border-gold-400/40">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-400 text-pine-950 shadow-md">
                      <Search className="h-7 w-7" />
                    </div>
                    <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[10px] font-bold tracking-wider text-pine-950 uppercase border border-gold-300/40">
                      Live Tracking System
                    </span>
                  </div>
                  <h3 className="font-display mt-6 text-2xl font-bold text-pine-950">
                    Track Your Complaint
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pine-900/70">
                    Already submitted a grievance? Enter your reference number on the provincial tracking system to view real-time department milestones and resolution findings.
                  </p>
                </div>
                <div className="mt-8">
                  <a
                    href="https://grmbalochistan.com/track"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-xl py-3.5 text-xs font-bold btn-3d-gold gap-2"
                  >
                    Track Complaint Status
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Pathway 3: Complaint Cell Information */}
            <Reveal delay={240}>
              <div className="flex h-full flex-col justify-between rounded-3xl glass-card-3d glass-sheen p-8 transition-all duration-300 hover:-translate-y-2 hover:border-pine-600/40">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl icon-box-3d text-pine-700 shadow-md">
                      <Clock className="h-7 w-7" />
                    </div>
                    <span className="rounded-full bg-pine-200/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-pine-950 uppercase border border-pine-300/50">
                      Policy & Criteria
                    </span>
                  </div>
                  <h3 className="font-display mt-6 text-2xl font-bold text-pine-950">
                    Complaint Cell Info
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pine-900/70">
                    Review complaint guidelines, eligible criteria, 14-day departmental turnaround times, escalation procedures, and citizen feedback policies.
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    href="/complaint-cell"
                    className="w-full rounded-xl py-3.5 text-xs font-bold btn-3d-glass gap-2"
                  >
                    Learn More & Escalation Policy
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Key GRM Standards Row */}
          <Reveal delay={300}>
            <div className="mt-12 rounded-3xl glass-card-3d p-6 sm:p-8 border border-white/95">
              <h4 className="text-xs font-bold tracking-widest text-pine-800 uppercase">
                Grievance Redressal Standards & Features
              </h4>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs font-medium text-pine-900/75">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Unique Tracking Number</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Departmental Routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Escalation Protocol</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Confidential Data Policy</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-pine-900/10 pt-4 text-xs">
                <div className="flex items-center gap-2 text-pine-900/70">
                  <span className="font-bold text-pine-950">Official Integration:</span>
                  <span>Citizen grievances are lodged directly on the provincial Grievance Redressal Mechanism (AWAAZ).</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="tel:1160"
                    className="inline-flex items-center gap-1.5 font-bold text-pine-950 hover:text-pine-700"
                  >
                    <span>24/7 Helpline:</span>
                    <span className="font-mono text-emerald-800">1160</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 7. Latest News & Updates */}
      <section className="py-10 sm:py-16 md:py-24 bg-mist border-b border-pine-900/10">
        <Container>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <Eyebrow>Media Center</Eyebrow>
                <h2 className="font-display mt-3 text-3xl font-bold leading-tight text-pine-950 sm:text-4xl">
                  Latest News from the <span className="heading-accent">Chief Minister’s Office</span>
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-pine-900/65">
                  Official announcements, press releases, high-level development reviews, and ministerial statements.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ButtonLink href="/news" variant="primary">
                  Read More News
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
          </Reveal>

          {/* News Category Pills */}
          <Reveal delay={60}>
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {newsCategories.slice(0, 5).map((category, idx) => (
                <Link
                  key={category}
                  href={`/news?category=${encodeURIComponent(category)}`}
                  className={
                    "rounded-full px-4 py-1.5 text-xs font-semibold " +
                    (idx === 0
                      ? "btn-3d-emerald"
                      : "btn-3d-glass !text-pine-800")
                  }
                >
                  {category}
                </Link>
              ))}
            </div>
          </Reveal>

          {/* News Grid */}
          {featuredNews ? (
            <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
              <Reveal>
                <NewsCard item={featuredNews} index={0} variant="featured" className="h-full" />
              </Reveal>
              <div className="flex flex-col gap-4">
                {otherNews.slice(0, 3).map((item, index) => (
                  <Reveal key={item.slug} delay={80 + index * 60} className="flex-1">
                    <NewsCard item={item} index={index + 1} variant="compact" className="h-full" />
                  </Reveal>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-pine-900/10 p-8 text-center text-sm text-pine-900/60">
              No press releases currently available.
            </div>
          )}
        </Container>
      </section>

      {/* 8. Media & Video Gallery Showcase */}
      {galleryItems.length > 0 && (
        <section className="py-10 sm:py-16 md:py-24 bg-sand/30 border-b border-pine-900/10">
          <Container>
            <Reveal>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <div>
                  <Eyebrow>Visual Archives & Media</Eyebrow>
                  <h2 className="font-display mt-3 text-3xl font-bold leading-tight text-pine-950 sm:text-4xl">
                    Official Photo & <span className="heading-accent">Video Gallery</span>
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-pine-900/65">
                    High-definition photography and videos capturing official provincial meetings, public welfare ceremonies, and ground-level development milestones.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <ButtonLink href="/gallery" variant="primary">
                    Explore Full Gallery
                  </ButtonLink>
                </div>
              </div>
            </Reveal>

            {/* Featured Gallery Grid (3D Glass Cards) */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((item) => (
                <Link
                  key={item.id}
                  href="/gallery"
                  className="group relative rounded-3xl glass-card-3d glass-sheen overflow-hidden shadow-3d-card border border-white/95 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/90">
                    {item.type === "VIDEO" ? (
                      <div className="relative h-full w-full flex items-center justify-center">
                        <video src={item.fileUrl} className="h-full w-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" muted />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                          <div className="h-12 w-12 rounded-full icon-box-3d bg-amber-500 text-white shadow-3d-btn flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="h-5 w-5 ml-0.5 fill-white" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={item.fileUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white ${item.type === "VIDEO" ? "bg-amber-600" : "bg-emerald-600"}`}>
                        {item.type}
                      </span>
                      <span className="rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white/90">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display text-base font-bold text-pine-950 group-hover:text-emerald-800 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="mt-1 text-xs text-pine-900/60 line-clamp-1">{item.description}</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-pine-900/8 flex items-center justify-between text-[11px] text-pine-900/50">
                      <span>{new Date(item.createdAt).toLocaleDateString("en-GB")}</span>
                      <span className="font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                        View in Gallery <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 9. Footer is rendered in layout via <SiteFooter /> */}
    </main>
  );
}
