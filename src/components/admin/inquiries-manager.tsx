"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  MailCheck,
  Search,
} from "lucide-react";
import { updateInquiryStatusAction } from "@/app/actions/admin";
import { cn } from "@/lib/utils";
import type { DBContactInquiry } from "@/lib/db";

export function InquiriesManager({ inquiries }: { inquiries: DBContactInquiry[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = inquiries.filter((inq) => {
    if (statusFilter !== "ALL" && inq.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function handleStatusChange(id: string, newStatus: string) {
    startTransition(async () => {
      await updateInquiryStatusAction(id, newStatus);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {["ALL", "UNREAD", "REVIEWED", "REPLIED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-bold transition-all",
                statusFilter === st
                  ? "btn-3d-emerald text-white"
                  : "btn-3d-glass text-pine-900/80 hover:text-pine-950",
              )}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pine-900/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries..."
            className="glass-input-3d w-full rounded-2xl pl-10 pr-4 py-2 text-xs text-pine-950"
          />
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className="glass-card-3d rounded-3xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pine-900/10 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        item.status === "UNREAD"
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : item.status === "REPLIED"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-blue-100 text-blue-900 border-blue-300"
                      }`}
                    >
                      {item.status}
                    </span>
                    <h3 className="font-display text-sm font-bold text-pine-950">
                      {item.subject}
                    </h3>
                  </div>

                  <span className="text-[11px] text-pine-900/50">
                    {new Date(item.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-pine-900/70 mb-3">
                  <span className="font-bold text-pine-950">{item.name}</span>
                  <a href={`mailto:${item.email}`} className="text-pine-700 hover:underline">
                    {item.email}
                  </a>
                  {item.phone && <span className="font-mono text-[11px]">{item.phone}</span>}
                </div>

                <p className="text-xs text-pine-900/80 leading-relaxed bg-mist/40 p-3.5 rounded-2xl border border-pine-900/8">
                  {item.message}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-pine-900/10 flex items-center justify-end gap-2.5">
                <a
                  href={`mailto:${item.email}?subject=RE: ${encodeURIComponent(item.subject)}`}
                  className="btn-3d-glass text-pine-900 px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Reply via Email
                </a>

                {item.status !== "REPLIED" && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusChange(item.id, "REPLIED")}
                    className="btn-3d-emerald inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
                  >
                    <MailCheck className="h-3.5 w-3.5" />
                    Mark Replied
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card-3d rounded-3xl p-12 text-center text-xs text-pine-900/60">
            No inquiries matching the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
