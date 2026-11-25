#!/usr/bin/env node
/**
 * Idempotent importer & media verifier for the Chief Minister Balochistan
 * WordPress SQL export (`news_posts.json`, `gallery_images.json`,
 * `news_categories.json`, `image_urls.csv`).
 *
 * Guarantees:
 * - Creates a timestamped backup of data/dev.db before any write.
 * - Never deletes or overwrites existing NewsArticle or GalleryItem rows.
 * - Deduplicates posts by slug and images by fileUrl/fileName.
 * - Only sets NewsArticle.coverImageUrl or inserts GalleryItem rows when
 *   the image file actually exists locally under public/ or responds 200 OK.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DatabaseSync } from "node:sqlite";

const DEFAULT_DATA_DIR =
  "C:/Users/DELL/.gemini/antigravity/brain/89e588b0-a8c7-4ecb-a7e2-0073553ef9aa/.user_uploaded";

const args = process.argv.slice(2);
function getArg(name, fallback) {
  const idx = args.indexOf(name);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return fallback;
}
const DRY_RUN = args.includes("--dry-run");
const SKIP_REMOTE_VERIFY = args.includes("--skip-remote-verify");

const postsFile = getArg("--posts", path.join(DEFAULT_DATA_DIR, "media_1795603197206_c726e440.json"));
const galleryFile = getArg("--gallery", path.join(DEFAULT_DATA_DIR, "media_1795603197206_5f8d89b1.json"));
const categoriesFile = getArg("--categories", path.join(DEFAULT_DATA_DIR, "media_1795603196611_cbced402.json"));
const csvFile = getArg("--csv", path.join(DEFAULT_DATA_DIR, "media_1795603197142_3774f049.csv"));

const cwd = process.cwd();
const dbPath = path.resolve(cwd, "data", "dev.db");
const publicDir = path.resolve(cwd, "public");

function decodeHtmlEntities(str) {
  if (!str) return "";
  const named = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&rsquo;": "\u2019",
    "&lsquo;": "\u2018",
    "&rdquo;": "\u201D",
    "&ldquo;": "\u201C",
    "&ndash;": "\u2013",
    "&mdash;": "\u2014",
    "&hellip;": "...",
  };
  return str
    .replace(/\u00a0/g, " ")
    .replace(/&(nbsp|amp|lt|gt|quot|apos|rsquo|lsquo|rdquo|ldquo|ndash|mdash|hellip);|&#(\d+);|&#x([0-9a-f]+);/gi, (m, name, dec, hex) => {
      if (name) return named[`&${name.toLowerCase()};`] ?? m;
      if (dec) return String.fromCodePoint(Number(dec));
      if (hex) return String.fromCodePoint(parseInt(hex, 16));
      return m;
    });
}

function cleanTitle(raw) {
  return decodeHtmlEntities(raw || "").replace(/\s+/g, " ").trim();
}

function extractParagraphsFromHtml(html) {
  if (!html || !html.trim()) return [];
  const withoutCommentsAndHidden = html
    .replace(/<!--[\s\S]*?-->/g, "\n")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<video[\s\S]*?<\/video>/gi, " ")
    .replace(/<img[^>]*>/gi, " ");

  const withBreaks = withoutCommentsAndHidden
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|pre|li|blockquote|figcaption|figure)>/gi, "\n\n");

  const stripped = decodeHtmlEntities(withBreaks.replace(/<[^>]+>/g, " "));
  const blocks = stripped
    .split(/\n{2,}/)
    .map((b) => b.replace(/[ \t\r\n]+/g, " ").trim())
    .filter((b) => b.length > 0 && !/^blob:https?:/i.test(b));

  const deduped = [];
  for (const b of blocks) {
    if (deduped[deduped.length - 1] !== b) deduped.push(b);
  }
  return deduped;
}

function mapWpCategoriesToNewsCategory(wpCategories) {
  const names = (wpCategories || []).map((c) => (c.name || "").trim().toUpperCase());
  const specific = names.filter((n) => n && n !== "UNCATEGORIZED");
  const primary = specific[0] || names[0] || "UNCATEGORIZED";

  switch (primary) {
    case "ASSEMBLY SESSIONS":
      return "Policy Announcements";
    case "CABINET MEETINGS":
    case "MEETINGS/BRIEFINGS":
    case "MEETINGS WITH DELEGATIONS":
    case "MEETINGS WITH FOREIGN DELEGATIONS":
      return "Official Meetings";
    case "TOURS AND VISITS":
    case "ATTENDED CEREMONIES/FUNCTIONS":
      return "Visits and Events";
    case "CONDOLES":
    case "UNCATEGORIZED":
    default:
      return "Press Releases";
  }
}

function mapWpCategoriesToGalleryCategory(wpCategories) {
  const names = (wpCategories || []).map((c) => (c.name || "").trim().toUpperCase());
  const specific = names.filter((n) => n && n !== "UNCATEGORIZED");
  const primary = specific[0] || names[0] || "UNCATEGORIZED";

  switch (primary) {
    case "CABINET MEETINGS":
      return "Cabinet Meetings";
    case "TOURS AND VISITS":
      return "District Visits";
    case "ASSEMBLY SESSIONS":
    case "ATTENDED CEREMONIES/FUNCTIONS":
    case "MEETINGS/BRIEFINGS":
    case "MEETINGS WITH DELEGATIONS":
    case "MEETINGS WITH FOREIGN DELEGATIONS":
      return "Official Events";
    default:
      return "General";
  }
}

function toIsoDate(wpDateStr) {
  if (!wpDateStr) return new Date().toISOString();
  const normalized = wpDateStr.trim().replace(" ", "T");
  const parsed = new Date(normalized.includes("Z") || normalized.includes("+") ? normalized : `${normalized}+05:00`);
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString();
  return parsed.toISOString();
}

function computeReadTime(text) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function truncateAtWord(text, maxLen = 220) {
  if (!text || text.length <= maxLen) return text;
  const slice = text.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > 80 ? slice.slice(0, lastSpace) : slice).trim() + "...";
}

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQ = !inQ;
      }
    } else if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function stripWpSizeSuffix(url) {
  return url.replace(/-\d+x\d+(?=\.(jpe?g|png|webp|gif)$)/i, "");
}

function toLocalPublicPathIfCmWpUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname === "cm.balochistan.gob.pk" && u.pathname.startsWith("/wp-content/uploads/")) {
      return {
        publicRelUrl: u.pathname,
        diskPath: path.join(publicDir, u.pathname.replace(/^\/+/, "")),
      };
    }
  } catch {
    // Not a full URL
  }
  return null;
}

async function resolveWorkingImageUrl(candidateUrl, remoteCache) {
  if (!candidateUrl || typeof candidateUrl !== "string") return null;
  if (/^blob:/i.test(candidateUrl)) return null;
  if (candidateUrl.includes("demo.wphash.com")) return null;
  if (/\.svg(\?|$)/i.test(candidateUrl)) return null;

  // 1. Prefer verified local file if under public/wp-content/uploads/
  const localInfo = toLocalPublicPathIfCmWpUrl(candidateUrl);
  if (localInfo) {
    if (fs.existsSync(localInfo.diskPath)) {
      const stat = fs.statSync(localInfo.diskPath);
      if (stat.isFile() && stat.size > 0) {
        return { url: localInfo.publicRelUrl, fileSize: stat.size };
      }
    }
  }

  if (SKIP_REMOTE_VERIFY) return null;

  // 2. Check remote HTTP reachability (with deduplicated cache)
  if (remoteCache.has(candidateUrl)) {
    return remoteCache.get(candidateUrl);
  }

  let verified = null;
  try {
    const res = await fetch(candidateUrl, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(5000) });
    const ct = res.headers.get("content-type") || "";
    const cl = Number(res.headers.get("content-length") || "0");
    if (res.ok && ct.startsWith("image/")) {
      verified = { url: localInfo ? localInfo.publicRelUrl : candidateUrl, fileSize: cl };
    }
  } catch {
    verified = null;
  }
  remoteCache.set(candidateUrl, verified);
  return verified;
}

async function main() {
  const postsData = JSON.parse(fs.readFileSync(postsFile, "utf8"));
  const galleryData = JSON.parse(fs.readFileSync(galleryFile, "utf8"));
  const categoriesData = JSON.parse(fs.readFileSync(categoriesFile, "utf8"));
  const csvRaw = fs.readFileSync(csvFile, "utf8").trim().split(/\r?\n/).slice(1);

  const publishedPosts = (postsData.posts || [])
    .filter((p) => p.status === "publish" && p.post_type === "post")
    .sort((a, b) => toIsoDate(a.date).localeCompare(toIsoDate(b.date)));

  const postById = new Map(publishedPosts.map((p) => [String(p.id), p]));
  const attachmentById = new Map((galleryData.images || []).map((g) => [String(g.attachment_id), g]));

  // Map each source_post_id from CSV to associated non-demo attachment/full image URLs
  const postExtraImages = new Map();
  for (const line of csvRaw) {
    const [rawUrl, sourcePostId, , , attachmentId] = parseCsvLine(line);
    if (!rawUrl || rawUrl.includes("demo.wphash.com") || rawUrl.startsWith("blob:")) continue;
    if (!sourcePostId || !postById.has(String(sourcePostId))) continue;
    const canonicalAtt = attachmentId && attachmentById.get(String(attachmentId));
    const chosenUrl = canonicalAtt ? canonicalAtt.url : stripWpSizeSuffix(rawUrl.trim());
    if (!postExtraImages.has(String(sourcePostId))) postExtraImages.set(String(sourcePostId), new Set());
    postExtraImages.get(String(sourcePostId)).add(chosenUrl);
  }

  console.log(`Loaded WordPress data: ${publishedPosts.length} published posts, ${(galleryData.images || []).length} attachments, ${(categoriesData.categories || []).length} categories.`);

  if (!DRY_RUN) {
    fs.mkdirSync(path.resolve(cwd, "backups"), { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFile = path.resolve(cwd, "backups", `dev.db.pre-wp-import-${stamp}.bak`);
    fs.copyFileSync(dbPath, backupFile);
    console.log(`Created SQLite backup: ${backupFile}`);
  }

  const db = new DatabaseSync(dbPath);
  const existingNewsSlugs = new Set(db.prepare("SELECT slug FROM NewsArticle").all().map((r) => r.slug));
  const existingNewsBySlug = new Map(
    db.prepare("SELECT id, slug, coverImageUrl FROM NewsArticle").all().map((r) => [r.slug, r])
  );
  const existingGalleryUrls = new Set(db.prepare("SELECT fileUrl FROM GalleryItem").all().map((r) => r.fileUrl));

  // Probe whether cm.balochistan.gob.pk/wp-content/uploads is reachable remotely once,
  // unless local files already exist, to avoid thousands of useless 404 requests.
  const remoteCache = new Map();
  let remoteWpUploadsReachable = false;
  if (!SKIP_REMOTE_VERIFY) {
    const probeAtt = (galleryData.images || []).find(
      (g) => g.url && g.url.includes("cm.balochistan.gob.pk/wp-content/uploads/") && postById.has(String(g.parent_post_id))
    );
    if (probeAtt) {
      const probeRes = await resolveWorkingImageUrl(probeAtt.url, remoteCache);
      remoteWpUploadsReachable = Boolean(probeRes);
      console.log(`Probe remote WordPress upload URL (${probeAtt.url}): ${remoteWpUploadsReachable ? "REACHABLE" : "UNREACHABLE (404/offline)"}`);
    }
  }

  const insertNewsStmt = db.prepare(`
    INSERT INTO NewsArticle (
      id, slug, titleEn, titleUr, excerptEn, excerptUr, bodyEn, bodyUr,
      category, coverImageUrl, videoUrl, mediaType, publishedDate, readTime,
      isPublished, isFeatured, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);
  const updateNewsCoverStmt = db.prepare(`
    UPDATE NewsArticle SET coverImageUrl = ?, mediaType = 'IMAGE', updatedAt = CURRENT_TIMESTAMP
    WHERE slug = ? AND (coverImageUrl IS NULL OR coverImageUrl = '')
  `);

  const insertGalleryStmt = db.prepare(`
    INSERT INTO GalleryItem (
      id, title, titleUr, description, descriptionUr, type, fileUrl, thumbnailUrl,
      fileName, fileSize, mimeType, category, isFeatured, sortOrder, createdAt, updatedAt
    ) VALUES (?, ?, NULL, ?, NULL, 'IMAGE', ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  let newsInserted = 0;
  let newsSkippedExisting = 0;
  let newsCoverVerified = 0;
  let newsWithoutReachableCover = 0;

  if (!DRY_RUN) db.exec("BEGIN TRANSACTION;");
  try {
    for (const post of publishedPosts) {
      const titleEn = cleanTitle(post.title);
      if (!titleEn || !post.slug) continue;

      const publishedIso = toIsoDate(post.date);
      const formattedDate = new Date(publishedIso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const wpCatLabels = (post.categories || [])
        .map((c) => cleanTitle(c.name))
        .filter((n) => n && n.toLowerCase() !== "uncategorized");

      const paragraphs = extractParagraphsFromHtml(post.content_html);
      const urduParagraphs = paragraphs.filter((p) => /[\u0600-\u06FF]/.test(p));
      const englishParagraphs = paragraphs.filter((p) => !/[\u0600-\u06FF]/.test(p));

      const bodyEn =
        paragraphs.length > 0
          ? paragraphs.join("\n\n")
          : titleEn;
      const bodyUr = urduParagraphs.length > 0 ? urduParagraphs.join("\n\n") : null;

      let excerptEn = "";
      if (englishParagraphs.length > 0) {
        excerptEn = truncateAtWord(englishParagraphs[0], 220);
      } else if (paragraphs.length > 0) {
        excerptEn = truncateAtWord(paragraphs[0], 220);
      } else {
        const catNote = wpCatLabels.length > 0 ? wpCatLabels.join(", ") : "Chief Minister's Office";
        excerptEn = `${catNote} — Official update dated ${formattedDate}.`;
      }

      const category = mapWpCategoriesToNewsCategory(post.categories);
      const readTime = computeReadTime(bodyEn);

      // Find candidate cover image via attachment_id -> embedded wp-image -> CSV match
      const candidates = [];
      if (post.featured_image_attachment_id && attachmentById.has(String(post.featured_image_attachment_id))) {
        candidates.push(attachmentById.get(String(post.featured_image_attachment_id)).url);
      }
      for (const m of (post.content_html || "").matchAll(/wp-image-(\d+)/g)) {
        const att = attachmentById.get(m[1]);
        if (att) candidates.push(att.url);
      }
      if (postExtraImages.has(String(post.id))) {
        for (const u of postExtraImages.get(String(post.id))) candidates.push(u);
      }

      let verifiedCover = null;
      for (const cUrl of candidates) {
        const localOnly = toLocalPublicPathIfCmWpUrl(cUrl);
        if (localOnly && fs.existsSync(localOnly.diskPath)) {
          verifiedCover = { url: localOnly.publicRelUrl };
          break;
        }
        if (remoteWpUploadsReachable || (!cUrl.includes("cm.balochistan.gob.pk") && !cUrl.includes("demo.wphash.com"))) {
          const v = await resolveWorkingImageUrl(cUrl, remoteCache);
          if (v) {
            verifiedCover = v;
            break;
          }
        }
      }

      if (verifiedCover) newsCoverVerified++;
      else newsWithoutReachableCover++;

      if (existingNewsSlugs.has(post.slug)) {
        newsSkippedExisting++;
        const existingRow = existingNewsBySlug.get(post.slug);
        if (!DRY_RUN && verifiedCover && existingRow && !existingRow.coverImageUrl) {
          updateNewsCoverStmt.run(verifiedCover.url, post.slug);
        }
        continue;
      }

      if (!DRY_RUN) {
        insertNewsStmt.run(
          `news-wp-${post.id}`,
          post.slug,
          titleEn,
          null,
          excerptEn,
          null,
          bodyEn,
          bodyUr,
          category,
          verifiedCover ? verifiedCover.url : null,
          verifiedCover ? "IMAGE" : "ARTICLE",
          publishedIso,
          readTime,
          0
        );
      }
      existingNewsSlugs.add(post.slug);
      newsInserted++;
    }

    // Match gallery event photographs strictly linked to published news posts
    let galleryInserted = 0;
    let gallerySkippedUnreachable = 0;
    let gallerySkippedDuplicate = 0;
    let sortIdx = 10;

    // Build set of attachment_ids linked to news posts (parent_post_id, featured_image_attachment_id, or wp-image-<id>)
    const attachmentToPost = new Map();
    for (const post of publishedPosts) {
      if (post.featured_image_attachment_id) {
        attachmentToPost.set(String(post.featured_image_attachment_id), post);
      }
      for (const m of (post.content_html || "").matchAll(/wp-image-(\d+)/g)) {
        if (!attachmentToPost.has(m[1])) attachmentToPost.set(m[1], post);
      }
    }
    for (const g of galleryData.images || []) {
      if (g.parent_post_id && postById.has(String(g.parent_post_id)) && !attachmentToPost.has(String(g.attachment_id))) {
        attachmentToPost.set(String(g.attachment_id), postById.get(String(g.parent_post_id)));
      }
    }

    const eventAttachments = (galleryData.images || [])
      .filter((g) => attachmentToPost.has(String(g.attachment_id)))
      .filter((g) => g.url && !g.url.includes("demo.wphash.com") && g.mime_type !== "image/svg+xml")
      .sort((a, b) => toIsoDate(b.date).localeCompare(toIsoDate(a.date)));

    for (const att of eventAttachments) {
      const localOnly = toLocalPublicPathIfCmWpUrl(att.url);
      let verified = null;
      if (localOnly && fs.existsSync(localOnly.diskPath)) {
        const stat = fs.statSync(localOnly.diskPath);
        verified = { url: localOnly.publicRelUrl, fileSize: stat.size };
      } else if (remoteWpUploadsReachable || !att.url.includes("cm.balochistan.gob.pk")) {
        verified = await resolveWorkingImageUrl(att.url, remoteCache);
      }

      if (!verified) {
        gallerySkippedUnreachable++;
        continue;
      }
      if (existingGalleryUrls.has(verified.url)) {
        gallerySkippedDuplicate++;
        continue;
      }

      const linkedPost = attachmentToPost.get(String(att.attachment_id));
      const title = cleanTitle(linkedPost?.title || att.parent_post_title || att.title || "Official Event Photograph");
      const description = cleanTitle(att.alt_text || (linkedPost ? `Official event coverage (${toIsoDate(att.date).slice(0, 10)})` : ""));
      const fileName = path.posix.basename(att.file_path || verified.url) || `wp-${att.attachment_id}.jpg`;
      const category = mapWpCategoriesToGalleryCategory(linkedPost?.categories);

      if (!DRY_RUN) {
        insertGalleryStmt.run(
          `gal-wp-${att.attachment_id}`,
          title,
          description || null,
          verified.url,
          verified.url,
          fileName,
          verified.fileSize || 0,
          att.mime_type || "image/jpeg",
          category,
          0,
          sortIdx++,
          toIsoDate(att.date)
        );
      }
      existingGalleryUrls.add(verified.url);
      galleryInserted++;
    }

    if (!DRY_RUN) db.exec("COMMIT;");
    console.log(
      JSON.stringify(
        {
          dryRun: DRY_RUN,
          newsInserted,
          newsSkippedExisting,
          newsCoverVerified,
          newsWithoutReachableCover,
          eventGalleryCandidates: eventAttachments.length,
          galleryInserted,
          gallerySkippedDuplicate,
          gallerySkippedUnreachable,
        },
        null,
        2
      )
    );
  } catch (err) {
    if (!DRY_RUN) db.exec("ROLLBACK;");
    throw err;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
