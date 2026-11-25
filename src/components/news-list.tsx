"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import type { NewsItem } from "@/lib/site";
import { NewsCard } from "./news-card";
import { cn } from "@/lib/utils";

const officialCategories = [
  "All",
  "Official Meetings",
  "Press Releases",
  "Policy Announcements",
  "Development Projects",
  "Public Welfare Initiatives",
  "Speeches and Statements",
  "Visits and Events",
] as const;

const ITEMS_PER_PAGE = 18;

const WP_CATEGORY_MAP: Record<string, string> = {
  Development: "Development Projects",
  Health: "Public Welfare Initiatives",
  Agriculture: "Public Welfare Initiatives",
  Youth: "Policy Announcements",
  Education: "Policy Announcements",
  Culture: "Visits and Events",
  "MEETINGS/BRIEFINGS": "Official Meetings",
  "CABINET MEETINGS": "Official Meetings",
  "MEETINGS WITH DELEGATIONS": "Official Meetings",
  "MEETINGS WITH FOREIGN DELEGATIONS": "Official Meetings",
  "ASSEMBLY SESSIONS": "Policy Announcements",
  "TOURS AND VISITS": "Visits and Events",
  "ATTENDED CEREMONIES/FUNCTIONS": "Visits and Events",
  CONDOLES: "Press Releases",
  Uncategorized: "Press Releases",
};

function normalizeCategory(cat: string): string {
  return WP_CATEGORY_MAP[cat] || cat;
}

export function NewsList({
  items,
  initialCategory = "All",
}: {
  items: NewsItem[];
  initialCategory?: string;
}) {
  const validInitial =
    initialCategory === "All Updates"
      ? "All"
      : officialCategories.includes(initialCategory as (typeof officialCategories)[number])
        ? initialCategory
        : normalizeCategory(initialCategory) in WP_CATEGORY_MAP ||
            officialCategories.includes(normalizeCategory(initialCategory) as (typeof officialCategories)[number])
          ? normalizeCategory(initialCategory)
          : "All";

  const [active, setActive] = useState<string>(validInitial);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  // Normalize category mappings for both WordPress exports and seeded updates
  const normalizedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      category: normalizeCategory(item.category),
    }));
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return normalizedItems
      .filter((item) => {
        const matchesCategory = active === "All" || item.category === active;
        const matchesQuery =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime();
        }
        return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime();
      });
  }, [active, query, sortBy, normalizedItems]);

  const showFeatured = active === "All" && !query && sortBy === "newest" && page === 1;
  const featured = showFeatured ? filtered[0] : undefined;
  const listSource = showFeatured ? filtered.slice(1) : filtered;
  const totalPages = Math.max(1, Math.ceil(listSource.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedRest = listSource.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  return (
    <div>
      {/* Controls Bar: Search & Category Filters */}
      <div className="glass-card-3d mb-8 space-y-4 rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Keyword Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-pine-900/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search news, statements, or press releases..."
              className="glass-input-3d w-full rounded-2xl pl-10 pr-9 py-2.5 text-xs text-pine-950 placeholder:text-pine-900/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pine-900/40 hover:text-pine-900 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Sort By Toggle */}
          <div className="flex items-center gap-2 text-xs text-pine-900/70">
            <span className="text-[11px] font-bold uppercase tracking-wider">Order:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as "newest" | "oldest");
                setPage(1);
              }}
              aria-label="Sort news articles by date"
              className="glass-input-3d rounded-xl px-3 py-1.5 text-xs font-bold text-pine-950 outline-none"
            >
              <option value="newest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 border-t border-pine-900/10 pt-4" role="group" aria-label="Official categories">
          {officialCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActive(category);
                setPage(1);
              }}
              aria-pressed={active === category}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all",
                active === category
                  ? "btn-3d-emerald text-white"
                  : "btn-3d-glass text-pine-900/80 hover:text-pine-950",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Banner (if initial load) */}
      {showFeatured && featured && (
        <div className="mb-8">
          <NewsCard item={featured} index={0} variant="featured" />
        </div>
      )}

      {/* Grid of Results */}
      {paginatedRest.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedRest.map((item, index) => (
              <NewsCard
                key={item.slug}
                item={item}
                index={showFeatured ? index + 1 : (safePage - 1) * ITEMS_PER_PAGE + index}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl glass-card-3d px-5 py-3.5">
              <p className="text-xs font-medium text-pine-900/65">
                Showing page <span className="font-bold text-pine-950">{safePage}</span> of{" "}
                <span className="font-bold text-pine-950">{totalPages}</span> ({filtered.length} updates)
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="btn-3d-glass inline-flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-bold text-pine-950 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </button>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="btn-3d-emerald inline-flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-bold text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : filtered.length === 0 ? (
        <div className="glass-card-3d rounded-3xl p-12 text-center">
          <p className="text-sm font-bold text-pine-950">No updates found</p>
          <p className="mt-1 text-xs text-pine-900/60">
            No official publications match the selected category &ldquo;{active}&rdquo;{query ? ` or search term "${query}"` : ""}.
          </p>
          <button
            type="button"
            onClick={() => {
              setActive("All");
              setQuery("");
              setPage(1);
            }}
            className="btn-3d-emerald mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
