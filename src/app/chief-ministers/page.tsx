import type { Metadata } from "next";
import { Star } from "lucide-react";
import { chiefMinisters, cm, initialCabinet } from "@/lib/site";
import { db } from "@/lib/db";
import { Container, PageHero, TextLink } from "@/components/ui";
import { LeadershipDirectory } from "@/components/leadership-directory";

export const metadata: Metadata = {
  title: "Former Chief Ministers & Cabinet | Government of Balochistan",
  description:
    "The official directory of provincial leadership: former Chief Ministers who have held the office since 1972 and current Provincial Cabinet members.",
};

interface PageProps {
  searchParams?: Promise<{ tab?: string }>;
}

export default async function ChiefMinistersPage({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const initialTab =
    resolvedParams.tab === "cabinet"
      ? "cabinet"
      : resolvedParams.tab === "cms"
      ? "cms"
      : "all";

  let displayCms = chiefMinisters;
  try {
    const dbFormer = db.formerCms.findMany();
    displayCms = dbFormer.map((f) => ({
      id: f.id,
      name: f.nameEn,
      party: f.partyEn,
      from: f.fromDate,
      to: f.toDate,
      note: f.note || undefined,
    }));
  } catch (err) {
    console.warn("Falling back to static former CMs data:", err);
  }

  let displayCabinet = initialCabinet;
  try {
    const dbMembers = db.cabinet.findMany();
    displayCabinet = dbMembers.map((m, idx) => ({
      id: m.id,
      name: m.nameEn,
      designation: m.designationEn,
      portfolio: m.portfolioEn,
      ministry: m.ministryEn,
      departmentUrl: m.departmentUrl || "https://balochistan.gov.pk",
      isLeader: idx === 0,
    }));
  } catch (err) {
    console.warn("Falling back to static cabinet data:", err);
  }

  return (
    <main id="main-content">
      <PageHero
        eyebrow="Provincial Leadership Directory"
        title={
          <>
            Former Chief Ministers & <em className="text-pine-200">Cabinet Members.</em>
          </>
        }
        description="The complete leadership register of Balochistan: from the elected Chief Ministers who have guided the province since 1972 to the Council of Ministers driving ministerial portfolios today."
        crumbs={[{ label: "Leadership & Cabinet" }]}
      >
        <div className="rounded-2xl border border-white/12 bg-white/[0.05] p-5 backdrop-blur">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-white/40 uppercase">Currently in office</p>
          <p className="font-display mt-2 text-2xl text-white">{cm.name}</p>
          <p className="mt-1 text-[12px] text-white/50">Since {cm.since}</p>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-gold-300">
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            19th Chief Minister & Executive Council
          </div>
        </div>
      </PageHero>

      <section className="py-10 sm:py-16 md:py-20">
        <Container>
          <LeadershipDirectory
            chiefMinisters={displayCms}
            cabinetMembers={displayCabinet}
            initialTab={initialTab}
          />

          <div className="glass-panel-3d mt-10 sm:mt-16 flex flex-col items-start justify-between gap-5 sm:gap-6 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-9 sm:flex-row sm:items-center border border-white/95">
            <div>
              <p className="text-xs font-bold text-pine-700 tracking-wider uppercase">Executive Governance</p>
              <p className="font-display mt-2 text-2xl font-bold text-pine-950">Read the Chief Minister&apos;s full profile & vision.</p>
              <p className="text-xs text-pine-900/60 mt-1">Official biography, priorities and message from Mir Sarfraz Bugti.</p>
            </div>
            <TextLink href="/chief-minister">Know Your CM</TextLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
