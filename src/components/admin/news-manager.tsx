"use client";

import { useState, useTransition } from "react";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Edit2,
  Film,
  Loader2,
  Plus,
  Save,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { saveNewsArticleAction, deleteNewsArticleAction } from "@/app/actions/admin";
import { FileDropzone } from "@/components/admin/file-dropzone";
import type { DBNewsArticle } from "@/lib/db";

const officialCategories = [
  "Official Meetings",
  "Press Releases",
  "Policy Announcements",
  "Development Projects",
  "Public Welfare Initiatives",
  "Speeches and Statements",
  "Visits and Events",
];

export function NewsManager({ articles }: { articles: DBNewsArticle[] }) {
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingArticle, setEditingArticle] = useState<DBNewsArticle | "NEW" | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filtered = categoryFilter === "All"
    ? articles
    : articles.filter((a) => a.category === categoryFilter);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await saveNewsArticleAction(null, formData);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
        setEditingArticle(null);
        window.location.reload();
      } else {
        setStatusMessage({ type: "error", text: res.message });
      }
    });
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete news article: "${title}"?`)) return;
    setStatusMessage(null);

    startTransition(async () => {
      const res = await deleteNewsArticleAction(id);
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

      {/* Top Filter and Add Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategoryFilter("All")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === "All"
                ? "btn-3d-emerald"
                : "btn-3d-glass !text-pine-900"
            }`}
          >
            All Updates ({articles.length})
          </button>
          {officialCategories.slice(0, 4).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "btn-3d-emerald"
                  : "btn-3d-glass !text-pine-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setEditingArticle("NEW")}
          className="btn-3d-emerald rounded-xl px-5 py-2.5 text-xs font-bold gap-2 shrink-0 justify-center"
        >
          <Plus className="h-4 w-4" />
          Publish Article
        </button>
      </div>

      {/* Articles Table (3D Glass) */}
      <div className="rounded-3xl glass-card-3d border border-white/95 shadow-3d-card overflow-hidden">
        <div className="w-full overflow-x-auto rounded-lg">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-mist/80 border-b border-pine-900/10 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pine-900/60">
              <tr>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">Title & Excerpt</th>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">Category</th>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">Publication Date</th>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">Status</th>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pine-900/6">
              {filtered.map((article) => (
                <tr key={article.id} className="hover:bg-mist/30 transition-colors">
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 min-w-[220px] max-w-md">
                    <div className="flex items-center gap-2 flex-wrap">
                      {article.isFeatured === 1 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 text-gold-900 px-2 py-0.5 text-[9px] font-bold">
                          <Star className="h-2.5 w-2.5 fill-gold-600 text-gold-600" />
                          Featured
                        </span>
                      )}
                      {article.videoUrl && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[9px] font-bold">
                          <Film className="h-2.5 w-2.5 text-amber-700" />
                          Video Release
                        </span>
                      )}
                      {article.coverImageUrl && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-900 px-2 py-0.5 text-[9px] font-bold">
                          <Camera className="h-2.5 w-2.5 text-emerald-700" />
                          HD Photo
                        </span>
                      )}
                      <p className="font-bold text-pine-950 truncate">{article.titleEn}</p>
                    </div>
                    <p className="mt-1 text-pine-900/65 line-clamp-1">{article.excerptEn}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-6 py-2.5 sm:py-4">
                    <span className="rounded-full bg-pine-100 px-2.5 py-0.5 text-[10px] font-bold text-pine-900">
                      {article.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-6 py-2.5 sm:py-4 text-pine-900/70">
                    {new Date(article.publishedDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-6 py-2.5 sm:py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        article.isPublished === 1
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {article.isPublished === 1 ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-6 py-2.5 sm:py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingArticle(article)}
                        className="h-8 w-8 icon-box-3d text-pine-700 hover:text-pine-950 transition-colors"
                        title="Edit Article"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(article.id, article.titleEn)}
                        className="h-8 w-8 icon-box-3d text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ARTICLE EDITOR MODAL (3D Floating Glass) */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pine-950/70 backdrop-blur-md p-4">
          <div className="modal-3d max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-pine-900/10">
              <h3 className="font-display text-lg font-bold text-pine-950">
                {editingArticle === "NEW" ? "Publish News Release" : "Edit News Release"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="rounded-xl icon-box-3d p-1.5 text-pine-900/60 hover:text-pine-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {editingArticle !== "NEW" && (
                <input type="hidden" name="id" value={editingArticle.id} />
              )}

              <div>
                <label className={labelClass}>Article Headline (English)</label>
                <input
                  name="titleEn"
                  defaultValue={editingArticle === "NEW" ? "" : editingArticle.titleEn}
                  required
                  placeholder="e.g. Chief Minister chairs provincial security and development review"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Official Category</label>
                  <select
                    name="category"
                    defaultValue={editingArticle === "NEW" ? "Press Releases" : editingArticle.category}
                    className={inputClass}
                  >
                    {officialCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Estimated Read Time</label>
                  <input
                    name="readTime"
                    defaultValue={editingArticle === "NEW" ? "3 min read" : editingArticle.readTime}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Summary Excerpt</label>
                <textarea
                  name="excerptEn"
                  rows={2}
                  defaultValue={editingArticle === "NEW" ? "" : editingArticle.excerptEn}
                  required
                  placeholder="Brief synopsis displayed on news cards and search listings..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Full Article Text (Separate paragraphs with double Enter)</label>
                <textarea
                  name="bodyEn"
                  rows={7}
                  defaultValue={editingArticle === "NEW" ? "" : editingArticle.bodyEn}
                  required
                  placeholder="Full text of the official press release or statement..."
                  className={inputClass}
                />
              </div>

              {/* High-Resolution Cover Image Upload */}
              <div className="pt-2 border-t border-pine-900/10">
                <FileDropzone
                  name="coverImageUrl"
                  label="Cover Photo / Graphic Banner (High Definition)"
                  folder="news"
                  accept="image/*"
                  mediaType="image"
                  initialUrl={editingArticle === "NEW" ? "" : editingArticle.coverImageUrl}
                  helpText="Drag & drop or browse high-resolution article photo (JPG, PNG, WEBP)"
                />
              </div>

              {/* High-Definition Video File Upload */}
              <div className="pt-2 border-t border-pine-900/10">
                <FileDropzone
                  name="videoUrl"
                  label="Official Video Release (Optional - Supports Large Video Files)"
                  folder="news"
                  accept="video/*"
                  mediaType="video"
                  initialUrl={editingArticle === "NEW" ? "" : editingArticle.videoUrl}
                  helpText="Attach HD video (MP4, WEBM, MOV) of any size. Plays smoothly on public portal."
                />
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-mist/50 border border-pine-900/8">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-pine-950">
                  <input
                    type="checkbox"
                    name="isPublished"
                    value="1"
                    defaultChecked={editingArticle === "NEW" ? true : editingArticle.isPublished === 1}
                    className="h-4 w-4 rounded border-pine-900/20 text-pine-900"
                  />
                  <span>Publish Immediately</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-pine-950">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    value="1"
                    defaultChecked={editingArticle === "NEW" ? false : editingArticle.isFeatured === 1}
                    className="h-4 w-4 rounded border-pine-900/20 text-pine-900"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-pine-900/10">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
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
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
