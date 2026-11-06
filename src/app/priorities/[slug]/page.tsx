import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check, ClipboardList, Phone } from "lucide-react";
import { priorities, site } from "@/lib/site";
import { db } from "@/lib/db";
import { priorityIcons } from "@/components/priority-card";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container, Eyebrow, PageHero } from "@/components/ui";

type Props = PageProps<"/priorities/[slug]">;

export function generateStaticParams() {
  return priorities.map((priority) => ({ slug: priority.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dbPriority = db.priorities.findBySlug(slug);
  if (!dbPriority) return { title: "Priority not found" };
  return {
    title: dbPriority.titleEn,
    description: dbPriority.shortEn,
  };
}

export default async function PriorityPage({ params }: Props) {
  const { slug } = await params;
  const dbPriority = db.priorities.findBySlug(slug);
  if (!dbPriority) notFound();

  const staticMatch = priorities.find((item) => item.slug === slug);
  const priority = {
    slug: dbPriority.slug,
    title: dbPriority.titleEn,
    short: dbPriority.shortEn,
    description: dbPriority.descriptionEn,
    icon: (dbPriority.icon || staticMatch?.icon || "landmark") as keyof typeof priorityIcons,
    initiatives: staticMatch?.initiatives || [],
  };
  const Icon = priorityIcons[priority.icon] || priorityIcons.landmark;
  const allPriorities = db.priorities.findMany();
  const currentIndex = allPriorities.findIndex((p) => p.slug === slug);
  const related = allPriorities.filter((p) => p.slug !== slug).slice(0, 3).map((p) => ({
    slug: p.slug,
    title: p.titleEn,
    short: p.shortEn,
    description: p.descriptionEn,
    icon: (p.icon || "landmark") as keyof typeof priorityIcons,
    initiatives: [],
  }));

  return (
    <main id="main-content">
      <PageHero
        eyebrow={`Priority ${String((currentIndex >= 0 ? currentIndex : 0) + 1).padStart(2, "0")} of ${String(allPriorities.length).padStart(2, "0")}`}
        title={priority.title}
        description={priority.short}
        crumbs={[{ label: "Priorities", href: "/priorities" }, { label: priority.title }]}
      >
        <div className="flex items-center gap-4 rounded-2xl glass-dark-3d p-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl icon-box-3d bg-pine-900 text-gold-300 relative overflow-hidden">
            {dbPriority?.iconImage ? (
              <Image src={dbPriority.iconImage} alt={priority.title} fill className="object-contain p-2" />
            ) : (
              <Icon className="h-6 w-6" aria-hidden="true" strokeWidth={1.5} />
            )}
          </span>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-white/50 uppercase">Provincial priority</p>
            <p className="font-display mt-1 text-xl text-white font-bold">{priority.title}</p>
          </div>
        </div>
      </PageHero>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
            <div>
              <Reveal>
                <Eyebrow>Overview</Eyebrow>
                <h2 className="font-display mt-4 text-3xl leading-[1.12] text-balance text-pine-950 sm:text-4xl font-extrabold">
                  Why this matters for Balochistan.
                </h2>
                <p className="mt-5 text-[0.98rem] leading-relaxed text-pine-900/70">{priority.description}</p>
                <p className="mt-4 text-[0.98rem] leading-relaxed text-pine-900/70">
                  Progress is reported each quarter against published targets. The responsible department works with district
                  administrations, community representatives and provincial partners to deliver results on the ground.
                </p>

                {/* Attached Article Image if uploaded from Admin */}
                {dbPriority?.articleImage && (
                  <div className="mt-8 relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-2xl border border-pine-900/15">
                    <Image
                      src={dbPriority.articleImage}
                      alt={priority.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Attached Article Extended Text if uploaded from Admin */}
                {dbPriority?.articleText && (
                  <div className="mt-6 rounded-3xl glass-panel-3d p-6 border border-pine-900/10">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-pine-900/50 mb-2">
                      Official Implementation Directive & Article
                    </p>
                    <p className="text-sm leading-relaxed text-pine-950 whitespace-pre-line font-medium">
                      {dbPriority.articleText}
                    </p>
                  </div>
                )}
              </Reveal>

              <Reveal delay={80}>
                <div className="mt-10">
                  <h3 className="font-display text-2xl font-bold text-pine-950">What we are doing</h3>
                  <ul className="mt-5 space-y-3">
                    {priority.initiatives.map((initiative, i) => (
                      <li key={initiative} className="flex items-start gap-4 rounded-2xl glass-card-3d p-4 transition-all duration-300 hover:-translate-y-1">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl icon-box-3d bg-pine-50 text-pine-700">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-[13px] font-bold text-pine-950">{initiative}</p>
                          <p className="mt-0.5 text-[11px] text-pine-900/50">Initiative {String(i + 1).padStart(2, "0")}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="mt-10 rounded-3xl glass-panel-3d p-6 sm:p-7">
                  <p className="text-[10px] font-bold tracking-[0.18em] text-pine-900/50 uppercase">How progress is reported</p>
                  <p className="mt-2 text-[0.93rem] leading-relaxed text-pine-900/75">
                    Delivery updates are published every quarter on this website. Where a target is missed, the department explains why and
                    sets out corrective action — because accountability is part of the agenda, not an afterthought.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <aside className="lg:sticky lg:top-28">
                <div className="rounded-3xl glass-card-3d p-6 shadow-3d-card border border-white/95">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl icon-box-3d bg-pine-900 text-gold-300">
                      <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.6} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.16em] text-pine-900/50 uppercase">At a glance</p>
                      <p className="text-sm font-bold text-pine-950">Priority {String((currentIndex >= 0 ? currentIndex : 0) + 1).padStart(2, "0")}</p>
                    </div>
                  </div>

                  <dl className="mt-6 space-y-4 border-t border-pine-900/8 pt-5">
                    <div>
                      <dt className="text-[10px] font-bold tracking-[0.14em] text-pine-900/50 uppercase">Focus area</dt>
                      <dd className="mt-1 text-[13px] font-bold text-pine-950">{priority.title}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-bold tracking-[0.14em] text-pine-900/50 uppercase">Delivery</dt>
                      <dd className="mt-1 text-[13px] leading-relaxed text-pine-900/70">
                        District administrations and provincial departments, coordinated by the Chief Minister&apos;s Office.
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-bold tracking-[0.14em] text-pine-900/50 uppercase">Reporting</dt>
                      <dd className="mt-1 text-[13px] text-pine-900/70 font-semibold">Quarterly public progress updates</dd>
                    </div>
                  </dl>

                  <div className="mt-6 space-y-3 border-t border-pine-900/8 pt-5">
                    <ButtonLink href="/connect#complaint" variant="primary" className="w-full">
                      Register a complaint
                    </ButtonLink>
                    <a
                      href={`tel:${site.phone.replace(/\s/g, "")}`}
                      className="btn-3d-glass w-full rounded-2xl py-3 text-[12px] font-bold gap-2"
                    >
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      {site.phone}
                    </a>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl glass-card-3d p-5 border border-white/95">
                  <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-pine-900/50 uppercase">
                    <ClipboardList className="h-3.5 w-3.5 text-pine-700" aria-hidden="true" />
                    Related priorities
                  </p>
                  <ul className="mt-3 space-y-1">
                    {related.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/priorities/${item.slug}`}
                          className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-pine-50 hover:translate-x-1"
                        >
                          <span className="text-[12px] font-bold leading-snug text-pine-950">{item.title}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-pine-900/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pine-700" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </Reveal>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-5 border-t border-pine-900/10 pt-8 sm:flex-row sm:items-center">
            <Link href="/priorities" className="btn-3d-glass rounded-xl px-4 py-2 text-xs font-bold gap-2">
              Back to all priorities
            </Link>
            <ButtonLink href={`/priorities/${related[0].slug}`} variant="outline">
              Next: {related[0].title}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
