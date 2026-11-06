"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Priority } from "@/lib/site";
import { PriorityCard } from "./priority-card";
import { cn } from "@/lib/utils";

export function PriorityCarousel({ priorities }: { priorities: Priority[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const scrollByCards = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.min(track.clientWidth * 0.8, 420);
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setProgress(max > 0 ? Math.min(1, track.scrollLeft / max) : 1);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          aria-label="Previous priorities"
          className="flex h-10 w-10 items-center justify-center rounded-xl icon-box-3d text-pine-900 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          aria-label="Next priorities"
          className="flex h-10 w-10 items-center justify-center rounded-xl icon-box-3d text-pine-900 transition-all cursor-pointer"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 sm:-mx-1 sm:px-1"
      >
        {priorities.map((priority, index) => (
          <div
            key={priority.slug}
            className="w-[82vw] max-w-[330px] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%] xl:w-[23.5%]"
          >
            <PriorityCard priority={priority} index={index} />
          </div>
        ))}
      </div>

      <div className="mt-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-pine-900/10">
          <div
            className="h-px bg-pine-700 transition-all duration-200"
            style={{ width: `${Math.max(progress * 100, 12)}%` }}
          />
        </div>
        <span className={cn("text-[11px] font-semibold tracking-[0.16em] text-pine-900/40 uppercase")}>Drag to explore</span>
      </div>
    </div>
  );
}
