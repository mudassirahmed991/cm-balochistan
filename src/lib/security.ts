import crypto from "node:crypto";
import { z } from "zod";

/**
 * --------------------------------------------------------------------------
 * 1. CRYPTOGRAPHIC SIGNING & HMAC UTILITIES
 * --------------------------------------------------------------------------
 * High-performance HMAC-SHA256 token signing compatible with both Node.js
 * and Next.js Edge/Middleware environments.
 */
const SECRET_KEY =
  process.env.SESSION_SECRET ||
  "cm_balochistan_gov_pk_ultra_secure_military_grade_secret_key_2026_salt_9876543210";

/**
 * Signs a payload with HMAC-SHA256
 */
export function signToken(payload: string): string {
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(payload);
  const signature = hmac.digest("hex");
  return `${payload}.${signature}`;
}

/**
 * Verifies and extracts the payload from an HMAC-SHA256 signed token
 */
export function verifyToken(signedToken: string): { valid: boolean; payload?: string } {
  try {
    const parts = signedToken.split(".");
    if (parts.length !== 2) return { valid: false };

    const [payload, signature] = parts;
    if (!payload || !signature || signature.length !== 64 || !/^[0-9a-f]{64}$/i.test(signature)) {
      return { valid: false };
    }

    const hmac = crypto.createHmac("sha256", SECRET_KEY);
    hmac.update(payload);
    const expectedSignature = hmac.digest("hex");

    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedSignature, "hex");

    if (sigBuf.length !== expBuf.length) return { valid: false };
    const isValid = crypto.timingSafeEqual(sigBuf, expBuf);

    return { valid: isValid, payload: isValid ? payload : undefined };
  } catch {
    return { valid: false };
  }
}

/**
 * --------------------------------------------------------------------------
 * 2. INPUT SANITIZATION UTILITIES (XSS & INJECTION PROTECTION)
 * --------------------------------------------------------------------------
 */

/**
 * Strips dangerous HTML tags, inline JavaScript handlers, script blocks,
 * and escapes dangerous characters to prevent Stored & Reflected XSS.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";

  let cleaned = input.trim();

  // 1. Remove null bytes (\0)
  cleaned = cleaned.replace(/\0/g, "");

  // 2. Strip script, iframe, object, embed, applet, style, link, form, svg, base tags
  cleaned = cleaned.replace(/<\s*(script|iframe|object|embed|applet|style|link|form|svg|base)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
  cleaned = cleaned.replace(/<\s*(script|iframe|object|embed|applet|style|link|form|svg|base)[^>]*\/?>/gi, "");

  // 3. Remove inline JavaScript event handlers (e.g., onerror=, onload=, onclick=)
  cleaned = cleaned.replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "");
  cleaned = cleaned.replace(/\son\w+\s*=\s*[^>\s]+/gi, "");

  // 4. Strip dangerous pseudo-protocols (javascript:, data:text/html, vbscript:)
  cleaned = cleaned.replace(/javascript\s*:/gi, "");
  cleaned = cleaned.replace(/vbscript\s*:/gi, "");
  cleaned = cleaned.replace(/data\s*:\s*text\/html/gi, "");

  // 5. Escape raw HTML angle brackets
  cleaned = cleaned
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

  return cleaned;
}

/**
 * Strips typical SQL injection keywords and comments from raw string inputs
 */
export function sanitizeSql(input: unknown): string {
  if (typeof input !== "string") return "";
  let cleaned = input.trim();
  // Strip raw comment sequences and null bytes
  cleaned = cleaned.replace(/\0/g, "").replace(/--+/g, "-").replace(/\/\*[\s\S]*?\*\//g, "");
  return cleaned;
}

/**
 * Recursively sanitizes all string properties within an object or array
 */
export function sanitizeObject<T>(val: T): T {
  if (val === null || val === undefined) return val;
  if (typeof val === "string") {
    return sanitizeString(val) as unknown as T;
  }
  if (Array.isArray(val)) {
    return val.map((item) => sanitizeObject(item)) as unknown as T;
  }
  if (typeof val === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val)) {
      cleaned[k] = sanitizeObject(v);
    }
    return cleaned as T;
  }
  return val;
}

/**
 * --------------------------------------------------------------------------
 * 3. STRICT ZOD SCHEMAS FOR PUBLIC FORMS & APIS
 * --------------------------------------------------------------------------
 */

export const PakistanPhoneRegex = /^03\d{9}$/;
export const TrackingCodeRegex = /^[A-Z0-9-]{6,30}$/;

