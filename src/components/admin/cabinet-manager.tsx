"use client";

import { useState, useTransition } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Edit2,
  ExternalLink,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { saveCabinetMemberAction, deleteCabinetMemberAction } from "@/app/actions/admin";
import type { DBCabinetMember } from "@/lib/db";

export function CabinetManager({ members }: { members: DBCabinetMember[] }) {
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingMember, setEditingMember] = useState<DBCabinetMember | "NEW" | null>(null);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await saveCabinetMemberAction(null, formData);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
        setEditingMember(null);
        window.location.reload();
      } else {
        setStatusMessage({ type: "error", text: res.message });
      }
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to remove cabinet member: "${name}"?`)) return;
    setStatusMessage(null);

    startTransition(async () => {
      const res = await deleteCabinetMemberAction(id);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
        window.location.reload();
      } else {
        setStatusMessage({ type: "error", text: res.message });
      }
    });
  }

  const inputClass =
    "glass-input-3d w-full rounded-2xl px-4 py-3 text-xs sm:text-sm text-pine-950 placeholder:text-pine-900/40";
  const labelClass = "mb-1.5 block text-[11px] font-bold tracking-wider text-pine-900/70 uppercase";

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div
          className={`glass-card-3d rounded-2xl p-4 text-xs flex items-center gap-3 border ${
            statusMessage.type === "success"
              ? "border-emerald-300 bg-emerald-50/80 text-emerald-800"
              : "border-red-300 bg-red-50/80 text-red-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <p className="font-semibold">{statusMessage.text}</p>
        </div>
      )}

      <div className="glass-card-3d flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl">
        <p className="text-xs text-pine-900/70 font-medium">
          Showing {members.length} executive cabinet members and ministers.
        </p>
        <button
          type="button"
          onClick={() => setEditingMember("NEW")}
          className="btn-3d-emerald inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add Cabinet Member
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="glass-card-3d rounded-3xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-pine-100/80 px-2.5 py-0.5 text-[10px] font-bold text-pine-900 border border-pine-200">
                  Order #{member.sortOrder}
                </span>
                <span className="text-[10px] font-bold text-pine-700 uppercase tracking-wider">
                  {member.designationEn}
                </span>
              </div>
              <h4 className="font-display mt-3 text-lg font-bold text-pine-950">{member.nameEn}</h4>
              <p className="mt-1 text-xs font-semibold text-pine-800">{member.portfolioEn}</p>
              <p className="mt-1.5 text-[11px] text-pine-900/60 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-pine-600 shrink-0" />
                {member.ministryEn}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-pine-900/10 flex items-center justify-between">
              {member.departmentUrl ? (
                <a
                  href={member.departmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-pine-700 hover:text-pine-950 inline-flex items-center gap-1 transition-colors"
                >
                  Department Portal <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-[10px] text-pine-900/40">Official Portal</span>
              )}

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditingMember(member)}
                  className="icon-box-3d p-2 text-pine-700 hover:text-pine-950 transition-colors"
                  title="Edit Minister"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(member.id, member.nameEn)}
                  className="icon-box-3d p-2 text-red-600 hover:text-red-800 transition-colors"
                  title="Delete Minister"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD / EDIT CABINET MEMBER */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
          <div className="modal-3d max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-pine-900/10">
              <h3 className="font-display text-lg font-bold text-pine-950">
                {editingMember === "NEW" ? "Add Cabinet Member" : "Edit Cabinet Member"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="rounded-full p-1 text-pine-900/40 hover:text-pine-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {editingMember !== "NEW" && (
                <input type="hidden" name="id" value={editingMember.id} />
              )}

              <div>
                <label className={labelClass}>Minister / Official Name</label>
                <input
                  name="nameEn"
                  defaultValue={editingMember === "NEW" ? "" : editingMember.nameEn}
                  required
                  placeholder="e.g. Mir Zahoor Ahmed Buledi"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Designation</label>
                  <input
                    name="designationEn"
                    defaultValue={editingMember === "NEW" ? "Provincial Minister" : editingMember.designationEn}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Sort Order</label>
                  <input
                    name="sortOrder"
                    type="number"
                    defaultValue={editingMember === "NEW" ? members.length + 1 : editingMember.sortOrder}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Assigned Portfolio</label>
                <input
                  name="portfolioEn"
                  defaultValue={editingMember === "NEW" ? "" : editingMember.portfolioEn}
                  required
                  placeholder="e.g. Planning & Development"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Department / Ministry Name</label>
                <input
                  name="ministryEn"
                  defaultValue={editingMember === "NEW" ? "" : editingMember.ministryEn}
                  required
                  placeholder="e.g. Planning and Development Department"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Department Portal URL (Optional)</label>
                <input
                  name="departmentUrl"
                  type="url"
                  defaultValue={editingMember === "NEW" ? "" : editingMember.departmentUrl || ""}
                  placeholder="https://pnd.balochistan.gov.pk"
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-pine-900/10">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="btn-3d-glass text-pine-950 px-5 py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-3d-emerald inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
