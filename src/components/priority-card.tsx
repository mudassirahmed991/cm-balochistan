import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Check, Globe2, HeartPulse, Landmark, Leaf, Palette, ShieldCheck, Users, Wheat, type LucideIcon } from "lucide-react";
import type { Priority, PriorityIcon } from "@/lib/site";
import { PriorityArt } from "./patterns";

export const priorityIcons: Record<PriorityIcon, LucideIcon> = {
  globe: Globe2,
  landmark: Landmark,
  leaf: Leaf,
  palette: Palette,
  women: Users,
  wheat: Wheat,
  shield: ShieldCheck,
  book: BookOpen,
  heart: HeartPulse,
};

export function PriorityCard({ priority, index, className }: { priority: Priority; index: number; className?: string }) {
  const Icon = priorityIcons[priority.icon];
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className={`flip-card h-[380px] sm:h-[400px] ${className ?? ""}`}>
      <div className="flip-card-inner drop-shadow-xl">
        {/* Front */}
        <div className="flip-face flip-front shadow-3d-card border border-white/20">
          <PriorityArt index={index} className="flex h-full flex-col justify-between p-5">
            <div className="flex items-start justify-between">
              <span className="rounded-full border border-white/30 bg-black/35 px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-white uppercase backdrop-blur-md shadow-sm">
                Priority {number}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl icon-box-3d bg-white/20 text-white backdrop-blur-md shadow-sm">
                <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.8} />
              </span>
            </div>

            <div>
              <h3 className="font-display text-[1.55rem] leading-tight text-white text-balance drop-shadow-md">{priority.title}</h3>
              <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/75">{priority.short}</p>
              <Link
                href={`/priorities/${priority.slug}`}
                className="mt-4 btn-3d-gold rounded-full px-4 py-2 text-[11px] font-bold gap-2"
              >
                Explore priority
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </PriorityArt>
        </div>

        {/* Back */}
        <div className="flip-face flip-back glass-dark-3d p-6 border border-gold-400/30 shadow-3d-card">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-gold-300 shadow-inner">
                <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.8} />
              </span>
              <span className="font-display text-sm font-bold text-gold-300/60">{number}</span>
            </div>

            <h3 className="font-display mt-4 text-xl leading-tight text-white text-balance">{priority.title}</h3>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-white/70">{priority.short}</p>

            <ul className="mt-4 space-y-2">
              {priority.initiatives.slice(0, 2).map((initiative) => (
                <li key={initiative} className="flex gap-2 text-[11.5px] leading-snug text-white/65">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400" aria-hidden="true" />
                  <span>{initiative}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/priorities/${priority.slug}`}
              className="mt-auto inline-flex items-center gap-2 text-[12px] font-bold text-gold-300 transition-colors hover:text-gold-200"
            >
              Read the full agenda
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
