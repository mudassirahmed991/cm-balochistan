"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Film,
  Camera,
  Play,
  Search,
  Plus,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import type { DBGalleryItem } from "@/lib/db";
import { GalleryViewer } from "./gallery-viewer";
import { GalleryUploader, GALLERY_CATEGORIES } from "./gallery-uploader";

interface GalleryGridProps {
  initialItems: DBGalleryItem[];
  allowUpload?: boolean;
}

export function GalleryGrid({ initialItems, allowUpload = false }: GalleryGridProps) {
  const [items] = useState<DBGalleryItem[]>(initialItems);
  const [activeType, setActiveType] = useState<"ALL" | "IMAGE" | "VIDEO">("ALL");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState<DBGalleryItem | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  // Filter items
  const filtered = items.filter((item) => {
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

  const photoCount = items.filter((i) => i.type === "IMAGE").length;
  const videoCount = items.filter((i) => i.type === "VIDEO").length;

  function refreshGallery() {
    window.location.reload();
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  return (
    <div className="space-y-8">
      {/* Top Filter and Controls Bar (3D Glass Panel) */}
      <div className="rounded-3xl glass-card-3d p-5 sm:p-6 shadow-3d-card border border-white/95">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Media Type Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveType("ALL")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeType === "ALL" ? "btn-3d-emerald text-white" : "btn-3d-glass !text-pine-950"
              }`}
            >
              All Media ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveType("IMAGE")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeType === "IMAGE" ? "btn-3d-emerald text-white" : "btn-3d-glass !text-pine-950"
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              Photos ({photoCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveType("VIDEO")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeType === "VIDEO" ? "btn-3d-emerald text-white" : "btn-3d-glass !text-pine-950"
              }`}
            >
              <Film className="h-3.5 w-3.5" />
              Videos ({videoCount})
            </button>
          </div>

          {/* Search & Upload Action */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] sm:min-w-[260px] flex-1 sm:flex-initial">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pine-900/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search photos & videos..."
                className="w-full rounded-xl glass-input-3d pl-10 pr-4 py-2.5 text-xs text-pine-950 placeholder:text-pine-900/35"
              />
            </div>

            {allowUpload && (
              <button
                type="button"
                onClick={() => setShowUploader(!showUploader)}
                className="btn-3d-emerald rounded-xl px-4 py-2.5 text-xs font-bold gap-2 shrink-0"
              >
                <Plus className="h-4 w-4" />
                {showUploader ? "Close Uploader" : "Upload Photos & Videos"}
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Sub-row */}
        <div className="mt-4 pt-4 border-t border-pine-900/8 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-pine-900/40 mr-2 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" />
            Category:
          </span>
          <button
            type="button"
            onClick={() => setActiveCategory("ALL")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
              activeCategory === "ALL"
                ? "bg-pine-900 text-white shadow-sm"
                : "text-pine-900/60 hover:text-pine-950 hover:bg-white"
            }`}
          >
            All Categories
          </button>
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                activeCategory === cat
                  ? "bg-pine-900 text-white shadow-sm"
                  : "text-pine-900/60 hover:text-pine-950 hover:bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* UPLOADER DRAWER (When toggled open) */}
      {showUploader && (
        <GalleryUploader
          onUploadSuccess={() => {
            setShowUploader(false);
            refreshGallery();
          }}
        />
      )}

      {/* MEDIA GRID (3D Glass Cards) */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const isVid = item.type === "VIDEO";
            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative rounded-3xl glass-card-3d glass-sheen overflow-hidden shadow-3d-card border border-white/95 transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/90">
                  {isVid ? (
                    <div className="relative h-full w-full flex items-center justify-center">
                      <video
                        src={item.fileUrl.startsWith("/uploads/") ? `/api/media/stream?file=${encodeURIComponent(item.fileUrl)}` : item.fileUrl}
                        preload="metadata"
                        className="h-full w-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                        muted
                      />
                      {/* Play Button Overlay in 3D */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
                        <div className="h-14 w-14 rounded-full icon-box-3d bg-amber-500 text-white shadow-3d-btn flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="h-6 w-6 ml-1 fill-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full w-full">
                      <Image
                        src={item.fileUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  {/* Badge & Category Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-md flex items-center gap-1 ${
                        isVid ? "bg-amber-600" : "bg-emerald-600"
                      }`}
                    >
                      {isVid ? <Film className="h-2.5 w-2.5" /> : <Camera className="h-2.5 w-2.5" />}
                      {item.type}
                    </span>
                    <span className="rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white/90">
                      {item.category}
                    </span>
                  </div>

                  {/* File size badge */}
                  <div className="absolute bottom-3 right-3 rounded-md bg-black/70 backdrop-blur-sm px-2 py-0.5 text-[9px] font-mono font-bold text-white/90">
                    {formatBytes(item.fileSize)}
                  </div>
                </div>

                {/* Card Content & Action */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display text-base font-bold text-pine-950 group-hover:text-emerald-800 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="mt-1.5 text-xs text-pine-900/60 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-pine-900/8 flex items-center justify-between text-[11px] text-pine-900/50">
                    <span>
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                      {isVid ? (
                        <>
                          <Play className="h-3 w-3 fill-emerald-700" />
                          Watch Video
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          View Photo
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl glass-card-3d p-12 text-center shadow-3d-card border border-white/95">
          <div className="h-16 w-16 rounded-2xl icon-box-3d mx-auto flex items-center justify-center text-pine-800 mb-4">
            <Camera className="h-8 w-8 text-pine-600" />
          </div>
          <h3 className="font-display text-xl font-bold text-pine-950">No media found</h3>
          <p className="text-xs text-pine-900/60 mt-1 max-w-md mx-auto">
            {searchQuery
              ? `No media items matching "${searchQuery}". Try a different keyword.`
              : "No photos or videos uploaded in this category yet."}
          </p>
          {allowUpload && (
            <button
              type="button"
              onClick={() => setShowUploader(true)}
              className="mt-6 btn-3d-emerald rounded-2xl px-6 py-3 text-xs font-bold gap-2"
            >
              <Plus className="h-4 w-4" />
              Upload First Media Item
            </button>
          )}
        </div>
      )}

      {/* 3D Lightbox & Video Player Modal */}
      <GalleryViewer
        item={activeItem}
        items={filtered}
        onClose={() => setActiveItem(null)}
        onNavigate={(item) => setActiveItem(item)}
      />
    </div>
  );
}
