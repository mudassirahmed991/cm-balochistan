import Link from "next/link";
import {
  ArrowRight,
  Compass,
  History,
  Image as ImageIcon,
  Newspaper,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Secretariat Dashboard | Government of Balochistan",
  description: "Administrative control center for Chief Minister's official portal.",
};

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const newsList = db.news.findAllForAdmin();
  const cabinetList = db.cabinet.findMany();
  const prioritiesList = db.priorities.findMany();
  const galleryItems = db.gallery.findAll();
  const recentAudit = db.audit.findMany({ limit: 6 });

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full">
      {/* Welcome Banner (3D Glass Panel with Responsive Flex) */}
      <div className="rounded-3xl glass-card-3d p-4 sm:p-6 lg:p-8 shadow-3d-card border border-white/95 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-pine-100/90 px-3 py-1 text-[10px] font-bold text-pine-900 uppercase tracking-widest mb-2 border border-pine-200/50 shadow-sm">
            <Sparkles className="h-3 w-3 text-gold-600 shrink-0" />
            Executive Administration
          </div>
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-pine-950 truncate">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-pine-900/65">
            Operational dashboard for the Office of the Chief Minister of Balochistan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/enter/news"
            className="btn-3d-emerald rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-xs font-bold gap-2 justify-center"
          >
            <Plus className="h-4 w-4 shrink-0" />
            Publish News & Video
          </Link>
          <Link
            href="/enter/priorities"
            className="btn-3d-glass rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-xs font-bold gap-2 justify-center"
          >
            Manage Priorities
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards Responsive Grid: grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        {/* Priorities & Directives */}
        <div className="rounded-3xl glass-card-3d glass-sheen p-5 sm:p-6 shadow-3d-card transition-all duration-300 hover:-translate-y-1.5 hover:border-pine-600/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-pine-900/50 uppercase">
              Directives & Priorities
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl icon-box-3d text-pine-900 shrink-0">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display mt-3 text-2xl sm:text-3xl font-extrabold text-pine-950">
            {prioritiesList.length}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-semibold text-[11px] sm:text-xs">Active Reform Agenda</span>
            <Link href="/enter/priorities" className="text-pine-700 font-bold hover:underline">
              Edit &rarr;
            </Link>
          </div>
        </div>

        {/* News & Media Updates */}
        <div className="rounded-3xl glass-card-3d glass-sheen p-5 sm:p-6 shadow-3d-card transition-all duration-300 hover:-translate-y-1.5 hover:border-pine-600/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-pine-900/50 uppercase">
              News & Releases
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl icon-box-3d text-pine-950 shrink-0">
              <Newspaper className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display mt-3 text-2xl sm:text-3xl font-extrabold text-pine-950">
            {newsList.length}
          </p>
          <p className="mt-2 text-[11px] sm:text-xs text-pine-900/60 truncate">
            {newsList.filter((n) => n.isPublished).length} Published · {newsList.filter((n) => !n.isPublished).length} Drafts
          </p>
        </div>

        {/* Media & Video Assets */}
        <div className="rounded-3xl glass-card-3d glass-sheen p-5 sm:p-6 shadow-3d-card transition-all duration-300 hover:-translate-y-1.5 hover:border-pine-600/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-pine-900/50 uppercase">
              Photo & Video Assets
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl icon-box-3d text-amber-900 shrink-0">
              <ImageIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display mt-3 text-2xl sm:text-3xl font-extrabold text-pine-950">
            {galleryItems.length}
          </p>
          <p className="mt-2 text-[11px] sm:text-xs text-pine-900/60">
            High-Definition Media Gallery
          </p>
        </div>

        {/* Cabinet Directory */}
        <div className="rounded-3xl glass-card-3d glass-sheen p-5 sm:p-6 shadow-3d-card transition-all duration-300 hover:-translate-y-1.5 hover:border-pine-600/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-pine-900/50 uppercase">
              Cabinet Members
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl icon-box-3d text-purple-900 shrink-0">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display mt-3 text-2xl sm:text-3xl font-extrabold text-pine-950">
            {cabinetList.length}
          </p>
          <p className="mt-2 text-[11px] sm:text-xs text-pine-900/60">
            Elected Constitutional Ministers
          </p>
        </div>
      </div>

      {/* Main Two-Column Section (3D Glass Panels with Responsive Flow) */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 w-full overflow-hidden">
        {/* Recent News & Press Releases */}
        <div className="rounded-3xl glass-card-3d p-5 sm:p-7 shadow-3d-card border border-white/95 flex flex-col justify-between w-full overflow-hidden">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-pine-900/8">
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-pine-950">
                  Recent News & Media Releases
                </h2>
                <p className="text-xs text-pine-900/60">Official press statements and photo/video releases</p>
              </div>
              <Link
                href="/enter/news"
                className="btn-3d-glass rounded-xl px-3 py-1.5 text-xs font-bold gap-1 self-start sm:self-auto shrink-0"
              >
                Manage All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {newsList.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className="rounded-2xl glass-panel-3d p-3.5 sm:p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-pine-600/30"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-pine-950 line-clamp-1">
                      {n.titleEn}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0 border ${
                        n.isPublished === 1
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-gray-100 text-gray-800 border-gray-300"
                      }`}
                    >
                      {n.isPublished === 1 ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-pine-900/70 line-clamp-1">
                    {n.excerptEn}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-pine-900/50">
                    <span className="truncate">{n.category}</span>
                    <span className="shrink-0">{new Date(n.publishedDate).toLocaleDateString("en-GB")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-pine-900/8">
            <Link
              href="/enter/news"
              className="w-full btn-3d-emerald rounded-xl py-3 text-xs font-bold gap-2 justify-center"
            >
              <Plus className="h-4 w-4" />
              Publish New Article, Photo or Video
            </Link>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="rounded-3xl glass-card-3d p-5 sm:p-7 shadow-3d-card border border-white/95 flex flex-col justify-between w-full overflow-hidden">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-pine-900/8">
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-pine-950">
                  Administrative Audit Stream
                </h2>
                <p className="text-xs text-pine-900/60">Immutable log of system modifications</p>
              </div>
              <Link
                href="/enter/audit-logs"
                className="btn-3d-glass rounded-xl px-3 py-1.5 text-xs font-bold gap-1 self-start sm:self-auto shrink-0"
              >
                Full Log <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentAudit.length > 0 ? (
                recentAudit.map((log) => (
                  <div key={log.id} className="flex gap-3 text-xs glass-panel-3d p-3 rounded-xl border border-white/80 transition-all hover:-translate-y-0.5">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-pine-600 mt-1 shadow-sm shrink-0" />
                    </div>
                    <div className="flex-1 overflow-hidden min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-pine-950 truncate">
                          {log.action} · {log.entity}
                        </span>
                        <span className="text-[10px] text-pine-900/50 font-mono shrink-0">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="mt-0.5 text-pine-900/75 text-[11px] truncate">{log.details}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-pine-900/50 py-6 text-center">No audit logs recorded yet.</p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-pine-900/8">
            <Link
              href="/enter/audit-logs"
              className="w-full btn-3d-glass rounded-xl py-3 text-xs font-bold gap-2 justify-center"
            >
              <History className="h-4 w-4" />
              View Complete Administrative Audit History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
