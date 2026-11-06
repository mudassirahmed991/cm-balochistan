import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, Clock, Film, Play } from "lucide-react";
import type { NewsItem } from "@/lib/site";
import { NewsArt } from "./patterns";
import { cn } from "@/lib/utils";

export function NewsCard({
  item,
  index,
  variant = "card",
  className,
}: {
  item: NewsItem;
  index: number;
  variant?: "card" | "featured" | "compact";
  className?: string;
}) {
  const href = `/news/${item.slug}`;

  // Helper renderer for visual header (Video > Image > Pattern)
  const renderMedia = (aspectClass: string, isFeatured = false) => {
    if (item.videoUrl) {
      return (
        <div className={cn("relative overflow-hidden bg-black/90 flex items-center justify-center", aspectClass)}>
          <video
            src={item.videoUrl}
            preload="metadata"
            muted
            className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-12 w-12 rounded-full icon-box-3d bg-amber-500 text-white shadow-3d-btn flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="h-5 w-5 ml-0.5 fill-white" />
            </div>
          </div>
          <div className="absolute left-3 top-3 flex items-center gap-1.5 z-10">
            <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow flex items-center gap-1">
              <Film className="h-2.5 w-2.5" />
              Video
            </span>
            <span className="rounded-full bg-black/50 backdrop-blur-md px-2 py-0.5 text-[8px] font-bold text-white/95 uppercase">
              {item.category}
            </span>
          </div>
        </div>
      );
    }

    if (item.coverImageUrl) {
      return (
        <div className={cn("relative overflow-hidden bg-black/20", aspectClass)}>
          <Image
            src={item.coverImageUrl}
            alt={item.title}
            fill
            sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute left-3 top-3 flex items-center gap-1.5 z-10">
            <span className="rounded-full bg-black/40 px-2.5 py-1 text-[9px] font-bold tracking-[0.16em] text-white uppercase backdrop-blur-md">
              {item.category}
            </span>
            {isFeatured && (
              <span className="rounded-full btn-3d-gold px-2.5 py-0.5 text-[9px] font-bold tracking-[0.16em] uppercase">
                Latest
              </span>
            )}
          </div>
        </div>
      );
    }

    return (
      <NewsArt index={index} className={aspectClass}>
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-black/35 px-2.5 py-1 text-[9px] font-bold tracking-[0.16em] text-white uppercase backdrop-blur-md">
            {item.category}
          </span>
          {isFeatured && (
            <span className="rounded-full btn-3d-gold px-2.5 py-0.5 text-[9px] font-bold tracking-[0.16em] uppercase">
              Latest
            </span>
          )}
        </div>
      </NewsArt>
    );
  };

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-4 rounded-2xl glass-card-3d p-3 transition-all duration-300 hover:-translate-y-1 hover:border-pine-600/30",
          className,
        )}
      >
        <div className="h-20 w-24 shrink-0 rounded-xl overflow-hidden shadow-inner relative">
          {item.coverImageUrl ? (
            <Image src={item.coverImageUrl} alt={item.title} fill className="object-cover" />
          ) : item.videoUrl ? (
            <div className="h-full w-full bg-black/90 flex items-center justify-center">
              <Play className="h-5 w-5 text-amber-400 fill-amber-400" />
            </div>
          ) : (
            <NewsArt index={index} className="h-full w-full" />
          )}
          <span className="absolute left-1.5 top-1.5 rounded-full bg-black/50 px-1.5 py-0.5 text-[7px] font-semibold text-white uppercase backdrop-blur-md">
            {item.category}
          </span>
        </div>
        <span className="min-w-0 flex-1 py-1 pr-2">
          <span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.1em] text-pine-900/50 uppercase">
            {item.date}
          </span>
          <span className="mt-1 line-clamp-2 block text-sm font-semibold leading-snug text-pine-950 transition-colors group-hover:text-pine-700">
            {item.title}
          </span>
        </span>
        <ArrowUpRight className="mr-1 h-4 w-4 shrink-0 text-pine-900/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pine-700" aria-hidden="true" />
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <article className={cn("group relative overflow-hidden rounded-3xl glass-card-3d glass-sheen shadow-3d-card transition-all duration-400 hover:-translate-y-1.5 hover:shadow-3d-hover hover:border-pine-600/40", className)}>
        <Link href={href} className="grid h-full md:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[220px] md:min-h-[340px]">
            {renderMedia("h-full w-full", true)}
            <div className="absolute inset-0 flex items-end p-5 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/90">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                {item.date}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div>
              <h3 className="font-display text-2xl leading-[1.15] text-pine-950 text-balance transition-colors group-hover:text-pine-700 sm:text-[1.9rem]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-pine-900/65">{item.excerpt}</p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-pine-900/10 pt-4">
              <span className="flex items-center gap-1.5 text-[11px] text-pine-900/50">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {item.readTime}
              </span>
              <span className="inline-flex items-center gap-2 text-[12px] font-bold text-pine-800">
                Read story
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 text-pine-600" aria-hidden="true" />
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className={cn("group flex h-full flex-col overflow-hidden rounded-3xl glass-card-3d glass-sheen transition-all duration-300 hover:-translate-y-1.5 hover:shadow-3d-hover hover:border-pine-600/40", className)}>
      <Link href={href} className="flex h-full flex-col">
        {renderMedia("relative aspect-[16/10] w-full")}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.1em] text-pine-900/50 uppercase">
            <span>{item.date}</span>
            <span className="h-3 w-px bg-pine-900/15" aria-hidden="true" />
            <span>{item.readTime}</span>
          </div>
          <h3 className="font-display mt-3 text-[1.35rem] leading-snug text-pine-950 transition-colors group-hover:text-pine-700">
            {item.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-pine-900/60">{item.excerpt}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[12px] font-bold text-pine-800">
            Read story
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 text-pine-600" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
