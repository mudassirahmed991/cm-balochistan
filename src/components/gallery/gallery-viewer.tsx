"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  Tag,
  HardDrive,
  Maximize2,
  Film,
  Camera,
} from "lucide-react";
import type { DBGalleryItem } from "@/lib/db";

interface GalleryViewerProps {
  item: DBGalleryItem | null;
  items: DBGalleryItem[];
  onClose: () => void;
  onNavigate: (item: DBGalleryItem) => void;
}

export function GalleryViewer({ item, items, onClose, onNavigate }: GalleryViewerProps) {
  const [fullscreen, setFullscreen] = useState(false);

  // Navigate to previous or next item
  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < items.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) onNavigate(items[currentIndex - 1]);
  }, [hasPrev, currentIndex, items, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) onNavigate(items[currentIndex + 1]);
  }, [hasNext, currentIndex, items, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!item) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose, handlePrev, handleNext]);

  if (!item) return null;

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  const isVideo = item.type === "VIDEO";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-pine-950/85 backdrop-blur-md p-3 sm:p-6"
    >
      <div
        className={`modal-3d w-full max-h-[94vh] flex flex-col overflow-hidden transition-all duration-300 ${
          fullscreen ? "max-w-7xl h-[92vh]" : "max-w-5xl"
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-pine-900/10 shrink-0 bg-mist/50">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5 ${
                isVideo ? "bg-amber-600" : "bg-emerald-600"
              }`}
            >
              {isVideo ? <Film className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
              {item.type}
            </span>
            <span className="text-xs font-bold text-pine-900/60 truncate max-w-xs sm:max-w-md">
              {item.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={item.fileUrl}
              download={item.fileName || "media"}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-box-3d h-8 w-8 rounded-xl text-pine-700 hover:text-pine-950 transition-colors"
              title="Download Original Media"
            >
              <Download className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={() => setFullscreen(!fullscreen)}
              className="icon-box-3d h-8 w-8 rounded-xl text-pine-700 hover:text-pine-950 transition-colors hidden sm:flex"
              title="Toggle Expanded View"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="icon-box-3d h-8 w-8 rounded-xl text-pine-900/70 hover:text-red-700 transition-colors"
              title="Close Viewer (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Media Canvas Body */}
        <div className="relative flex-1 min-h-[340px] sm:min-h-[460px] bg-black/95 flex items-center justify-center overflow-hidden select-none">
          {isVideo ? (
            <video
              src={item.fileUrl.startsWith("/uploads/") ? `/api/media/stream?file=${encodeURIComponent(item.fileUrl)}` : item.fileUrl}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="max-h-[68vh] w-full object-contain"
            />
          ) : (
            <div className="relative h-[68vh] w-full">
              <Image
                src={item.fileUrl}
                alt={item.title}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>
          )}

          {/* Left Arrow */}
          {hasPrev && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-2xl icon-box-3d bg-white/90 text-pine-950 shadow-3d-btn flex items-center justify-center transition-all hover:scale-105 cursor-pointer z-10"
              aria-label="Previous item"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Right Arrow */}
          {hasNext && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-2xl icon-box-3d bg-white/90 text-pine-950 shadow-3d-btn flex items-center justify-center transition-all hover:scale-105 cursor-pointer z-10"
              aria-label="Next item"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Media Metadata & Caption Footer */}
        <div className="p-5 border-t border-pine-900/10 shrink-0 bg-white/95">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-black text-pine-950">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 text-xs text-pine-900/70 max-w-3xl leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-pine-900/60 font-medium">
              <span className="flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1">
                <Tag className="h-3 w-3 text-pine-700" />
                {item.category}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 font-mono">
                <HardDrive className="h-3 w-3 text-pine-700" />
                {formatBytes(item.fileSize)}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1">
                <Calendar className="h-3 w-3 text-pine-700" />
                {new Date(item.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
