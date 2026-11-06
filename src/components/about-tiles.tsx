import Link from "next/link";
import { ArrowUpRight, BarChart3, BookOpen, Compass, Mountain, TrendingUp, Users } from "lucide-react";
import { aboutTiles } from "@/lib/site";

const icons = {
  chart: BarChart3,
  book: BookOpen,
  mountain: Mountain,
  trending: TrendingUp,
  users: Users,
  compass: Compass,
};

export function AboutTiles() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {aboutTiles.map((tile) => {
        const Icon = icons[tile.icon];
        return (
          <Link
            key={tile.id}
            href={`/about-balochistan#${tile.id}`}
            className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl glass-card-3d px-4 py-4 transition-all duration-300 hover:-translate-y-1 shadow-3d-card border border-white/95"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl icon-box-3d text-pine-700 transition-colors duration-300 group-hover:bg-pine-900 group-hover:text-gold-300">
              <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.6} />
            </span>
            <span className="text-[13px] font-bold text-pine-950">{tile.title}</span>
            <ArrowUpRight className="ml-auto h-4 w-4 text-pine-900/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pine-700" aria-hidden="true" />
            <span className="absolute inset-x-4 bottom-0 h-0.5 origin-left scale-x-0 bg-gold-400 transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />
          </Link>
        );
      })}
    </div>
  );
}
