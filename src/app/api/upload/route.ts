import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getCurrentUser } from "@/lib/auth";
import {
  ALLOWED_UPLOAD_EXTENSIONS,
  DANGEROUS_EXTENSIONS,
  generateSafeFileName,
  verifyMagicBytes,
} from "@/lib/security";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 mins

function getUploadDir(folder: string): string {
  const allowedFolders = ["news", "priorities", "gallery", "general"];
  const target = allowedFolders.includes(folder) ? folder : "general";
  const dir = path.resolve(process.cwd(), "public", "uploads", target);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.active) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Active administrative clearance required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") || req.headers.get("x-folder") || "general";
    const uploadDir = getUploadDir(folder);

    // 1. Chunked Upload Handling
    const uploadId = req.headers.get("x-upload-id");
    const chunkIndexStr = req.headers.get("x-chunk-index");
    const totalChunksStr = req.headers.get("x-total-chunks");

    if (uploadId && chunkIndexStr !== null && totalChunksStr !== null) {
      // Validate uploadId against path traversal
      const safeUploadId = uploadId.replace(/[^a-zA-Z0-9_-]/g, "");
      const chunkIndex = parseInt(chunkIndexStr, 10);
      const totalChunks = parseInt(totalChunksStr, 10);
      const rawFileName = req.headers.get("x-file-name") || "uploaded_media.bin";

      const ext = path.extname(rawFileName).toLowerCase();
      if (DANGEROUS_EXTENSIONS.has(ext) || !ALLOWED_UPLOAD_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { success: false, message: "Security violation: Upload of this file extension is strictly prohibited." },
          { status: 400 }
        );
      }

      const tempPath = path.join(uploadDir, `temp-${safeUploadId}.part`);
      const arrayBuffer = await req.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Verify magic bytes on the first chunk
      if (chunkIndex === 0 && !verifyMagicBytes(buffer, ext)) {
        return NextResponse.json(
          { success: false, message: "Security violation: File header magic bytes do not match declared extension." },
          { status: 400 }
        );
      }

      // Append chunk securely
      fs.appendFileSync(tempPath, buffer);

      if (chunkIndex >= totalChunks - 1) {
        // Last chunk received - finalize with safe UUID filename
        const finalFileName = generateSafeFileName(rawFileName);
        const finalPath = path.join(uploadDir, finalFileName);

        if (!finalPath.startsWith(uploadDir)) {
          return NextResponse.json({ success: false, message: "Path traversal detected." }, { status: 403 });
        }

        fs.renameSync(tempPath, finalPath);

        const stats = fs.statSync(finalPath);
        const fileUrl = `/uploads/${folder}/${finalFileName}`;

        return NextResponse.json({
          success: true,
          completed: true,
          url: fileUrl,
          fileName: finalFileName,
          fileSize: stats.size,
          message: "File successfully verified and uploaded.",
        });
      }

      return NextResponse.json({
        success: true,
        completed: false,
        chunkIndex,
        totalChunks,
      });
    }

    // 2. Direct Multipart FormData Upload
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetFolder = (formData.get("folder") as string) || folder;
    const resolvedDir = getUploadDir(targetFolder);

    if (!file) {
      return NextResponse.json({ success: false, message: "No file payload provided." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (DANGEROUS_EXTENSIONS.has(ext) || !ALLOWED_UPLOAD_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, message: "Security violation: Upload of this file extension is strictly prohibited." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify magic bytes
    if (!verifyMagicBytes(buffer, ext)) {
      return NextResponse.json(
        { success: false, message: "Security violation: File header magic bytes do not match declared extension." },
        { status: 400 }
      );
    }

    const finalFileName = generateSafeFileName(file.name);
    const finalPath = path.join(resolvedDir, finalFileName);

    if (!finalPath.startsWith(resolvedDir)) {
      return NextResponse.json({ success: false, message: "Path traversal detected." }, { status: 403 });
    }

    fs.writeFileSync(finalPath, buffer);

    const fileUrl = `/uploads/${targetFolder}/${finalFileName}`;

    return NextResponse.json({
      success: true,
      completed: true,
      url: fileUrl,
      fileName: finalFileName,
      fileSize: file.size,
      message: "File successfully verified and uploaded.",
    });
  } catch (error) {
    console.error("General upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "File upload failed due to a server error.",
      },
      { status: 500 }
    );
  }
}