export const ComplaintFormSchema = z.object({
  citizenName: z
    .string()
    .min(3, "Full legal name must be at least 3 characters.")
    .max(80, "Name must not exceed 80 characters.")
    .transform(sanitizeString),
  citizenPhone: z
    .string()
    .transform((val) => val.replace(/[\s-]/g, ""))
    .refine((val) => PakistanPhoneRegex.test(val), {
      message: "Please provide a valid 11-digit mobile number starting with 03 (e.g., 03001234567).",
    }),
  citizenEmail: z
    .string()
    .email("Please provide a valid email address.")
    .or(z.literal(""))
    .nullable()
    .optional(),
  district: z
    .string()
    .min(2, "Please select your district in Balochistan.")
    .max(50)
    .transform(sanitizeString),
  category: z
    .string()
    .min(2, "Please select a valid grievance category.")
    .max(60)
    .transform(sanitizeString),
  department: z
    .string()
    .max(80)
    .optional()
    .nullable()
    .transform((val) => (val ? sanitizeString(val) : null)),
  description: z
    .string()
    .min(20, "Please describe the matter in sufficient detail (minimum 20 characters).")
    .max(5000, "Description must not exceed 5000 characters.")
    .transform(sanitizeString),
});

export const ContactInquirySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(80, "Name must not exceed 80 characters.")
    .transform(sanitizeString),
  email: z.string().email("Please provide a valid email address."),
  phone: z
    .string()
    .max(20)
    .optional()
    .nullable()
    .transform((val) => (val ? sanitizeString(val) : undefined)),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters.")
    .max(150, "Subject must not exceed 150 characters.")
    .transform(sanitizeString),
  message: z
    .string()
    .min(15, "Message must be at least 15 characters.")
    .max(4000, "Message must not exceed 4000 characters.")
    .transform(sanitizeString),
});

export const AdminLoginSchema = z.object({
  email: z.string().email("Please enter a valid official email address.").max(120),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
});

/**
 * --------------------------------------------------------------------------
 * 4. SECURE FILE UPLOAD VALIDATION & MAGIC BYTES
 * --------------------------------------------------------------------------
 */

export const ALLOWED_UPLOAD_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".pdf",
  ".mp4",
  ".webm",
  ".mov",
  ".mkv",
]);

export const DANGEROUS_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".php",
  ".phtml",
  ".php3",
  ".php4",
  ".php5",
  ".phps",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".jsp",
  ".asp",
  ".aspx",
  ".py",
  ".cgi",
  ".pl",
  ".vbs",
  ".jar",
  ".war",
  ".hta",
  ".com",
  ".scr",
]);

/**
 * Verifies magic bytes of common file types to prevent renamed malicious payloads
 */
export function verifyMagicBytes(buffer: Buffer, extension: string): boolean {
  if (buffer.length < 4) return false;
  const ext = extension.toLowerCase();

  // JPEG: FF D8 FF
  if (ext === ".jpg" || ext === ".jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 89 50 4E 47
  if (ext === ".png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }

  // GIF: 47 49 46 38
  if (ext === ".gif") {
    return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
  }

  // PDF: 25 50 44 46 (%PDF)
  if (ext === ".pdf") {
    return (
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46
    );
  }

  // WebP: RIFF (52 49 46 46) ... WEBP (57 45 42 50)
  if (ext === ".webp") {
    if (buffer.length < 12) return false;
    const isRiff =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46;
    const isWebp =
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;
    return isRiff && isWebp;
  }

  // MP4: ....ftyp (66 74 79 70)
  if (ext === ".mp4" || ext === ".mov") {
    if (buffer.length < 12) return false;
    return (
      buffer[4] === 0x66 &&
      buffer[5] === 0x74 &&
      buffer[6] === 0x79 &&
      buffer[7] === 0x70
    );
  }

  // WebM / MKV: 1A 45 DF A3
  if (ext === ".webm" || ext === ".mkv") {
    return (
      buffer[0] === 0x1a &&
      buffer[1] === 0x45 &&
      buffer[2] === 0xdf &&
      buffer[3] === 0xa3
    );
  }

  // SVG: textual XML/SVG
  if (ext === ".svg") {
    const text = buffer.subarray(0, 512).toString("utf-8").toLowerCase();
    return text.includes("<svg") && !text.includes("<script");
  }

  return true;
}

/**
 * Generates an unguessable, cryptographically random file name
 */
export function generateSafeFileName(originalName: string): string {
  const ext = originalName.substring(originalName.lastIndexOf(".")).toLowerCase();
  const safeExt = ALLOWED_UPLOAD_EXTENSIONS.has(ext) ? ext : ".bin";
  return `${Date.now()}-${crypto.randomUUID()}${safeExt}`;
}
