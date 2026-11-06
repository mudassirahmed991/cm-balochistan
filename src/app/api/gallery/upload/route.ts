import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes timeout for huge uploads

// Directory for uploads
const UPLOAD_DIR = path.resolve(process.cwd(), "public", "uploads", "gallery");

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function isVideoFile(fileName: string, mimeType: string): boolean {
  if (mimeType.startsWith("video/")) return true;
  const ext = path.extname(fileName).toLowerCase();
  return [".mp4", ".webm", ".mov", ".mkv", ".avi", ".m4v", ".3gp", ".wmv", ".flv"].includes(ext);
}

export async function POST(req: NextRequest) {
  try {
    ensureUploadDir();

    // Check if this is a chunked upload
    const uploadId = req.headers.get("x-upload-id");
    const chunkIndexStr = req.headers.get("x-chunk-index");
    const totalChunksStr = req.headers.get("x-total-chunks");

    if (uploadId && chunkIndexStr !== null && totalChunksStr !== null) {
      // ===== CHUNKED UPLOAD HANDLER (For massive files of any size) =====
      const chunkIndex = parseInt(chunkIndexStr, 10);
      const totalChunks = parseInt(totalChunksStr, 10);

      const rawFileName = req.headers.get("x-file-name") || "uploaded_media";
      const cleanFileName = sanitizeFileName(rawFileName);
      const mimeType = req.headers.get("x-mime-type") || "application/octet-stream";
      const title = decodeURIComponent(req.headers.get("x-title") || cleanFileName);
      const category = decodeURIComponent(req.headers.get("x-category") || "General");
      const description = decodeURIComponent(req.headers.get("x-description") || "");

      const tempPath = path.join(UPLOAD_DIR, `temp-${uploadId}.part`);

      // Read chunk binary data
      const arrayBuffer = await req.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Append chunk to temp file
      fs.appendFileSync(tempPath, buffer);

      // Check if all chunks received
      if (chunkIndex >= totalChunks - 1) {
        // Last chunk received - finalize file
        const finalFileName = `${Date.now()}-${cleanFileName}`;
        const finalPath = path.join(UPLOAD_DIR, finalFileName);

        fs.renameSync(tempPath, finalPath);

        const stats = fs.statSync(finalPath);
        const isVideo = isVideoFile(cleanFileName, mimeType);
        const fileUrl = `/uploads/gallery/${finalFileName}`;

        // Create record in SQLite DB
        const item = db.gallery.create({
          title,
          description: description || null,
          type: isVideo ? "VIDEO" : "IMAGE",
          fileUrl,
          thumbnailUrl: isVideo ? null : fileUrl,
          fileName: finalFileName,
          fileSize: stats.size,
          mimeType,
          category,
          isFeatured: 0,
          sortOrder: 0,
        });

        // Audit log
        try {
          const user = await getCurrentUser();
          db.audit.log({
            userId: user?.id,
            action: "CREATE",
            entity: "GalleryItem",
            entityId: item.id,
            details: `Direct uploaded ${isVideo ? "video" : "image"}: "${title}" (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`,
          });
        } catch {
          // Non-critical audit
        }

        return NextResponse.json({
          success: true,
          completed: true,
          item,
          message: `${isVideo ? "Video" : "Photo"} successfully uploaded and added to the gallery.`,
        });
      }

      // Chunk successfully received, awaiting remaining chunks
      return NextResponse.json({
        success: true,
        completed: false,
        chunkIndex,
        totalChunks,
      });
    }

    // ===== DIRECT MULTIPART FORMDATA HANDLER =====
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided." }, { status: 400 });
    }

    const title = (formData.get("title") as string) || file.name;
    const category = (formData.get("category") as string) || "General";
    const description = (formData.get("description") as string) || "";
    const isFeatured = formData.get("isFeatured") === "1" ? 1 : 0;

    const cleanFileName = sanitizeFileName(file.name);
    const finalFileName = `${Date.now()}-${cleanFileName}`;
    const finalPath = path.join(UPLOAD_DIR, finalFileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(finalPath, buffer);

    const isVideo = isVideoFile(file.name, file.type);
    const fileUrl = `/uploads/gallery/${finalFileName}`;

    const item = db.gallery.create({
      title,
      description: description || null,
      type: isVideo ? "VIDEO" : "IMAGE",
      fileUrl,
      thumbnailUrl: isVideo ? null : fileUrl,
      fileName: finalFileName,
      fileSize: file.size,
      mimeType: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
      category,
      isFeatured,
      sortOrder: 0,
    });

    // Audit log
    try {
      const user = await getCurrentUser();
      db.audit.log({
        userId: user?.id,
        action: "CREATE",
        entity: "GalleryItem",
        entityId: item.id,
        details: `Direct uploaded ${isVideo ? "video" : "image"}: "${title}" (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
      });
    } catch {
      // Non-critical audit
    }

    return NextResponse.json({
      success: true,
      completed: true,
      item,
      message: `${isVideo ? "Video" : "Photo"} successfully uploaded and added to the gallery.`,
    });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to upload file.",
      },
      { status: 500 }
    );
  }
}
