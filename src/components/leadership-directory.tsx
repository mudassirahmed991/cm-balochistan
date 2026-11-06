"use client";

import { useState, useMemo } from "react";
import { 
  Building2, 
  Briefcase, 
  Calendar, 
  ExternalLink, 
  Landmark, 
  Search, 
  Sparkles, 
  Star, 
  Users, 
  X 
} from "lucide-react";
import { Reveal } from "./reveal";

export interface ChiefMinisterItem {
  id?: string;
  name: string;
  party: string;
  from: string;
  to: string;
  note?: string;
}

export interface CabinetMemberItem {
  id?: string;
  name: string;
  designation: string;
  portfolio: string;
  ministry: string;
  departmentUrl?: string;
  isLeader?: boolean;
}

interface LeadershipDirectoryProps {
  chiefMinisters: ChiefMinisterItem[];
  cabinetMembers: CabinetMemberItem[];
  initialTab?: "all" | "cms" | "cabinet";
}

export function LeadershipDirectory({
  chiefMinisters,
  cabinetMembers,
  initialTab = "all",
}: LeadershipDirectoryProps) {
  const [activeTab, setActiveTab] = useState<"all" | "cms" | "cabinet">(initialTab);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCms = useMemo(() => {
    if (!searchQuery.trim()) return chiefMinisters;
    const q = searchQuery.toLowerCase().trim();
    return chiefMinisters.filter(
      (cm) =>
        cm.name.toLowerCase().includes(q) ||
        cm.party.toLowerCase().includes(q) ||
        cm.from.toLowerCase().includes(q) ||
        cm.to.toLowerCase().includes(q) ||
        (cm.note && cm.note.toLowerCase().includes(q))
    );
  }, [chiefMinisters, searchQuery]);

  const filteredCabinet = useMemo(() => {
    if (!searchQuery.trim()) return cabinetMembers;
    const q = searchQuery.toLowerCase().trim();
    return cabinetMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.portfolio.toLowerCase().includes(q) ||
        m.ministry.toLowerCase().includes(q) ||
        m.designation.toLowerCase().includes(q)
    );
  }, [cabinetMembers, searchQuery]);

  const totalResults =
    activeTab === "all"
      ? filteredCms.length + filteredCabinet.length
      : activeTab === "cms"
      ? filteredCms.length
      : filteredCabinet.length;

  return (
    <div className="space-y-8">
      {/* 1. Category Distinction Legend & Info Banner */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border-l-4 border-l-amber-500 flex items-start gap-3.5">
          <div className="h-10 w-10 shrink-0 rounded-xl icon-box-3d bg-amber-50 text-amber-700 flex items-center justify-center">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-pine-950">Former Chief Ministers</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-900 border border-amber-500/30">
                {chiefMinisters.length} Leaders
              </span>
            </div>
            <p className="text-xs text-pine-900/60 mt-1 leading-relaxed">
              Historical line of Chief Ministers who have held the highest elected executive office of Balochistan since 1972.
            </p>
          </div>
        </div>

        <div className="glass-card-3d rounded-2xl p-4 sm:p-5 border-l-4 border-l-emerald-600 flex items-start gap-3.5">
          <div className="h-10 w-10 shrink-0 rounded-xl icon-box-3d bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-pine-950">Provincial Cabinet Members</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700/15 text-emerald-950 border border-emerald-600/30">
                {cabinetMembers.length} Ministers
              </span>
            </div>
            <p className="text-xs text-pine-900/60 mt-1 leading-relaxed">
              Council of Ministers responsible for executing provincial departmental portfolios and public governance.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Controls Bar: Tabs & Live Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel-3d p-4 rounded-2xl">
        {/* Interactive Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-pine-900/5 rounded-xl border border-pine-900/8">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "all"
                ? "bg-pine-800 text-white shadow-sm"
                : "text-pine-900/70 hover:text-pine-950 hover:bg-white/60"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>All Leadership</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === "all" ? "bg-white/20 text-white" : "bg-pine-900/10 text-pine-900/70"
            }`}>
              {chiefMinisters.length + cabinetMembers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cms")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "cms"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-pine-900/70 hover:text-pine-950 hover:bg-white/60"
            }`}
          >
            <Landmark className="h-3.5 w-3.5" />
            <span>Chief Ministers</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === "cms" ? "bg-white/20 text-white" : "bg-pine-900/10 text-pine-900/70"
            }`}>
              {chiefMinisters.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cabinet")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "cabinet"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-pine-900/70 hover:text-pine-950 hover:bg-white/60"
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Cabinet Members</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === "cabinet" ? "bg-white/20 text-white" : "bg-pine-900/10 text-pine-900/70"
            }`}>
              {cabinetMembers.length}
            </span>
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pine-900/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leader, ministry, party..."
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs glass-input-3d text-pine-950 placeholder:text-pine-900/40 focus:outline-none focus:ring-2 focus:ring-pine-600/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-pine-900/40 hover:text-pine-950"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Section Results Counter */}
      <div className="flex items-center justify-between text-xs text-pine-900/60 px-1">
        <span>
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? "entry" : "entries"}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-pine-700 font-semibold hover:underline"
          >
            Clear search
          </button>
        )}
      </div>

      {/* 4. Display Cards Grid */}
      {totalResults === 0 ? (
        <div className="rounded-3xl glass-card-3d p-12 text-center">
          <Search className="h-8 w-8 text-pine-900/30 mx-auto mb-3" />
          <p className="font-bold text-pine-950">No leaders or cabinet members found</p>
          <p className="text-xs text-pine-900/50 mt-1">Try clearing your search query or switching categories.</p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-4 px-4 py-2 rounded-xl btn-3d-emerald text-xs text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* A. CABINET MEMBERS SECTION (Rendered if tab is 'all' or 'cabinet') */}
          {(activeTab === "all" || activeTab === "cabinet") && filteredCabinet.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-pine-900/10">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs shadow-sm">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-pine-950">Provincial Cabinet Members</h3>
                    <p className="text-[11px] text-pine-900/60">Executive Council of Ministers and Departmental Portfolios</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {filteredCabinet.length} Ministers
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCabinet.map((member, idx) => (
                  <Reveal key={`${member.name}-${idx}`} delay={(idx % 3) * 50}>
                    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 glass-card-3d transition-all duration-300 hover:-translate-y-1 hover:border-emerald-600/40 border border-white/95">
                      {/* Top Distinctive Tag: Cabinet Member */}
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700/15 text-emerald-900 border border-emerald-600/30">
                            <Briefcase className="h-3 w-3 text-emerald-700" />
                            Cabinet Member
                          </span>
                          <span className="text-[11px] font-semibold text-pine-900/50">
                            {member.designation}
                          </span>
                        </div>

                        {/* Minister Name */}
                        <h4 className="font-display mt-3.5 text-lg font-bold text-pine-950 group-hover:text-emerald-800 transition-colors">
                          {member.name}
                        </h4>

                        {/* Portfolio (Bold Focus) */}
                        <div className="mt-3 rounded-xl bg-emerald-50/70 p-3 border border-emerald-900/8">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-900/60">
                            Assigned Portfolio
                          </p>
                          <p className="text-xs font-bold text-pine-950 mt-0.5 leading-snug">
                            {member.portfolio}
                          </p>
                        </div>

                        {/* Ministry Department */}
                        <div className="mt-3 flex items-center gap-2 text-xs text-pine-900/65">
                          <Building2 className="h-3.5 w-3.5 shrink-0 text-pine-700" />
                          <span className="truncate">{member.ministry}</span>
                        </div>
                      </div>

                      {/* Bottom Action: Official Department Portal Link */}
                      <div className="mt-5 pt-3.5 border-t border-pine-900/8 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-medium text-pine-900/50">Official Department</span>
                        <a
                          href={member.departmentUrl || "https://balochistan.gov.pk"}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"
                        >
                          <span>Portal</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* B. FORMER CHIEF MINISTERS SECTION (Rendered if tab is 'all' or 'cms') */}
          {(activeTab === "all" || activeTab === "cms") && filteredCms.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-pine-900/10">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs shadow-sm">
                    <Landmark className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-pine-950">Former Chief Ministers</h3>
                    <p className="text-[11px] text-pine-900/60">Historical Roll of Provincial Chief Executives (1972 — Present)</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {filteredCms.length} Leaders
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCms.map((minister, idx) => {
                  const current = Boolean(minister.note);
                  return (
                    <Reveal key={`${minister.name}-${minister.from}`} delay={(idx % 3) * 50}>
                      <article
                        className={
                          "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all duration-300 " +
                          (current
                            ? "glass-dark-3d text-white shadow-lift border border-gold-400/50"
                            : "glass-card-3d text-pine-950 hover:-translate-y-1 hover:border-amber-500/40 border border-white/95")
                        }
                      >
                        <div>
                          {/* Top Distinctive Tag: Chief Minister */}
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                current
                                  ? "bg-gold-400/20 text-gold-300 border border-gold-400/40"
                                  : "bg-amber-500/15 text-amber-900 border border-amber-500/30"
                              }`}
                            >
                              <Landmark className={`h-3 w-3 ${current ? "text-gold-300" : "text-amber-700"}`} />
                              Chief Minister
                            </span>

                            <div className="flex items-center gap-2">
                              {current && (
                                <span className="flex items-center gap-1 rounded-full bg-gold-400/20 px-2 py-0.5 text-[9px] font-bold tracking-wider text-gold-300 uppercase border border-gold-400/40">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  Current
                                </span>
                              )}
                              <span
                                className={
                                  "font-display text-xs font-bold " +
                                  (current ? "text-gold-300" : "text-pine-900/40")
                                }
                              >
                                #{String(idx + 1).padStart(2, "0")}
                              </span>
                            </div>
                          </div>

                          {/* Leader Name */}
                          <h4
                            className={
                              "font-display mt-3.5 text-lg font-bold leading-snug " +
                              (current ? "text-white" : "text-pine-950 group-hover:text-amber-800")
                            }
                          >
                            {minister.name}
                          </h4>

                          {/* Political Party Badge */}
                          <div className="mt-2.5">
                            <span
                              className={
                                "inline-block rounded-lg px-2.5 py-1 text-[11px] font-medium " +
                                (current
                                  ? "bg-white/10 text-white/80 border border-white/10"
                                  : "bg-pine-900/5 text-pine-900/75 border border-pine-900/8")
                              }
                            >
                              {minister.party}
                            </span>
                          </div>
                        </div>

                        {/* Tenure Dates */}
                        <div
                          className={
                            "mt-5 pt-3.5 flex items-center justify-between border-t text-xs " +
                            (current ? "border-white/12 text-white/60" : "border-pine-900/8 text-pine-900/60")
                          }
                        >
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 opacity-60" />
                            <span>
                              {minister.from} — {minister.to}
                            </span>
                          </div>

                          {current && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-gold-300">
                              <Star className="h-3 w-3 fill-gold-300" />
                              Incumbent
                            </span>
                          )}
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
