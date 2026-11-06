"use client";

import { useState, useTransition } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  savePriorityAction,
  deletePriorityAction,
  saveInitiativeAction,
  deleteInitiativeAction,
} from "@/app/actions/admin";
import { FileDropzone } from "@/components/admin/file-dropzone";
import type { DBPriority, DBInitiative } from "@/lib/db";

export function PrioritiesManager({
  priorities,
  initiatives,
}: {
  priorities: DBPriority[];
  initiatives: DBInitiative[];
}) {
  const [activeTab, setActiveTab] = useState<"priorities" | "initiatives">("priorities");
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State for Priority
  const [editingPriority, setEditingPriority] = useState<DBPriority | "NEW" | null>(null);

  // Modal State for Initiative
  const [editingInitiative, setEditingInitiative] = useState<DBInitiative | "NEW" | null>(null);

  function handleSavePriority(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await savePriorityAction(null, formData);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
        setEditingPriority(null);
        window.location.reload();
      } else {
        setStatusMessage({ type: "error", text: res.message });
      }
    });
  }

  function handleDeletePriority(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete priority: "${title}"?`)) return;
    setStatusMessage(null);

    startTransition(async () => {
      const res = await deletePriorityAction(id);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
        window.location.reload();
      } else {
        setStatusMessage({ type: "error", text: res.message });
      }
    });
  }

  function handleSaveInitiative(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await saveInitiativeAction(null, formData);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
        setEditingInitiative(null);
        window.location.reload();
      } else {
        setStatusMessage({ type: "error", text: res.message });
      }
    });
  }

  function handleDeleteInitiative(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete initiative: "${title}"?`)) return;
    setStatusMessage(null);

    startTransition(async () => {
      const res = await deleteInitiativeAction(id);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
        window.location.reload();
      } else {
        setStatusMessage({ type: "error", text: res.message });
      }
    });
  }

  const inputClass =
    "w-full rounded-xl glass-input-3d px-4 py-3 text-xs sm:text-sm text-pine-950 placeholder:text-pine-900/35";
  const labelClass = "mb-1.5 block text-[11px] font-bold tracking-wider text-pine-900/60 uppercase";

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

      {/* 3D Tabs */}
      <div className="flex flex-wrap border-b border-pine-900/10 gap-2 sm:gap-3 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("priorities")}
          className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "priorities"
              ? "btn-3d-emerald"
              : "btn-3d-glass !text-pine-900"
          }`}
        >
          Day-One Directives ({priorities.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("initiatives")}
          className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "initiatives"
              ? "btn-3d-emerald"
              : "btn-3d-glass !text-pine-900"
          }`}
        >
          Core Flagship Initiatives ({initiatives.length})
        </button>
      </div>

      {/* TAB 1: DAY-ONE PRIORITIES */}
      {activeTab === "priorities" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <p className="text-xs text-pine-900/60">
              Directives announced by the Chief Minister upon taking oath of office.
            </p>
            <button
              type="button"
              onClick={() => setEditingPriority("NEW")}
              className="btn-3d-emerald rounded-xl px-4 py-2.5 text-xs font-bold gap-2 shrink-0 justify-center"
            >
              <Plus className="h-4 w-4" />
              Add Directive
            </button>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {priorities.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl glass-card-3d p-5 shadow-3d-card border border-white/95 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-pine-100 px-2.5 py-0.5 text-[10px] font-bold text-pine-900 border border-pine-200/50">
                      Sort #{item.sortOrder}
                    </span>
                    <span className="text-[10px] text-pine-900/40 font-mono">{item.slug}</span>
                  </div>
                  <h4 className="font-display mt-3 text-base font-bold text-pine-950">{item.titleEn}</h4>
                  <p className="mt-1 text-xs text-pine-900/70 line-clamp-2">{item.descriptionEn}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-pine-900/8 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPriority(item)}
                    className="h-8 w-8 icon-box-3d text-pine-700 hover:text-pine-950 transition-colors"
                    title="Edit Directive"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePriority(item.id, item.titleEn)}
                    className="h-8 w-8 icon-box-3d text-red-600 hover:text-red-800 transition-colors"
                    title="Delete Directive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INITIATIVES */}
      {activeTab === "initiatives" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <p className="text-xs text-pine-900/60">
              Flagship development and public welfare programs across Balochistan.
            </p>
            <button
              type="button"
              onClick={() => setEditingInitiative("NEW")}
              className="btn-3d-emerald rounded-xl px-4 py-2.5 text-xs font-bold gap-2 shrink-0 justify-center"
            >
              <Plus className="h-4 w-4" />
              Add Initiative
            </button>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {initiatives.map((init) => (
              <div
                key={init.id}
                className="rounded-3xl glass-card-3d p-5 shadow-3d-card border border-white/95 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-[10px] font-bold text-pine-950 border border-gold-300/40">
                      {init.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">{init.progressPercent}%</span>
                  </div>
                  <h4 className="font-display mt-3 text-base font-bold text-pine-950">{init.titleEn}</h4>
                  <p className="mt-1 text-xs text-pine-900/70 line-clamp-2">{init.descriptionEn}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-pine-900/8 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingInitiative(init)}
                    className="h-8 w-8 icon-box-3d text-pine-700 hover:text-pine-950 transition-colors"
                    title="Edit Initiative"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteInitiative(init.id, init.titleEn)}
                    className="h-8 w-8 icon-box-3d text-red-600 hover:text-red-800 transition-colors"
                    title="Delete Initiative"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRIORITY MODAL / DRAWER (3D Floating Glass) */}
      {editingPriority && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pine-950/70 backdrop-blur-md p-4">
          <div className="modal-3d max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-pine-900/10">
              <h3 className="font-display text-lg font-bold text-pine-950">
                {editingPriority === "NEW" ? "Add Immediate Directive" : "Edit Directive"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPriority(null)}
                className="rounded-xl icon-box-3d p-1.5 text-pine-900/60 hover:text-pine-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSavePriority} className="space-y-4">
              {editingPriority !== "NEW" && (
                <input type="hidden" name="id" value={editingPriority.id} />
              )}
              <input type="hidden" name="isFirstDay" value="1" />

              <div>
                <label className={labelClass}>Directive Title</label>
                <input
                  name="titleEn"
                  defaultValue={editingPriority === "NEW" ? "" : editingPriority.titleEn}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Short Tagline</label>
                <input
                  name="shortEn"
                  defaultValue={editingPriority === "NEW" ? "" : editingPriority.shortEn}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Detailed Description</label>
                <textarea
                  name="descriptionEn"
                  rows={3}
                  defaultValue={editingPriority === "NEW" ? "" : editingPriority.descriptionEn}
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Icon Identifier</label>
                  <select
                    name="icon"
                    defaultValue={editingPriority === "NEW" ? "landmark" : editingPriority.icon}
                    className={inputClass}
                  >
                    <option value="landmark">Landmark / Governance</option>
                    <option value="shield">Shield / Law & Order</option>
                    <option value="heart">Heart / Health & Education</option>
                    <option value="globe">Globe / Utilities</option>
                    <option value="compass">Compass / Infrastructure</option>
                    <option value="trending">Trending / Employment</option>
                    <option value="message">Message / Complaint</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Display Sort Order</label>
                  <input
                    name="sortOrder"
                    type="number"
                    defaultValue={editingPriority === "NEW" ? priorities.length + 1 : editingPriority.sortOrder}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Priority Background Image Upload (Drag & Drop or Browse) */}
              <div className="pt-2 border-t border-pine-900/10">
                <FileDropzone
                  name="bgImage"
                  label="Priority Card Background Image"
                  folder="priorities"
                  initialUrl={editingPriority === "NEW" ? "" : editingPriority.bgImage}
                  helpText="High-resolution backdrop for priority flip card"
                  mediaType="image"
                  accept="image/*"
                />
              </div>

              {/* Priority Icon / Custom Emblem Upload */}
              <div className="pt-2 border-t border-pine-900/10">
                <FileDropzone
                  name="iconImage"
                  label="Priority Icon / Emblem Image (Optional)"
                  folder="priorities"
                  initialUrl={editingPriority === "NEW" ? "" : editingPriority.iconImage}
                  helpText="Custom icon or departmental seal (PNG/SVG)"
                  mediaType="image"
                  accept="image/*"
                />
              </div>

              {/* Priority Article & Detailed Visual Attachment */}
              <div className="pt-2 border-t border-pine-900/10 space-y-3">
                <FileDropzone
                  name="articleImage"
                  label="Attached Article / Directive Document Image (Optional)"
                  folder="priorities"
                  initialUrl={editingPriority === "NEW" ? "" : editingPriority.articleImage}
                  helpText="Document scan, official notification or photo"
                  mediaType="image"
                  accept="image/*"
                />

                <div>
                  <label className={labelClass}>Attached Article / Directive Extended Text (Optional)</label>
                  <textarea
                    name="articleText"
                    rows={4}
                    defaultValue={editingPriority === "NEW" ? "" : (editingPriority.articleText || "")}
                    placeholder="Enter extended reform directive text or official article..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-pine-900/10">
                <button
                  type="button"
                  onClick={() => setEditingPriority(null)}
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
                  Save Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INITIATIVE MODAL (3D Floating Glass) */}
      {editingInitiative && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pine-950/70 backdrop-blur-md p-4">
          <div className="modal-3d max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-pine-900/10">
              <h3 className="font-display text-lg font-bold text-pine-950">
                {editingInitiative === "NEW" ? "Add Flagship Initiative" : "Edit Initiative"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingInitiative(null)}
                className="rounded-xl icon-box-3d p-1.5 text-pine-900/60 hover:text-pine-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInitiative} className="space-y-4">
              {editingInitiative !== "NEW" && (
                <input type="hidden" name="id" value={editingInitiative.id} />
              )}

              <div>
                <label className={labelClass}>Initiative Name</label>
                <input
                  name="titleEn"
                  defaultValue={editingInitiative === "NEW" ? "" : editingInitiative.titleEn}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Sector Category</label>
                <input
                  name="category"
                  defaultValue={editingInitiative === "NEW" ? "Public Transportation" : editingInitiative.category}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Description & Impact</label>
                <textarea
                  name="descriptionEn"
                  rows={3}
                  defaultValue={editingInitiative === "NEW" ? "" : editingInitiative.descriptionEn}
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Progress Percentage (0-100)</label>
                  <input
                    name="progressPercent"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={editingInitiative === "NEW" ? 50 : editingInitiative.progressPercent}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Status Badge</label>
                  <input
                    name="status"
                    defaultValue={editingInitiative === "NEW" ? "Active" : editingInitiative.status}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Initiative Banner Image Upload */}
              <div className="pt-2 border-t border-pine-900/10">
                <FileDropzone
                  name="bgImage"
                  label="Initiative Banner / Card Image"
                  folder="priorities"
                  initialUrl={editingInitiative === "NEW" ? "" : editingInitiative.bgImage}
                  helpText="Photo representing the initiative (Bus, Sehat Card, Digital IT, etc.)"
                  mediaType="image"
                  accept="image/*"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-pine-900/10">
                <button
                  type="button"
                  onClick={() => setEditingInitiative(null)}
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
                  Save Initiative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
