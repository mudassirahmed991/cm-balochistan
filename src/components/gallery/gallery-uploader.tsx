"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  UploadCloud,
  FileVideo,
  FileImage,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Sparkles,
  ArrowRight,
  HardDrive,
} from "lucide-react";

export const GALLERY_CATEGORIES = [
  "Official Events",
  "Cabinet Meetings",
  "Development Projects",
  "Public Welfare",
  "District Visits",
  "General",
];

interface GalleryUploaderProps {
  onUploadSuccess?: () => void;
  className?: string;
  isCompact?: boolean;
}

export function GalleryUploader({ onUploadSuccess, className = "" }: GalleryUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Official Events");
  const [description, setDescription] = useState("");

  // Upload Status
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [speedMB, setSpeedMB] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size nicely
  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Handle file selection
  const handleFile = useCallback((file: File) => {
    setErrorMessage("");
    setSuccessMessage("");
    setSelectedFile(file);

    const isVid =
      file.type.startsWith("video/") ||
      /\.(mp4|webm|mov|mkv|avi|m4v|3gp|wmv|flv)$/i.test(file.name);
    setIsVideo(isVid);

    // Auto-generate title from filename
    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    setTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));

    // Preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }

  function resetForm() {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setTitle("");
    setDescription("");
    setProgress(0);
    setUploadedBytes(0);
    setTotalBytes(0);
    setSpeedMB(0);
    setStatusText("");
    setUploading(false);
  }

  // Chunked Upload logic to effortlessly support ANY size video / image without browser limits
  async function startUpload() {
    if (!selectedFile) return;

    setUploading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setProgress(0);

    const file = selectedFile;
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB chunks
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = `upl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    setTotalBytes(file.size);
    setStatusText("Preparing file upload...");

    let uploaded = 0;

    try {
      // If file is smaller than 10MB, we can send as single request
      if (file.size <= 10 * 1024 * 1024) {
        setStatusText("Uploading media file...");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("category", category);
        formData.append("description", description);

        const res = await fetch("/api/gallery/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Upload failed.");
        }

        setProgress(100);
        setUploadedBytes(file.size);
        setSuccessMessage(data.message || "File uploaded successfully!");
        setUploading(false);
        resetForm();
        if (onUploadSuccess) onUploadSuccess();
        return;
      }

      // Large file: Chunked upload slice by slice
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        setStatusText(`Uploading chunk ${chunkIndex + 1} of ${totalChunks}...`);

        const chunkStartTime = Date.now();

        const res = await fetch("/api/gallery/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "x-upload-id": uploadId,
            "x-chunk-index": chunkIndex.toString(),
            "x-total-chunks": totalChunks.toString(),
            "x-file-name": encodeURIComponent(file.name),
            "x-mime-type": file.type || (isVideo ? "video/mp4" : "image/jpeg"),
            "x-title": encodeURIComponent(title),
            "x-category": encodeURIComponent(category),
            "x-description": encodeURIComponent(description),
          },
          body: chunk,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Failed uploading chunk ${chunkIndex + 1}`);
        }

        const chunkData = await res.json();

        uploaded += chunk.size;
        setUploadedBytes(uploaded);
        const currentProgress = Math.min(Math.round((uploaded / file.size) * 100), 99);
        setProgress(currentProgress);

        // Calculate speed
        const chunkDuration = (Date.now() - chunkStartTime) / 1000;
        if (chunkDuration > 0) {
          const speed = chunk.size / (1024 * 1024) / chunkDuration;
          setSpeedMB(parseFloat(speed.toFixed(1)));
        }

        if (chunkIndex === totalChunks - 1 && chunkData.completed) {
          setProgress(100);
          setStatusText("Upload complete!");
          setSuccessMessage(chunkData.message || "Media uploaded successfully!");
          setUploading(false);
          resetForm();
          if (onUploadSuccess) onUploadSuccess();
          return;
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to upload file. Please try again.");
      setUploading(false);
      setStatusText("");
    }
  }

  return (
    <div className={`rounded-3xl glass-card-3d p-6 sm:p-8 shadow-3d-card border border-white/95 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-pine-900/10 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-700 uppercase tracking-wider mb-1">
            <UploadCloud className="h-4 w-4 text-emerald-600" />
            Direct Media Ingestion
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-black text-pine-950">
            Upload Photos & Videos
          </h3>
          <p className="text-xs text-pine-900/60 mt-0.5">
            Direct drag & drop or browse from PC. Supports ultra high-definition 4K videos & images without size limits.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-900 px-3 py-1 text-[10px] font-bold border border-emerald-300">
            <Sparkles className="h-3 w-3 text-emerald-600" />
            Direct PC Upload
          </span>
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {/* DRAG & DROP ZONE (When no file selected) */}
      {!selectedFile && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center ${
            dragActive
              ? "border-emerald-600 bg-emerald-50/80 scale-[1.01] shadow-3d-btn"
              : "border-pine-900/20 hover:border-emerald-600/60 hover:bg-white/90 hover:shadow-soft"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="h-16 w-16 rounded-2xl icon-box-3d flex items-center justify-center text-pine-800 mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <UploadCloud className="h-8 w-8 text-pine-700" />
          </div>

          <h4 className="font-display text-base sm:text-lg font-bold text-pine-950">
            Drag and drop images or videos here
          </h4>
          <p className="text-xs text-pine-900/60 mt-1 max-w-md">
            or <span className="text-emerald-700 font-bold underline">click to browse from your computer</span>
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] text-pine-900/50">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mist/90 px-3 py-1 font-semibold border border-pine-900/10">
              <FileImage className="h-3.5 w-3.5 text-pine-700" />
              JPG, PNG, WebP, SVG, GIF
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mist/90 px-3 py-1 font-semibold border border-pine-900/10">
              <FileVideo className="h-3.5 w-3.5 text-amber-600" />
              MP4, WebM, MOV, MKV, AVI
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 px-3 py-1 font-bold border border-emerald-200">
              <HardDrive className="h-3.5 w-3.5 text-emerald-600" />
              Any file size (Chunked streaming)
            </span>
          </div>
        </div>
      )}

      {/* SELECTED FILE PREVIEW & FORM */}
      {selectedFile && (
        <div className="space-y-6">
          <div className="rounded-2xl glass-panel-3d p-4 border border-white/90 flex flex-col sm:flex-row items-center gap-5">
            {/* Thumbnail / Video Preview */}
            <div className="relative h-28 w-44 rounded-xl overflow-hidden image-3d-frame shrink-0 bg-black/90 flex items-center justify-center">
              {isVideo ? (
                previewUrl ? (
                  <video
                    src={previewUrl}
                    className="h-full w-full object-cover"
                    controls={false}
                    muted
                  />
                ) : (
                  <FileVideo className="h-10 w-10 text-gold-300" />
                )
              ) : previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Upload preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <FileImage className="h-10 w-10 text-emerald-400" />
              )}

              <span
                className={`absolute top-2 left-2 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white ${
                  isVideo ? "bg-amber-600" : "bg-emerald-600"
                }`}
              >
                {isVideo ? "VIDEO" : "PHOTO"}
              </span>
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-sm text-pine-950 truncate">{selectedFile.name}</p>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={uploading}
                  className="icon-box-3d h-7 w-7 rounded-lg text-pine-900/60 hover:text-red-700 transition-colors shrink-0"
                  title="Remove selected file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-pine-900/60 mt-0.5 font-mono">
                {formatBytes(selectedFile.size)} · {selectedFile.type || "binary"}
              </p>

              {/* Progress Bar (Visible while uploading) */}
              {uploading && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-pine-950">
                    <span className="flex items-center gap-1.5 text-emerald-800">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {statusText}
                    </span>
                    <span className="font-mono">{progress}%</span>
                  </div>

                  <div className="h-2.5 w-full rounded-full bg-pine-900/10 overflow-hidden p-0.5 border border-pine-900/15">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-gold-400 transition-all duration-200 shadow-sm"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-pine-900/50 font-mono">
                    <span>
                      {formatBytes(uploadedBytes)} of {formatBytes(totalBytes)}
                    </span>
                    {speedMB > 0 && <span>{speedMB} MB/s</span>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-pine-900/60 uppercase">
                Media Title / Caption
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
                placeholder="e.g. Chief Minister Chairs High-Level Provincial Security Review"
                className="w-full rounded-xl glass-input-3d px-4 py-3 text-xs sm:text-sm text-pine-950 placeholder:text-pine-900/35"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-pine-900/60 uppercase">
                Official Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={uploading}
                className="w-full rounded-xl glass-input-3d px-4 py-3 text-xs sm:text-sm text-pine-950"
              >
                {GALLERY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-pine-900/60 uppercase">
                Media Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
                placeholder="Brief summary or context..."
                className="w-full rounded-xl glass-input-3d px-4 py-3 text-xs sm:text-sm text-pine-950 placeholder:text-pine-900/35"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-pine-900/10">
            <button
              type="button"
              onClick={resetForm}
              disabled={uploading}
              className="btn-3d-glass rounded-xl px-5 py-2.5 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={startUpload}
              disabled={uploading || !title.trim()}
              className="btn-3d-emerald rounded-xl px-7 py-3 text-xs font-bold gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading {isVideo ? "Video" : "Photo"}...
                </>
              ) : (
                <>
                  Confirm & Upload to Gallery
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
