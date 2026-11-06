import type { Metadata } from "next";
import { Clock, Mail, Newspaper, Phone } from "lucide-react";
import { news as fallbackNews, site } from "@/lib/site";
import { db } from "@/lib/db";
import { NewsList } from "@/components/news-list";
import { Reveal } from "@/components/reveal";
import { Container, Eyebrow, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "News Updates | Chief Minister of Balochistan",
  description: "Official press releases, announcements and stories of progress from the Office of the Chief Minister of Balochistan.",
};

export default function NewsPage() {
  let displayNews: typeof fallbackNews = [];

  try {
    const dbArticles = db.news.findMany();
    displayNews = dbArticles.map((a) => ({
      slug: a.slug,
      title: a.titleEn,
      excerpt: a.excerptEn,
      category: a.category,
      date: new Date(a.publishedDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      dateISO: a.publishedDate,
      readTime: a.readTime,
      body: a.bodyEn ? a.bodyEn.split("\n\n") : [a.excerptEn],
      coverImageUrl: a.coverImageUrl || null,
      videoUrl: a.videoUrl || null,
    }));
  } catch (err) {
    console.warn("Falling back to static news data:", err);
    displayNews = fallbackNews;
  }

  const latest = displayNews[0] || null;

  return (
    <main id="main-content">
      <PageHero
        eyebrow="Media room"
        title={
          <>
            News and updates from <em className="text-pine-200">the office.</em>
          </>
        }
        description="Announcements, decisions and stories of progress from across Balochistan. Filter by subject, or browse the latest updates in full."
        crumbs={[{ label: "Media Room" }, { label: "News Updates" }]}
      >
        {latest && (
          <div className="rounded-2xl border border-white/12 bg-white/[0.05] p-5 backdrop-blur">
            <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-white/40 uppercase">
              <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
              Latest update
            </p>
            <p className="font-display mt-2 text-lg leading-snug text-white">{latest.title}</p>
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-white/45">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {latest.date} · {latest.readTime}
            </p>
          </div>
        )}
      </PageHero>

      <section className="py-10 sm:py-16 md:py-20">
        <Container>
          <Reveal>
            <NewsList items={displayNews} />
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-pine-900/8 bg-mist py-10 sm:py-14">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <Reveal>
              <Eyebrow>Media enquiries</Eyebrow>
              <p className="font-display mt-3 max-w-xl text-2xl leading-snug text-pine-950">
                Journalists can reach the media office for statements, interviews and background.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2 rounded-full border border-pine-900/15 bg-white px-5 py-3 text-[12px] font-semibold text-pine-900 transition-colors hover:border-pine-900/35"
                >
                  <Mail className="h-4 w-4 text-pine-700" aria-hidden="true" />
                  {site.email}
                </a>
                <a
                  href={`tel:${site.phone}`}
                  className="flex items-center gap-2 rounded-full border border-pine-900/15 bg-white px-5 py-3 text-[12px] font-semibold text-pine-900 transition-colors hover:border-pine-900/35"
                >
                  <Phone className="h-4 w-4 text-pine-700" aria-hidden="true" />
                  {site.phone}
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </main>
  );
}
