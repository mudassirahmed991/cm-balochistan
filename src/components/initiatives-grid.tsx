"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export type InitiativeItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  impact: string;
  status: string;
  bgImage?: string;
  progress?: number;
};

const CATEGORIES = [
  "All Initiatives",
  "Public Transportation",
  "Public Health",
  "Education & Youth",
  "Digital Governance",
  "Civic Infrastructure",
];

export function InitiativesGrid({ items }: { items: InitiativeItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All Initiatives");

  const filteredItems = selectedCategory === "All Initiatives"
    ? items
    : items.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 ring-2 ring-emerald-400/50 scale-105"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Initiatives Cards Grid */}
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((init) => {
          // Parse numerical percentage from impact text if available (e.g., "95% Target Progress")
          const percentMatch = init.impact.match(/(\d+)%/);
          const percent = percentMatch ? parseInt(percentMatch[1], 10) : 75;

          return (
            <div
              key={init.id}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-pine-950 p-7 shadow-2xl transition-all duration-500 hover:border-emerald-500/60 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,0.85)]"
            >
              {/* Background Image with Rich Deep Dark Gradient for Perfect White Legibility */}
              {init.bgImage && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <Image
                    src={init.bgImage}
                    alt={init.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-50 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-35"
                  />
                  {/* Dark gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/85 to-pine-950/60 transition-all duration-500 group-hover:from-pine-950 group-hover:via-pine-950/90 group-hover:to-pine-950/75 pointer-events-none" />
                </div>
              )}

              {/* Card Foreground */}
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  {/* Category & Status Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20 backdrop-blur-md shadow-sm">
                      {init.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                      {init.status}
                    </span>
                  </div>

                  {/* Clean White Title (No Black Outline / Stroke) */}
                  <h3 className="font-display mt-5 text-2xl font-bold leading-snug text-white transition-colors duration-300 group-hover:text-gold-300">
                    {init.title}
                  </h3>

                  {/* Clean White Description */}
                  <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-white/85 font-normal">
                    {init.description}
                  </p>
                </div>

                {/* Progress Bar & Impact Footer */}
                <div className="mt-7 border-t border-white/15 pt-4">
                  {/* Progress Indicator */}
                  <div className="mb-2.5 flex items-center justify-between text-[11px] font-medium text-white/80">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Target Milestone
                    </span>
                    <span className="font-bold text-white">{percent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="mt-3.5 flex items-center justify-between text-xs">
                    <span className="text-white/90 font-semibold tracking-tight">{init.impact}</span>
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold group-hover:text-gold-300 transition-colors">
                      <span className="text-[11px]">View Details</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
