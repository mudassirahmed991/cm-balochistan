import Link from "next/link";
import { ArrowUpRight, Mountain, MessageSquare, Newspaper, Share2, Target, Users } from "lucide-react";
import { quickAccess } from "@/lib/site";
import { Container } from "./ui";

const icons = {
  users: Users,
  news: Newspaper,
  target: Target,
  message: MessageSquare,
  share: Share2,
  mountain: Mountain,
};

const borders = [
  "",
  "border-t border-pine-900/8 sm:border-t-0 sm:border-l",
  "border-t border-pine-900/8 lg:border-t-0 lg:border-l",
  "border-t border-pine-900/8 sm:border-l lg:border-t-0",
  "border-t border-pine-900/8 lg:border-t-0 lg:border-l",
  "border-t border-pine-900/8 sm:border-t-0 sm:border-l lg:border-t-0",
];

export function QuickAccess() {
  return (
    <section className="relative z-20 -mt-10 sm:-mt-12" aria-label="Quick access">
      <Container>
        <div className="grid overflow-hidden rounded-3xl glass-panel-3d border border-white/95 shadow-3d-card sm:grid-cols-2 lg:grid-cols-6">
          {quickAccess.map((item, index) => {
            const Icon = icons[item.icon];
            return (
              <Link
                key={item.title}
                href={item.href}
                className={
                  "group relative flex items-center gap-4 px-5 py-5 transition-all duration-300 hover:bg-white/80 hover:-translate-y-0.5 lg:flex-col lg:items-start lg:gap-3 lg:px-5 lg:py-6 " +
                  borders[index]
                }
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl icon-box-3d text-pine-700 transition-all duration-300 group-hover:bg-pine-900 group-hover:text-gold-300">
                  <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.6} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold leading-snug text-pine-950">{item.title}</span>
                  <span className="mt-0.5 block truncate text-[11px] text-pine-900/50">{item.caption}</span>
                </span>
                <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-pine-900/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pine-700 lg:absolute lg:top-5 lg:right-5" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
