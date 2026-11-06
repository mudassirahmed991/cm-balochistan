import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

export const dynamic = "force-dynamic";

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const map: Record<string, string> = {
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".mkv": "video/x-matroska",
    ".avi": "video/x-msvideo",
    ".m4v": "video/mp4",
    ".3gp": "video/3gpp",
    ".wmv": "video/x-ms-wmv",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };
  return map[ext] || "application/octet-stream";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileParam = searchParams.get("file");

    if (!fileParam) {
      return new NextResponse("File parameter required", { status: 400 });
    }

    // Sanitize path to prevent directory traversal
    const cleanRelativePath = fileParam.replace(/^\/+/, "").replace(/\.\./g, "");
    const absolutePath = path.resolve(process.cwd(), "public", cleanRelativePath);
    const publicRoot = path.resolve(process.cwd(), "public");

    if (!absolutePath.startsWith(publicRoot)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (!fs.existsSync(absolutePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const stat = fs.statSync(absolutePath);
    const fileSize = stat.size;
    const mimeType = getMimeType(absolutePath);

    const range = req.headers.get("range");

    if (range) {
      // Parse Range header (e.g. "bytes=0-1048576" or "bytes=5000000-")
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + 5 * 1024 * 1024 - 1, fileSize - 1);

      if (isNaN(start) || start >= fileSize || (parts[1] && isNaN(end)) || start > end) {
        return new NextResponse("Requested range not satisfiable", {
          status: 416,
          headers: {
            "Content-Range": `bytes */${fileSize}`,
          },
        });
      }

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(absolutePath, { start, end });
      // Convert Node readable stream to Web ReadableStream
      const webStream = Readable.toWeb(fileStream);

      return new NextResponse(webStream as unknown as BodyInit, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": mimeType,
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    } else {
      // Initial or full response
      const fileStream = fs.createReadStream(absolutePath);
      const webStream = Readable.toWeb(fileStream);

      return new NextResponse(webStream as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": mimeType,
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    }
  } catch (error) {
    console.error("Media stream error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
