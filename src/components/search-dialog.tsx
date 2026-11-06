"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { searchIndex } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

const filterCategories = [
  { id: "ALL", labelEn: "All Results", labelUr: "تمام نتائج" },
  { id: "Page", labelEn: "Pages", labelUr: "صفحات" },
  { id: "Priority", labelEn: "Priorities", labelUr: "حکومتی ترجیحات" },
  { id: "News", labelEn: "News & Media", labelUr: "خبریں و میڈیا" },
];

export function SearchDialog({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { locale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = searchIndex;

    if (activeFilter !== "ALL") {
      items = items.filter((item) => item.type === activeFilter);
    }

    if (!q) {
      return items.slice(0, 8);
    }

    return items
      .filter((item) => `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, activeFilter]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    const triggerEl = triggerRef.current;
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
      triggerEl?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the website"
        className={cn(
          "inline-flex items-center justify-center rounded-xl icon-box-3d text-pine-800 transition-colors focus-visible:ring-2 focus-visible:ring-pine-700 header-tactile-btn",
          compact ? "h-10 w-10" : "h-10 gap-2 px-4",
          className,
        )}
      >
        <Search className="h-[18px] w-[18px]" aria-hidden="true" />
        {!compact && <span className="text-xs font-semibold tracking-wide">{t("search")}</span>}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site search"
          className="fixed inset-0 z-[200] flex items-start justify-center bg-pine-950/70 p-3 sm:p-4 pt-[6vh] sm:pt-[10vh] backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden modal-3d max-h-[85vh] flex flex-col">
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-pine-900/10 px-5 py-4">
              <div className="p-1.5 icon-box-3d text-pine-600 shrink-0">
                <Search className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder={locale === "ur" ? "ترجیحات، خبریں، خدمات تلاش کریں…" : "Search priorities, news, services…"}
                className="w-full bg-transparent text-base text-pine-950 outline-none placeholder:text-pine-900/40"
                aria-label="Search query"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-full p-1 text-pine-800/40 hover:text-pine-900"
                  aria-label="Clear query"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="rounded-xl icon-box-3d p-2 text-pine-800/70 transition-colors hover:text-pine-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 border-b border-pine-900/8 bg-mist/50 px-5 py-3">
              {filterCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveFilter(cat.id)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all cursor-pointer",
                    activeFilter === cat.id
                      ? "btn-3d-emerald"
                      : "btn-3d-glass !text-pine-800",
                  )}
                >
                  {locale === "ur" ? cat.labelUr : cat.labelEn}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-pine-900/60">
                  {locale === "ur"
                    ? `“${query}” کے لیے کوئی نتیجہ نہیں ملا۔`
                    : `No results for “${query}”. Try “health”, “education”, or “news”.`}
                </p>
              ) : (
                <ul className="divide-y divide-pine-900/5">
                  {results.map((item) => (
                    <li key={item.href}>
                      {item.href.startsWith("http") ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setOpen(false)}
                          className="group flex items-start justify-between gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-pine-50"
                        >
                          <div>
                            <span className="block text-sm font-semibold text-pine-950 group-hover:text-pine-700 transition-colors">
                              {item.title}
                            </span>
                            <span className="mt-0.5 block text-xs leading-relaxed text-pine-900/55">
                              {item.description}
                            </span>
                          </div>
                          <span className="mt-1 flex shrink-0 items-center gap-2">
                            <span className="rounded-md bg-gold-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pine-900">
                              {item.type}
                            </span>
                            <ArrowUpRight
                              className="h-4 w-4 text-pine-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </span>
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="group flex items-start justify-between gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-pine-50"
                        >
                          <div>
                            <span className="block text-sm font-semibold text-pine-950 group-hover:text-pine-700 transition-colors">
                              {item.title}
                            </span>
                            <span className="mt-0.5 block text-xs leading-relaxed text-pine-900/55">
                              {item.description}
                            </span>
                          </div>
                          <span className="mt-1 flex shrink-0 items-center gap-2">
                            <span className="rounded-md bg-pine-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pine-800">
                              {item.type}
                            </span>
                            <ArrowUpRight
                              className="h-4 w-4 text-pine-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-pine-900/10 bg-pine-50/70 px-5 py-3 text-[11px] text-pine-900/50">
              <span>{query ? `${results.length} result${results.length === 1 ? "" : "s"}` : (locale === "ur" ? "اہم صفحات" : "Popular government sections")}</span>
              <span>
                Press <kbd className="rounded border border-pine-900/15 bg-white px-1.5 py-0.5 font-sans text-[10px]">Esc</kbd> to close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
