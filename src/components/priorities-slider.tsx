"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export interface PrioritySlideItem {
  id: string;
  title: string;
  fullTitle?: string;
  description: string;
  directiveMessage?: string;
  officialRef?: string;
  assignedDept?: string;
  reformTasks?: string[];
  iconImage: string;
  bgImage: string;
  status: string;
}

interface PrioritiesSliderProps {
  items: PrioritySlideItem[];
}

export function PrioritiesSlider({ items }: PrioritiesSliderProps) {
  const [hoveredCardKey, setHoveredCardKey] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const singleSetWidthRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Duplicate items array for seamless, mathematically infinite scrolling
  const displayItems = [...items, ...items];

  // Measure track width to find single set boundary
  const measureTrack = useCallback(() => {
    if (!trackRef.current) return;
    // Since displayItems has 2 identical sets of items, singleSetWidth is exactly half
    singleSetWidthRef.current = trackRef.current.scrollWidth / 2;
  }, []);

  // Continuous Auto-Scrolling / Infinite Slider Loop
  useEffect(() => {
    measureTrack();

    const handleResize = () => {
      measureTrack();
    };
    window.addEventListener("resize", handleResize);

    const scrollSpeed = 0.95; // Smooth cinematic ~57px/sec glide

    const step = () => {
      if (!isPausedRef.current && singleSetWidthRef.current > 0 && trackRef.current) {
        offsetRef.current += scrollSpeed;
        if (offsetRef.current >= singleSetWidthRef.current) {
          offsetRef.current -= singleSetWidthRef.current;
        }
        trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }
      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [measureTrack]);

  // Card Hover & Touch Event Handlers
  const handleCardMouseEnter = (cardKey: string) => {
    isPausedRef.current = true;
    setHoveredCardKey(cardKey);
  };

  const handleCardMouseLeave = () => {
    setHoveredCardKey(null);
    isPausedRef.current = false;
  };

  const handleCardClick = (cardKey: string) => {
    if (hoveredCardKey === cardKey) {
      setHoveredCardKey(null);
      isPausedRef.current = false;
    } else {
      setHoveredCardKey(cardKey);
      isPausedRef.current = true;
    }
  };

  return (
    <div className="relative select-none w-full">
      {/* Auto-scrolling / Infinite Slider Stage with edge gradient vignettes */}
      <div className="relative overflow-hidden py-6 -my-6">
        {/* Left Edge Fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-20"
          aria-hidden="true"
        />

        {/* Right Edge Fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-20"
          aria-hidden="true"
        />

        {/* Horizontal Infinite Slider Track */}
        <div
          ref={trackRef}
          className="flex gap-6 will-change-transform"
          style={{ width: "max-content" }}
        >
          {displayItems.map((item, idx) => {
            const originalIndex = idx % items.length;
            const cardKey = `${item.id}-${idx}`;
            const isFlipped = hoveredCardKey === cardKey;

            return (
              <div
                key={cardKey}
                onMouseEnter={() => handleCardMouseEnter(cardKey)}
                onMouseLeave={handleCardMouseLeave}
                onClick={() => handleCardClick(cardKey)}
                className="priority-flip-card w-[250px] min-[400px]:w-[285px] sm:w-[315px] md:w-[340px] h-[400px] min-[400px]:h-[440px] shrink-0 cursor-pointer"
              >
                {/* 3D Flipper Inner Container */}
                <div
                  className="relative w-full h-full rounded-2xl shadow-xl"
                  style={{
                    transformStyle: "preserve-3d",
                    WebkitTransformStyle: "preserve-3d",
                    transition: "transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* === FRONT FACE: Photo + Balochi Emblem + Title === */}
                  <div
                    className="absolute inset-0 rounded-2xl border border-white/20 shadow-md bg-pine-950 overflow-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(0deg)",
                      zIndex: isFlipped ? 1 : 2,
                      opacity: isFlipped ? 0 : 1,
                      visibility: isFlipped ? "hidden" : "visible",
                      transition: "opacity 0.25s ease, visibility 0.25s ease",
                    }}
                  >
                    {/* Background Photo */}
                    <Image
                      src={item.bgImage}
                      alt={item.title}
                      fill
                      sizes="340px"
                      className="object-cover"
                      priority={idx < 4}
                    />

                    {/* Gradient Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20 pointer-events-none" />

                    {/* Front Face Content Layout */}
                    <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
                      {/* Top Header */}
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[10px] font-bold tracking-widest text-gold-300 uppercase backdrop-blur-md shadow-xs">
                          Priority #{String(originalIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="rounded-full bg-emerald-500/25 border border-emerald-400/35 px-2.5 py-1 text-[10px] font-bold text-emerald-300 backdrop-blur-md">
                          {item.status}
                        </span>
                      </div>

                      {/* Bottom Header: Balochi Circular Emblem + Title */}
                      <div>
                        {/* Circular Balochi Heritage Badge from Image 1 */}
                        <div className="relative h-16 w-16 mb-3 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                          <Image
                            src={item.iconImage}
                            alt={item.title}
                            fill
                            sizes="64px"
                            className="object-contain"
                          />
                        </div>

                        <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug text-white drop-shadow-md">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* === BACK FACE: White Card + Balochi Circular Emblem + Directive Message === */}
                  <div
                    className="absolute inset-0 rounded-2xl bg-white p-5 sm:p-6 border-2 border-emerald-600/40 shadow-2xl flex flex-col justify-between text-left overflow-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      zIndex: isFlipped ? 10 : 1,
                      opacity: isFlipped ? 1 : 0,
                      visibility: isFlipped ? "visible" : "hidden",
                      transition: "opacity 0.25s ease, visibility 0.25s ease",
                    }}
                  >
                    <div>
                      {/* Top Header: Circular Emblem + Direct Mandate Tag */}
                      <div className="flex items-center justify-between">
                        <div className="relative h-11 w-11 drop-shadow-xs">
                          <Image
                            src={item.iconImage}
                            alt={item.title}
                            fill
                            sizes="44px"
                            className="object-contain"
                          />
                        </div>
                        <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300">
                          <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                          CM Directive
                        </span>
                      </div>

                      {/* Title in Deep Emerald */}
                      <h4 className="font-display mt-2.5 text-base sm:text-lg font-bold text-emerald-950 leading-tight">
                        {item.fullTitle || item.title}
                      </h4>

                      {/* Official Reference & Department from PDF */}
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-emerald-800">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">
                          {item.officialRef || "D.O. PS-CM/1-3/189"}
                        </span>
                        <span className="text-pine-600/60">•</span>
                        <span className="text-pine-700 font-medium">{item.assignedDept || "Priority Sector"}</span>
                      </div>

                      {/* Detailed Directive Description from PDF */}
                      <p className="mt-2 text-[11px] sm:text-[11.5px] leading-relaxed text-pine-950 font-normal line-clamp-3">
                        {item.directiveMessage || item.description}
                      </p>

                      {/* Specific Action Tasks from PDF */}
                      {item.reformTasks && item.reformTasks.length > 0 && (
                        <div className="mt-2 space-y-1 border-t border-emerald-900/10 pt-2">
                          <p className="text-[9px] font-bold text-emerald-950 uppercase tracking-wider">Urgent Reform Directives:</p>
                          {item.reformTasks.slice(0, 2).map((task, tIdx) => (
                            <div key={tIdx} className="flex items-start gap-1.5 text-[10px] sm:text-[10.5px] leading-tight text-pine-900/85">
                              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                              <span className="line-clamp-2">{task}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="pt-2 border-t border-pine-900/10">
                      <Link
                        href="/priorities"
                        className="w-full btn-3d-emerald rounded-xl py-2 px-3 text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95"
                      >
                        Explore Priority Agenda
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
