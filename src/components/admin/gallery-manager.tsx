"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Film,
  Camera,
  Trash2,
  Edit2,
  Plus,
  Play,
  Eye,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Loader2,
} from "lucide-react";
import type { DBGalleryItem } from "@/lib/db";
import { GalleryUploader, GALLERY_CATEGORIES } from "@/components/gallery/gallery-uploader";
import { GalleryViewer } from "@/components/gallery/gallery-viewer";
import { deleteGalleryItemAction, updateGalleryItemAction } from "@/app/actions/gallery";

export function GalleryManager({ items }: { items: DBGalleryItem[] }) {
  const [galleryList, setGalleryList] = useState<DBGalleryItem[]>(items);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filters
  const [activeType, setActiveType] = useState<"ALL" | "IMAGE" | "VIDEO">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  // Drawers & Modals
  const [showUploader, setShowUploader] = useState(false);
  const [viewingItem, setViewingItem] = useState<DBGalleryItem | null>(null);
  const [editingItem, setEditingItem] = useState<DBGalleryItem | null>(null);

  const filtered = galleryList.filter((item) => {
    if (activeType !== "ALL" && item.type !== activeType) return false;
    if (activeCategory !== "ALL" && item.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const photoCount = galleryList.filter((i) => i.type === "IMAGE").length;
  const videoCount = galleryList.filter((i) => i.type === "VIDEO").length;
  const totalBytes = galleryList.reduce((acc, i) => acc + (i.fileSize || 0), 0);

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to permanently delete: "${title}"?\nThis will remove the file from the server.`)) {
      return;
    }

    setStatusMessage(null);
    startTransition(async () => {
      const res = await deleteGalleryItemAction(id);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
        setGalleryList((prev) => prev.filter((i) => i.id !== id));
      } else {
        setStatusMessage({ type: "error", text: res.message });
      }
    });
  }

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingItem) return;

    setStatusMessage(null);
    const formData = new FormData(e.currentTarget);
    formData.append("id", editingItem.id);

    startTransition(async () => {
      const res = await updateGalleryItemAction(null, formData);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
        setEditingItem(null);
        window.location.reload();
      } else {
        setStatusMessage({ type: "error", text: res.message });
      }
    });
  }

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
          <p className="font-semibold">{statusMessage.text}</p>
        </div>
      )}

      {/* KPI Stats Bar (3D Glass Cards: Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl glass-card-3d p-4 shadow-3d-card transition-all duration-200 hover:-translate-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-pine-900/50">Total Media Assets</p>
          <p className="font-mono text-2xl font-black text-pine-950 mt-1">{galleryList.length}</p>
        </div>
        <div className="rounded-2xl glass-card-3d p-4 shadow-3d-card transition-all duration-200 hover:-translate-y-1 !border-emerald-200/60">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-900/60">Photos & Graphics</p>
          <p className="font-mono text-2xl font-black text-emerald-950 mt-1">{photoCount}</p>
        </div>
        <div className="rounded-2xl glass-card-3d p-4 shadow-3d-card transition-all duration-200 hover:-translate-y-1 !border-amber-200/60">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900/60">High-Def Videos</p>
          <p className="font-mono text-2xl font-black text-amber-950 mt-1">{videoCount}</p>
        </div>
        <div className="rounded-2xl glass-card-3d p-4 shadow-3d-card transition-all duration-200 hover:-translate-y-1 !border-blue-200/60">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-900/60">Storage Utilization</p>
          <p className="font-mono text-2xl font-black text-blue-950 mt-1">{formatBytes(totalBytes)}</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveType("ALL")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeType === "ALL" ? "btn-3d-emerald text-white" : "btn-3d-glass !text-pine-950"
            }`}
          >
            All ({galleryList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveType("IMAGE")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeType === "IMAGE" ? "btn-3d-emerald text-white" : "btn-3d-glass !text-pine-950"
            }`}
          >
            <Camera className="h-3 w-3" />
            Photos ({photoCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveType("VIDEO")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeType === "VIDEO" ? "btn-3d-emerald text-white" : "btn-3d-glass !text-pine-950"
            }`}
          >
            <Film className="h-3 w-3" />
            Videos ({videoCount})
          </button>

          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="rounded-xl glass-input-3d px-3 py-1.5 text-xs text-pine-950 font-bold"
          >
            <option value="ALL">All Categories</option>
            {GALLERY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-pine-900/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, category..."
              className="w-full rounded-xl glass-input-3d pl-9 pr-3 py-2 text-xs text-pine-950 placeholder:text-pine-900/35"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowUploader(!showUploader)}
            className="btn-3d-emerald rounded-xl px-4 py-2 text-xs font-bold gap-1.5 shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            {showUploader ? "Close Uploader" : "Direct Upload Media"}
          </button>
        </div>
      </div>

      {/* UPLOADER COMPONENT (Expandable) */}
      {showUploader && (
        <GalleryUploader
          onUploadSuccess={() => {
            setShowUploader(false);
            window.location.reload();
          }}
        />
      )}

      {/* MEDIA MANAGEMENT TABLE (3D Glass) */}
      <div className="rounded-3xl glass-card-3d border border-white/95 shadow-3d-card overflow-hidden">
        <div className="w-full overflow-x-auto rounded-lg">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-mist/80 border-b border-pine-900/10 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pine-900/60">
              <tr>
                <th className="whitespace-nowrap px-3 sm:px-5 py-3 sm:py-4">Preview</th>
                <th className="whitespace-nowrap px-3 sm:px-5 py-3 sm:py-4">Title & Details</th>
                <th className="whitespace-nowrap px-3 sm:px-5 py-3 sm:py-4">Format / Type</th>
                <th className="whitespace-nowrap px-3 sm:px-5 py-3 sm:py-4">Category</th>
                <th className="whitespace-nowrap px-3 sm:px-5 py-3 sm:py-4">Size</th>
                <th className="whitespace-nowrap px-3 sm:px-5 py-3 sm:py-4">Uploaded</th>
                <th className="whitespace-nowrap px-3 sm:px-5 py-3 sm:py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pine-900/6">
              {filtered.map((item) => {
                const isVid = item.type === "VIDEO";
                return (
                  <tr key={item.id} className="hover:bg-mist/40 transition-colors">
                    {/* Thumbnail */}
                    <td className="whitespace-nowrap px-3 sm:px-5 py-2.5 sm:py-3">
                      <div
                        onClick={() => setViewingItem(item)}
                        className="relative h-14 w-20 rounded-xl overflow-hidden image-3d-frame cursor-pointer bg-black/90 flex items-center justify-center shrink-0 group"
                      >
                        {isVid ? (
                          <>
                            <video src={item.fileUrl} className="h-full w-full object-cover" muted />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                              <Play className="h-4 w-4 fill-white text-white" />
                            </div>
                          </>
                        ) : (
                          <Image
                            src={item.fileUrl}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="80px"
                          />
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-3 sm:px-5 py-2.5 sm:py-3 min-w-[180px] max-w-xs">
                      <p className="font-bold text-pine-950 truncate">{item.title}</p>
                      {item.description && (
                        <p className="mt-0.5 text-pine-900/60 text-[11px] line-clamp-1">{item.description}</p>
                      )}
                    </td>

                    {/* Format / Type */}
                    <td className="whitespace-nowrap px-3 sm:px-5 py-2.5 sm:py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white inline-flex items-center gap-1 ${
                          isVid ? "bg-amber-600" : "bg-emerald-600"
                        }`}
                      >
                        {isVid ? <Film className="h-2.5 w-2.5" /> : <Camera className="h-2.5 w-2.5" />}
                        {item.type}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="whitespace-nowrap px-3 sm:px-5 py-2.5 sm:py-3">
                      <span className="rounded-full bg-pine-100 px-2.5 py-0.5 text-[10px] font-bold text-pine-900">
                        {item.category}
                      </span>
                    </td>

                    {/* File Size */}
                    <td className="whitespace-nowrap px-3 sm:px-5 py-2.5 sm:py-3 font-mono text-[11px] text-pine-900/70">
                      {formatBytes(item.fileSize)}
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-3 sm:px-5 py-2.5 sm:py-3 text-pine-900/65 text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-3 sm:px-5 py-2.5 sm:py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingItem(item)}
                          className="h-8 w-8 icon-box-3d text-pine-700 hover:text-pine-950 transition-colors"
                          title="Preview Media"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="h-8 w-8 icon-box-3d text-blue-700 hover:text-blue-950 transition-colors"
                          title="Edit Details"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={isPending}
                          className="h-8 w-8 icon-box-3d text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                          title="Delete Media"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT METADATA MODAL (3D Floating Glass) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pine-950/70 backdrop-blur-md p-4">
          <div className="modal-3d max-w-lg w-full p-6 sm:p-7">
            <div className="flex items-center justify-between pb-3 border-b border-pine-900/10 mb-5">
              <h3 className="font-display text-lg font-bold text-pine-950">
                Edit Media Details
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="icon-box-3d h-7 w-7 rounded-lg text-pine-900/60 hover:text-pine-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-bold uppercase tracking-wider text-[10px] text-pine-900/60">
                  Media Title
                </label>
                <input
                  name="title"
                  defaultValue={editingItem.title}
                  required
                  className="w-full rounded-xl glass-input-3d px-3.5 py-2.5 text-xs text-pine-950"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold uppercase tracking-wider text-[10px] text-pine-900/60">
                  Official Category
                </label>
                <select
                  name="category"
                  defaultValue={editingItem.category}
                  className="w-full rounded-xl glass-input-3d px-3.5 py-2.5 text-xs text-pine-950"
                >
                  {GALLERY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-bold uppercase tracking-wider text-[10px] text-pine-900/60">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingItem.description || ""}
                  rows={3}
                  className="w-full rounded-xl glass-input-3d px-3.5 py-2.5 text-xs text-pine-950"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-pine-900/10">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="btn-3d-glass rounded-xl px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-3d-emerald rounded-xl px-5 py-2 text-xs font-bold gap-1.5"
                >
                  {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEWER MODAL */}
      <GalleryViewer
        item={viewingItem}
        items={filtered}
        onClose={() => setViewingItem(null)}
        onNavigate={(item) => setViewingItem(item)}
      />
    </div>
  );
}
