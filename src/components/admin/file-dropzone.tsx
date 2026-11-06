"use client";

import { useState, useRef, useCallback } from "react";
import {
  UploadCloud,
  FileVideo,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";

interface FileDropzoneProps {
  name: string;
  label: string;
  accept?: string;
  folder?: "news" | "priorities" | "gallery" | "general";
  initialUrl?: string | null;
  helpText?: string;
  mediaType?: "image" | "video" | "any";
}

export function FileDropzone({
  name,
  label,
  accept = "image/*",
  folder = "general",
  initialUrl = null,
  helpText,
  mediaType = "any",
}: FileDropzoneProps) {
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl || "");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speedMB, setSpeedMB] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  const isVideoUrl = (url: string) => {
    return /\.(mp4|webm|mov|mkv|avi|m4v|3gp|wmv|flv)$/i.test(url) || mediaType === "video";
  };

  const uploadFile = useCallback(
    async (file: File) => {
      setStatusMessage(null);
      setUploading(true);
      setProgress(0);
      setUploadedBytes(0);
      setTotalBytes(file.size);

      try {
        const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const uploadId = `up-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        let startTime = Date.now();
        let lastLoaded = 0;

        for (let i = 0; i < totalChunks; i++) {
          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunk = file.slice(start, end);

          const res = await fetch(`/api/upload?folder=${folder}`, {
            method: "POST",
            headers: {
              "x-upload-id": uploadId,
              "x-chunk-index": i.toString(),
              "x-total-chunks": totalChunks.toString(),
              "x-file-name": encodeURIComponent(file.name),
              "x-mime-type": file.type || "application/octet-stream",
              "x-folder": folder,
            },
            body: chunk,
          });

          if (!res.ok) {
            throw new Error(`Upload failed at part ${i + 1} of ${totalChunks}`);
          }

          const data = await res.json();

          const now = Date.now();
          const elapsedSec = (now - startTime) / 1000;
          if (elapsedSec > 0.5) {
            const bytesSince = end - lastLoaded;
            setSpeedMB(bytesSince / elapsedSec / (1024 * 1024));
            startTime = now;
            lastLoaded = end;
          }

          const currentPct = Math.round((end / file.size) * 100);
          setProgress(currentPct);
          setUploadedBytes(end);

          if (data.completed && data.url) {
            setCurrentUrl(data.url);
            setStatusMessage({ type: "success", text: "File successfully uploaded and ready." });
            setUploading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Upload error:", err);
        setStatusMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Failed to upload file. Please try again.",
        });
        setUploading(false);
      }
    },
    [folder]
  );

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
      uploadFile(e.dataTransfer.files[0]);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold tracking-wider text-pine-900/70 uppercase">
          {label}
        </label>
        {helpText && <span className="text-[10px] text-pine-900/50">{helpText}</span>}
      </div>

      {/* Hidden input storing the uploaded file path */}
      <input type="hidden" name={name} value={currentUrl} />

      {/* When media already exists or was uploaded */}
      {currentUrl ? (
        <div className="relative rounded-2xl glass-card-3d p-3 border border-pine-900/15 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Preview Box */}
            <div className="relative h-28 w-44 rounded-xl overflow-hidden bg-black/80 flex items-center justify-center shrink-0 border border-black/20">
              {isVideoUrl(currentUrl) ? (
                <video
                  src={currentUrl}
                  controls
                  className="h-full w-full object-contain"
                  preload="metadata"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={currentUrl}
                  alt="Uploaded media"
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Info and Actions */}
            <div className="flex-1 min-w-0 text-left w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  Media Attached
                </span>
                <span className="text-[10px] font-mono text-pine-900/50 truncate">
                  {isVideoUrl(currentUrl) ? "Video File" : "Image Asset"}
                </span>
              </div>
              <p className="mt-1 text-xs font-mono text-pine-950 truncate max-w-sm">
                {currentUrl}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-3d-glass rounded-xl px-3 py-1.5 text-xs font-bold gap-1.5 text-pine-950"
                >
                  <UploadCloud className="h-3.5 w-3.5 text-pine-700" />
                  Replace File
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentUrl("")}
                  className="rounded-xl px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 cursor-pointer ${
            dragActive
              ? "border-emerald-500 bg-emerald-50/50 scale-[1.01]"
              : "border-pine-900/20 hover:border-pine-900/40 bg-white/40 hover:bg-white/80"
          } ${uploading ? "pointer-events-none opacity-90" : ""}`}
        >
          {uploading ? (
            <div className="space-y-3 py-2">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-pine-950">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                <span>Uploading High-Def Media... ({progress}%)</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md mx-auto h-2.5 rounded-full bg-pine-900/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between max-w-md mx-auto text-[10px] text-pine-900/60 font-mono">
                <span>{formatBytes(uploadedBytes)} of {formatBytes(totalBytes)}</span>
                <span>{speedMB > 0 ? `${speedMB.toFixed(1)} MB/s` : "Processing"}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="h-12 w-12 rounded-2xl icon-box-3d bg-pine-50 text-pine-800 flex items-center justify-center shadow-sm">
                {mediaType === "video" ? (
                  <FileVideo className="h-6 w-6 text-amber-600" />
                ) : (
                  <UploadCloud className="h-6 w-6 text-emerald-700" />
                )}
              </div>
              <p className="text-xs font-bold text-pine-950">
                Drag and drop your file here, or <span className="text-emerald-700 underline">browse</span>
              </p>
              <p className="text-[10px] text-pine-900/50">
                Supports {accept.includes("video") ? "high-definition videos (MP4, WEBM, MOV) and " : ""}high-resolution photos (JPG, PNG, WEBP). Any file size supported.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error or Success notification */}
      {statusMessage && (
        <div
          className={`rounded-xl p-2.5 text-xs flex items-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}
