"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  Loader2,
  Save,
  Search,
  X,
} from "lucide-react";
import { updateComplaintStatusAction } from "@/app/actions/admin";
import type { DBComplaint } from "@/lib/db";

export function ComplaintsManager({ complaints }: { complaints: DBComplaint[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<DBComplaint | null>(null);

  const filtered = complaints.filter((c) => {
    if (activeStatusFilter !== "ALL" && c.status !== activeStatusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.trackingCode.toLowerCase().includes(q) ||
        c.citizenName.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function handleUpdateStatus(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateComplaintStatusAction(null, formData);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
        setSelectedComplaint(null);
        router.refresh();
      } else {
        setStatusMessage({ type: "error", text: res.message });
      }
    });
  }

  const inputClass =
    "w-full rounded-xl glass-input-3d px-4 py-3 text-xs sm:text-sm text-pine-950 placeholder:text-pine-900/35";
  const labelClass = "mb-1.5 block text-[11px] font-bold tracking-wider text-pine-900/60 uppercase";

  const statusBadges: Record<string, string> = {
    SUBMITTED: "bg-pine-100 text-pine-900 border-pine-300",
    UNDER_REVIEW: "bg-blue-100 text-blue-900 border-blue-300",
    ASSIGNED: "bg-indigo-100 text-indigo-900 border-indigo-300",
    IN_PROGRESS: "bg-amber-100 text-amber-900 border-amber-300",
    RESOLVED: "bg-emerald-100 text-emerald-800 border-emerald-300",
    CLOSED: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div
          className={`rounded-2xl p-4 text-xs flex items-center gap-3 border shadow-sm ${
            statusMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <p>{statusMessage.text}</p>
        </div>
      )}

      {/* Grievance Cell KPI Summary (3D Glass Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl glass-card-3d p-4 shadow-3d-card transition-all duration-200 hover:-translate-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-pine-900/50">Total Grievances</p>
          <p className="font-mono text-2xl font-black text-pine-950 mt-1">{complaints.length}</p>
        </div>
        <div className="rounded-2xl glass-card-3d p-4 shadow-3d-card transition-all duration-200 hover:-translate-y-1 !border-blue-200/60">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-900/60">Under Triage / Review</p>
          <p className="font-mono text-2xl font-black text-blue-950 mt-1">
            {complaints.filter((c) => c.status === "SUBMITTED" || c.status === "UNDER_REVIEW").length}
          </p>
        </div>
        <div className="rounded-2xl glass-card-3d p-4 shadow-3d-card transition-all duration-200 hover:-translate-y-1 !border-amber-200/60">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900/60">In Field Progress</p>
          <p className="font-mono text-2xl font-black text-amber-950 mt-1">
            {complaints.filter((c) => c.status === "ASSIGNED" || c.status === "IN_PROGRESS").length}
          </p>
        </div>
        <div className="rounded-2xl glass-card-3d p-4 shadow-3d-card transition-all duration-200 hover:-translate-y-1 !border-emerald-200/60">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-900/60">Resolved & Closed</p>
          <p className="font-mono text-2xl font-black text-emerald-950 mt-1">
            {complaints.filter((c) => c.status === "RESOLVED" || c.status === "CLOSED").length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "SUBMITTED", "UNDER_REVIEW", "ASSIGNED", "IN_PROGRESS", "RESOLVED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setActiveStatusFilter(st)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeStatusFilter === st
                  ? "btn-3d-emerald"
                  : "btn-3d-glass !text-pine-900"
              }`}
            >
              {st === "ALL" ? `All (${complaints.length})` : st.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pine-900/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code, citizen, district..."
            className="w-full rounded-xl glass-input-3d pl-10 pr-4 py-2.5 text-xs text-pine-950 placeholder:text-pine-900/35"
          />
        </div>
      </div>

      {/* Complaints Table (3D Glass) */}
      <div className="rounded-3xl glass-card-3d border border-white/95 shadow-3d-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-mist/80 border-b border-pine-900/10 text-[10px] font-bold uppercase tracking-wider text-pine-900/60">
              <tr>
                <th className="px-6 py-4">Tracking Code</th>
                <th className="px-6 py-4">Citizen & Contact</th>
                <th className="px-6 py-4">District & Sector</th>
                <th className="px-6 py-4">Lodged Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pine-900/6">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-mist/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono font-black text-pine-950 text-xs">
                      {c.trackingCode}
                    </span>
                    {c.priorityLevel === "URGENT" && (
                      <span className="ml-2 inline-block rounded bg-red-100 text-red-800 px-1.5 py-0.5 text-[9px] font-bold border border-red-200">
                        URGENT
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-pine-950">{c.citizenName}</p>
                    <p className="text-pine-900/60 font-mono text-[11px]">{c.citizenPhone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-pine-950">{c.district}</p>
                    <p className="text-pine-900/60 text-[11px]">{c.category}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-pine-900/70">
                    {new Date(c.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${
                        statusBadges[c.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {c.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedComplaint(c)}
                      className="btn-3d-glass rounded-xl px-3 py-1.5 text-xs font-bold gap-1.5"
                    >
                      <span>Review / Update</span>
                      <Edit2 className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPLAINT REVIEW & STATUS MODAL (3D Floating Glass) */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pine-950/70 backdrop-blur-md p-4">
          <div className="modal-3d max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-pine-900/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-pine-900/50">
                  Grievance File
                </span>
                <h3 className="font-mono text-xl font-black text-pine-950">
                  {selectedComplaint.trackingCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="rounded-xl icon-box-3d p-1.5 text-pine-900/60 hover:text-pine-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Citizen & Grievance Context */}
            <div className="rounded-2xl glass-panel-3d p-4 border border-white/80 text-xs space-y-2 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-pine-900/50 font-bold uppercase text-[10px]">Citizen Name:</span>
                  <p className="font-bold text-pine-950">{selectedComplaint.citizenName}</p>
                </div>
                <div>
                  <span className="text-pine-900/50 font-bold uppercase text-[10px]">Phone Number:</span>
                  <p className="font-mono text-pine-950">{selectedComplaint.citizenPhone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-pine-900/6">
                <div>
                  <span className="text-pine-900/50 font-bold uppercase text-[10px]">District:</span>
                  <p className="font-bold text-pine-950">{selectedComplaint.district}</p>
                </div>
                <div>
                  <span className="text-pine-900/50 font-bold uppercase text-[10px]">Sector:</span>
                  <p className="font-bold text-pine-950">{selectedComplaint.category}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-pine-900/6">
                <span className="text-pine-900/50 font-bold uppercase text-[10px]">Citizen Statement:</span>
                <p className="mt-0.5 text-pine-900/80 leading-relaxed font-medium">
                  {selectedComplaint.description}
                </p>
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <input type="hidden" name="complaintId" value={selectedComplaint.id} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>New Operational Status</label>
                  <select
                    name="newStatus"
                    defaultValue={selectedComplaint.status}
                    required
                    className={inputClass}
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="ASSIGNED">ASSIGNED TO DEPT</option>
                    <option value="IN_PROGRESS">IN PROGRESS (FIELD TEAM)</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Priority Level</label>
                  <select
                    name="priorityLevel"
                    defaultValue={selectedComplaint.priorityLevel || "NORMAL"}
                    className={inputClass}
                  >
                    <option value="NORMAL">NORMAL (14 Days)</option>
                    <option value="HIGH">HIGH (7 Days)</option>
                    <option value="URGENT">URGENT (24-48 Hours / Appeal)</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Assign Department</label>
                  <select
                    name="department"
                    defaultValue={selectedComplaint.department || ""}
                    className={inputClass}
                  >
                    <option value="">-- Unassigned / Under Triage --</option>
                    <option value="Communication & Works (C&W)">Communication & Works (C&W)</option>
                    <option value="Public Health Engineering (PHE)">Public Health Engineering (PHE)</option>
                    <option value="Health Department & Hospitals">Health Department & Hospitals</option>
                    <option value="Secondary Education Department">Secondary Education Department</option>
                    <option value="Colleges & Higher Education">Colleges & Higher Education</option>
                    <option value="Irrigation & Water Resources">Irrigation & Water Resources</option>
                    <option value="Energy & Power Department">Energy & Power Department</option>
                    <option value="Local Government & Rural Dev">Local Government & Rural Dev</option>
                    <option value="Home & Tribal Affairs">Home & Tribal Affairs</option>
                    <option value="Agriculture & Cooperatives">Agriculture & Cooperatives</option>
                    <option value="Quetta Development Authority">Quetta Development Authority</option>
                    <option value="Other District / Line Office">Other District / Line Office</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Departmental Comments / Progress Update</label>
                <textarea
                  name="comments"
                  rows={3}
                  required
                  placeholder="Record instructions issued to field teams, inquiry officer post, or verification findings..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Official Resolution Findings (If Completed)</label>
                <textarea
                  name="resolutionNotes"
                  rows={2}
                  defaultValue={selectedComplaint.resolutionNotes || ""}
                  placeholder="Official resolution summary visible to citizen on public portal..."
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-pine-900/10">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="btn-3d-glass rounded-xl px-5 py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-3d-emerald rounded-xl px-6 py-2.5 text-xs font-bold gap-2"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Record Status & Inform Citizen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
