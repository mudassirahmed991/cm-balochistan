import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import { news, site } from "@/lib/site";
import { db } from "@/lib/db";
import { NewsArt } from "@/components/patterns";
import { NewsCard } from "@/components/news-card";
import { SocialIcon } from "@/components/social-icons";
import { Reveal } from "@/components/reveal";
import { Container, Eyebrow, PageHero } from "@/components/ui";

type Props = PageProps<"/news/[slug]">;

export function generateStaticParams() {
  return news.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dbMatch = db.news.findBySlug(slug);
  const item = dbMatch
    ? { title: dbMatch.titleEn, excerpt: dbMatch.excerptEn, dateISO: dbMatch.publishedDate }
    : null;

  if (!item) return { title: "Story not found" };
  return {
    title: item.title,
    description: item.excerpt,
    openGraph: {
      type: "article",
      title: item.title,
      description: item.excerpt,
      publishedTime: item.dateISO,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  const dbArticle = db.news.findBySlug(slug);
  if (!dbArticle) {
    notFound();
  }

  const item = {
    slug: dbArticle.slug,
    title: dbArticle.titleEn,
    excerpt: dbArticle.excerptEn,
    category: dbArticle.category,
    date: new Date(dbArticle.publishedDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    dateISO: dbArticle.publishedDate,
    readTime: dbArticle.readTime,
    body: dbArticle.bodyEn ? dbArticle.bodyEn.split("\n\n") : [dbArticle.excerptEn],
    coverImageUrl: dbArticle.coverImageUrl,
    videoUrl: dbArticle.videoUrl,
  };

  const allArticles = db.news.findMany();
  const index = Math.max(0, allArticles.findIndex((a) => a.slug === slug));
  const related = allArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 2)
    .map((a) => ({
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
      coverImageUrl: a.coverImageUrl,
      videoUrl: a.videoUrl,
    }));
  const shareUrl = `${site.url}/news/${item.slug}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(item.title);

  const shareLinks = [
    { label: "Share on X", name: "x" as const, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: "Share on Facebook", name: "facebook" as const, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "Share on LinkedIn", name: "linkedin" as const, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "Share by email", name: "instagram" as const, href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];

  return (
    <main id="main-content">
      <PageHero
        eyebrow={item.category}
        title={item.title}
        description={item.excerpt}
        crumbs={[{ label: "Media Room", href: "/news" }, { label: "News Updates", href: "/news" }, { label: item.category }]}
      >
        <div className="rounded-2xl border border-white/12 bg-white/[0.05] p-5 text-white backdrop-blur">
          <p className="flex items-center gap-2 text-[11px] text-white/55">
            <CalendarDays className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
            {item.date}
          </p>
          <p className="mt-2 flex items-center gap-2 text-[11px] text-white/55">
            <Clock className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
            {item.readTime}
          </p>
          <p className="mt-4 border-t border-white/10 pt-3 text-[10px] font-semibold tracking-[0.16em] text-white/35 uppercase">
            Office of the Chief Minister
          </p>
        </div>
      </PageHero>

      <article className="py-14 sm:py-20">
        <Container>
          <Reveal className="mx-auto max-w-5xl">
            {item.videoUrl ? (
              <div className="rounded-3xl overflow-hidden bg-black shadow-lift aspect-[16/9] relative border border-pine-900/10">
                <video
                  src={item.videoUrl}
                  controls
                  playsInline
                  autoPlay={false}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : item.coverImageUrl ? (
              <div className="relative aspect-[16/8] rounded-3xl overflow-hidden shadow-lift border border-pine-900/10">
                <Image
                  src={item.coverImageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority
                />
                <span className="absolute left-5 top-5 rounded-full bg-black/40 border border-white/30 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.16em] text-white uppercase backdrop-blur-md">
                  {item.category}
                </span>
              </div>
            ) : (
              <div className="image-3d-frame overflow-hidden rounded-3xl shadow-lift">
                <NewsArt index={index} className="aspect-[16/8]">
                  <span className="absolute left-5 top-5 rounded-full bg-white/20 border border-white/30 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.16em] text-white uppercase backdrop-blur-md shadow-soft">
                    {item.category}
                  </span>
                </NewsArt>
              </div>
            )}
          </Reveal>

          <div className="mx-auto mt-12 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 border-b border-pine-900/10 pb-5 text-[11px] font-bold tracking-[0.1em] text-pine-900/50 uppercase">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-pine-700" aria-hidden="true" />
                {item.date}
              </span>
              <span className="h-3 w-px bg-pine-900/15" aria-hidden="true" />
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-pine-700" aria-hidden="true" />
                {item.readTime}
              </span>
              <span className="ml-auto rounded-full bg-pine-100/80 border border-pine-200 px-3 py-1 text-[10px] font-bold text-pine-800">{item.category}</span>
            </div>

            <div className="prose-cm mt-8">
              {item.body.map((paragraph) => (
                <p key={paragraph.slice(0, 30)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-pine-900/10 pt-6">
              <p className="text-[11px] font-bold tracking-[0.16em] text-pine-900/50 uppercase">Share this update</p>
              <div className="flex items-center gap-2">
                {shareLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="icon-box-3d flex h-10 w-10 items-center justify-center rounded-xl text-pine-900/70 hover:text-pine-950 transition-colors"
                  >
                    <SocialIcon name={link.name} />
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-card-3d mt-10 rounded-3xl p-6 sm:p-7">
              <Eyebrow>Media office</Eyebrow>
              <p className="mt-3 text-[13px] leading-relaxed text-pine-900/70 font-medium">
                For interviews, statements or further information, contact the Office of the Chief Minister. Please include your outlet and
                deadline in any request.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-[12px] font-bold text-pine-900">
                <a href={`mailto:${site.email}`} className="hover:text-pine-700 transition-colors">{site.email}</a>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-pine-700 transition-colors">{site.phone}</a>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <Link href="/news" className="btn-3d-glass inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-pine-950">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                All news updates
              </Link>
              <Link
                href="/connect"
                className="btn-3d-emerald inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white"
              >
                Contact the office
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </article>

      <section className="border-t border-pine-900/8 bg-mist py-14 sm:py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <Eyebrow>Keep reading</Eyebrow>
              <h2 className="font-display mt-3 text-2xl text-pine-950 sm:text-3xl">More from the media room</h2>
            </div>
            <Link href="/news" className="hidden text-[12px] font-semibold text-pine-800 hover:text-pine-600 sm:inline-flex">
              All updates
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((entry) => (
              <Reveal key={entry.slug}>
                <NewsCard item={entry} index={news.findIndex((n) => n.slug === entry.slug)} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
