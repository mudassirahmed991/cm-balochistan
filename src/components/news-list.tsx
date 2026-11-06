"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
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

export function NewsList({ items }: { items: NewsItem[] }) {
  const [active, setActive] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Normalize category mappings for demo data
  const normalizedItems = useMemo(() => {
    return items.map((item) => {
      let mappedCat = item.category;
      if (item.category === "Development") mappedCat = "Development Projects";
      if (item.category === "Health" || item.category === "Agriculture") mappedCat = "Public Welfare Initiatives";
      if (item.category === "Youth" || item.category === "Education") mappedCat = "Policy Announcements";
      if (item.category === "Culture") mappedCat = "Visits and Events";
      return { ...item, category: mappedCat };
    });
  }, [items]);

  const filtered = useMemo(() => {
    return normalizedItems
      .filter((item) => {
        const matchesCategory = active === "All" || item.category === active;
        const matchesQuery =
          !query ||
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime();
        }
        return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime();
      });
  }, [active, query, sortBy, normalizedItems]);

  const showFeatured = active === "All" && !query && sortBy === "newest";
  const featured = filtered[0];
  const rest = showFeatured ? filtered.slice(1) : filtered;

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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news, statements, or press releases..."
              className="glass-input-3d w-full rounded-2xl pl-10 pr-9 py-2.5 text-xs text-pine-950 placeholder:text-pine-900/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
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
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
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
              onClick={() => setActive(category)}
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
      {rest.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((item, index) => (
            <NewsCard key={item.slug} item={item} index={showFeatured ? index + 1 : index} />
          ))}
        </div>
      ) : (
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
            }}
            className="btn-3d-emerald mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
