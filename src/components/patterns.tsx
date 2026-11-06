import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Soft topographic contour lines used across dark panels. */
export function ContourPattern({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <g stroke="currentColor" strokeWidth="1">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <path
            key={i}
            d={`M-80 ${420 + i * 44} C 160 ${300 + i * 40}, 330 ${560 + i * 34}, 590 ${440 + i * 40} S 980 ${250 + i * 46}, 1520 ${380 + i * 40}`}
            opacity={0.7 - i * 0.07}
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={`b-${i}`}
            d={`M-60 ${120 + i * 52} C 260 ${40 + i * 54}, 420 ${260 + i * 46}, 720 ${150 + i * 52} S 1100 ${10 + i * 60}, 1500 ${120 + i * 48}`}
            opacity={0.32 - i * 0.04}
          />
        ))}
      </g>
    </svg>
  );
}

/** Provincial emblem mark, drawn as a crisp vector seal. */
export function Emblem({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const ring = tone === "light" ? "#2E7D32" : "#1b4f20";
  const inner = tone === "light" ? "#1F2937" : "#FFFFFF";
  const field = tone === "light" ? "#FFFFFF" : "#143d18";
  const gold = tone === "light" ? "#2E7D32" : "#d4af37";
  return (
    <svg viewBox="0 0 64 64" className={cn("h-11 w-11", className)} aria-hidden="true">
      <circle cx="32" cy="32" r="30.5" fill={field} stroke={ring} strokeWidth="1" />
      <circle cx="32" cy="32" r="26" fill="none" stroke={inner} strokeOpacity="0.35" strokeWidth="0.75" />
      <path
        d="M13 42.5 24 27l6.4 8.6L35.4 30l8.2 12.5c1 1.5 0 3-1.9 3H15c-1.9 0-2.9-1.5-1.9-3Z"
        fill={inner}
        opacity="0.92"
      />
      <path d="M20 45.5h27" stroke={gold} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <path
        d="m32 12.2 1.6 4 4.3.4-3.2 2.9.9 4.2-3.6-2.3-3.6 2.3.9-4.2-3.2-2.9 4.3-.4Z"
        fill={gold}
      />
      <circle cx="32" cy="32" r="3.4" fill="none" stroke={gold} strokeOpacity="0.5" strokeWidth="0.7" />
    </svg>
  );
}

/** Editorial portrait placeholder built from shapes, not a photograph. */
export function PortraitArt({ className }: { className?: string }) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-pine-900", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_10%,#146C43_0%,#0B3D2E_45%,#06231a_100%)]" />
      <ContourPattern className="text-white/25" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-pine-950 via-pine-950/40 to-transparent" />

      {/* framing lines */}
      <div className="pointer-events-none absolute inset-5 rounded-t-[999px] border border-gold-400/30" />
      <div className="pointer-events-none absolute inset-x-10 top-1/2 bottom-0 border-x border-white/10" />

      {/* abstract bust */}
      <svg
        viewBox="0 0 400 520"
        className="absolute inset-x-0 bottom-0 h-[86%] w-full"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bust" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fc4a2" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#06231a" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <ellipse cx="200" cy="185" rx="66" ry="76" fill="url(#bust)" />
        <path
          d="M200 268c-70 0-124 44-138 118-5 26 12 46 40 46h196c28 0 45-20 40-46-14-74-68-118-138-118Z"
          fill="url(#bust)"
        />
        <path d="M200 272v208" stroke="#146C43" strokeOpacity="0.22" strokeWidth="1" />
      </svg>

      <div className="absolute inset-x-0 top-7 flex justify-center">
        <span className="rounded-full border border-white/15 bg-black/15 px-3 py-1 text-[10px] font-semibold tracking-[0.24em] text-white/70 uppercase backdrop-blur">
          Quetta · Balochistan
        </span>
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[10px] font-semibold tracking-[0.22em] text-white/55 uppercase">
        <span>Official portrait</span>
        <span className="text-gold-300">01</span>
      </div>
    </div>
  );
}

const tones = [
  { from: "#146C43", to: "#06231a", sun: "#8fc4a2" },
  { from: "#2E7D32", to: "#0B3D2E", sun: "#dfede4" },
  { from: "#0e492d", to: "#1F2937", sun: "#d4af37" },
  { from: "#0B3D2E", to: "#06231a", sun: "#bedec9" },
  { from: "#105936", to: "#1F2937", sun: "#2E7D32" },
  { from: "#146C43", to: "#0B3D2E", sun: "#d4af37" },
  { from: "#0B3D2E", to: "#06231a", sun: "#8fc4a2" },
  { from: "#146C43", to: "#082e20", sun: "#bedec9" },
  { from: "#0B3D2E", to: "#1F2937", sun: "#d4af37" },
];

/** Generated landscape art used for cards until photographs are supplied. */
export function PriorityArt({
  index,
  children,
  className,
  variant = "mountains",
}: {
  index: number;
  children?: ReactNode;
  className?: string;
  variant?: "mountains" | "rings" | "waves";
}) {
  const tone = tones[index % tones.length];
  const id = `pa-${index}-${variant}`;
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(155deg, ${tone.from} 0%, ${tone.to} 85%)` }}
      />
      <svg viewBox="0 0 600 440" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-sun`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tone.sun} stopOpacity="0.55" />
            <stop offset="100%" stopColor={tone.sun} stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <circle cx="440" cy="120" r="74" fill={`url(#${id}-sun)`} />
        <circle cx="440" cy="120" r="74" fill="none" stroke={tone.sun} strokeOpacity="0.25" />
        {variant === "mountains" && (
          <>
            <path d="M0 340 130 205l70 78 64-56 96 113Z" fill={tone.to} opacity="0.72" />
            <path d="M180 440 330 236l64 84 52-40 154 160Z" fill="#04140d" opacity="0.42" />
            <path d="M0 440V372l110-40 96 52 88-24 82 58 88-30 136 42v10Z" fill="#04140d" opacity="0.55" />
            <path d="M-20 440c120-60 230-66 340-30s210 20 300-8" stroke={tone.sun} strokeOpacity="0.18" fill="none" />
          </>
        )}
        {variant === "rings" && (
          <g stroke={tone.sun} strokeOpacity="0.22" fill="none">
            {[0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx="300" cy="250" r={80 + i * 46} />
            ))}
            <path d="M-40 430c180-90 420-96 680-10" strokeWidth="1.4" />
          </g>
        )}
        {variant === "waves" && (
          <g stroke={tone.sun} strokeOpacity="0.22" fill="none">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path key={i} d={`M-50 ${230 + i * 34} C 150 ${150 + i * 34}, 320 ${320 + i * 30}, 470 ${250 + i * 32} S 700 ${190 + i * 30}, 780 ${260 + i * 30}`} />
            ))}
          </g>
        )}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-pine-950/70 via-transparent to-transparent" />
      {children}
    </div>
  );
}

/** Article cover art placeholder, composed from geometric forms. */
export function NewsArt({ index, className, children }: { index: number; className?: string; children?: ReactNode }) {
  const tone = tones[(index + 2) % tones.length];
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${tone.from} 0%, ${tone.to} 90%)` }} />
      <svg viewBox="0 0 600 380" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g stroke={tone.sun} strokeOpacity="0.18" fill="none">
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={480 - i * 18} cy={70 + i * 10} r={70 + i * 52} />
          ))}
          <path d="M-20 330C120 250 260 350 420 275S660 220 700 250" strokeWidth="1.5" />
        </g>
        <circle cx="150" cy="105" r="46" fill={tone.sun} opacity="0.12" />
      </svg>
      {children}
    </div>
  );
}
