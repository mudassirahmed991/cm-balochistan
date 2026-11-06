import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

// Type definitions matching database schema
export type Role = "SUPER_ADMIN" | "EDITOR" | "GRIEVANCE_OFFICER";

export type DBUser = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  active: number;
  permissions?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DBChiefMinisterProfile = {
  id: string;
  nameEn: string;
  nameUr: string | null;
  titleEn: string;
  titleUr: string | null;
  welcomeMessageEn: string;
  welcomeMessageUr: string | null;
  quoteEn: string;
  quoteUr: string | null;
  bioParagraphsEn: string;
  bioParagraphsUr: string | null;
  photoUrl: string;
  inOfficeSince: string;
  party: string;
  assembly: string;
  residence: string;
  termLength: string;
  active: number;
  updatedAt: string;
};

export type DBVisionMission = {
  id: string;
  visionEn: string;
  visionUr: string | null;
  missionEn: string;
  missionUr: string | null;
  updatedAt: string;
};

export type DBPriority = {
  id: string;
  slug: string;
  titleEn: string;
  titleUr: string | null;
  shortEn: string;
  shortUr: string | null;
  descriptionEn: string;
  descriptionUr: string | null;
  icon: string;
  initiativesJson: string;
  sortOrder: number;
  isFirstDay: number;
  active: number;
  bgImage?: string | null;
  iconImage?: string | null;
  articleText?: string | null;
  articleImage?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DBInitiative = {
  id: string;
  titleEn: string;
  titleUr: string | null;
  category: string;
  descriptionEn: string;
  descriptionUr: string | null;
  status: string;
  progressPercent: number;
  featured: number;
  sortOrder: number;
  active: number;
  bgImage?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DBCabinetMember = {
  id: string;
  nameEn: string;
  nameUr: string | null;
  designationEn: string;
  designationUr: string | null;
  portfolioEn: string;
  portfolioUr: string | null;
  ministryEn: string;
  ministryUr: string | null;
  photoUrl: string | null;
  profileEn: string | null;
  profileUr: string | null;
  departmentUrl: string | null;
  sortOrder: number;
  active: number;
  createdAt: string;
  updatedAt: string;
};

export type DBFormerChiefMinister = {
  id: string;
  nameEn: string;
  nameUr: string | null;
  partyEn: string;
  partyUr: string | null;
  fromDate: string;
  toDate: string;
  bioEn: string | null;
  bioUr: string | null;
  photoUrl: string | null;
  note: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type DBNewsArticle = {
  id: string;
  slug: string;
  titleEn: string;
  titleUr: string | null;
  excerptEn: string;
  excerptUr: string | null;
  bodyEn: string;
  bodyUr: string | null;
  category: string;
  coverImageUrl: string | null;
  videoUrl?: string | null;
  mediaType?: string | null;
  publishedDate: string;
  readTime: string;
  isPublished: number;
  isFeatured: number;
  createdAt: string;
  updatedAt: string;
};

export type ComplaintStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export type DBComplaint = {
  id: string;
  trackingCode: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string | null;
  district: string;
  category: string;
  department: string | null;
  description: string;
  attachmentUrl: string | null;
  status: ComplaintStatus;
  priorityLevel: string;
  resolutionNotes: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DBComplaintStatusHistory = {
  id: string;
  complaintId: string;
  previousStatus: string | null;
  newStatus: string;
  changedById: string | null;
  changedByName?: string | null;
  comments: string | null;
  createdAt: string;
};

export type DBContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  repliedAt: string | null;
  createdAt: string;
};

export type DBWebsiteSetting = {
  id: string;
  key: string;
  valueEn: string;
  valueUr: string | null;
  category: string;
  updatedAt: string;
};

export type DBGalleryItem = {
  id: string;
  title: string;
  titleUr: string | null;
  description: string | null;
  descriptionUr: string | null;
  type: "IMAGE" | "VIDEO";
  fileUrl: string;
  thumbnailUrl: string | null;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: string;
  isFeatured: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type DBAuditLog = {
  id: string;
  userId: string | null;
  userName?: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
};

// Singleton pattern for SQLite Database in Next.js
const globalForDb = globalThis as unknown as {
  sqliteDbInstance: DatabaseSync | undefined;
};

function getDbInstance(): DatabaseSync {
  if (!globalForDb.sqliteDbInstance) {
    const dbPath = path.resolve(process.cwd(), "data", "dev.db");
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    const rawDb = new DatabaseSync(dbPath);
    try {
      rawDb.exec("PRAGMA busy_timeout = 10000;");
      rawDb.exec("PRAGMA journal_mode = DELETE;");
      rawDb.exec("PRAGMA synchronous = NORMAL;");
      rawDb.exec("PRAGMA foreign_keys = ON;");
    } catch {
      // PRAGMA settings applied
    }

    // Ensure permissions column exists for granular employee access control
    try {
      rawDb.exec("ALTER TABLE User ADD COLUMN permissions TEXT;");
    } catch {
      // Column already exists
    }

    // Ensure Priority, Initiative, NewsArticle columns exist
    try { rawDb.exec("ALTER TABLE Priority ADD COLUMN bgImage TEXT;"); } catch {}
    try { rawDb.exec("ALTER TABLE Priority ADD COLUMN iconImage TEXT;"); } catch {}
    try { rawDb.exec("ALTER TABLE Priority ADD COLUMN articleText TEXT;"); } catch {}
    try { rawDb.exec("ALTER TABLE Priority ADD COLUMN articleImage TEXT;"); } catch {}
    try { rawDb.exec("ALTER TABLE Initiative ADD COLUMN bgImage TEXT;"); } catch {}
    try { rawDb.exec("ALTER TABLE NewsArticle ADD COLUMN videoUrl TEXT;"); } catch {}
    try { rawDb.exec("ALTER TABLE NewsArticle ADD COLUMN mediaType TEXT;"); } catch {}

    // Ensure GalleryItem table exists and has seed data
    try {
      rawDb.exec(`
        CREATE TABLE IF NOT EXISTS GalleryItem (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          titleUr TEXT,
          description TEXT,
          descriptionUr TEXT,
          type TEXT NOT NULL,
          fileUrl TEXT NOT NULL,
          thumbnailUrl TEXT,
          fileName TEXT NOT NULL,
          fileSize INTEGER NOT NULL DEFAULT 0,
          mimeType TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT 'General',
          isFeatured INTEGER NOT NULL DEFAULT 0,
          sortOrder INTEGER NOT NULL DEFAULT 0,
          createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Ensure seed runs ONLY ONCE on initial database creation using WebsiteSetting flag
      try {
        const seedCheckStmt = rawDb.prepare("SELECT valueEn FROM WebsiteSetting WHERE key = 'gallery_seed_completed' LIMIT 1");
        const seedCheck = seedCheckStmt.get() as { valueEn: string } | undefined;
        if (!seedCheck) {
          const countStmt = rawDb.prepare("SELECT COUNT(*) as count FROM GalleryItem");
          const countRes = countStmt.get() as { count: number } | undefined;
          if (countRes && countRes.count === 0) {
            const seedStmt = rawDb.prepare(`
              INSERT INTO GalleryItem (
                id, title, titleUr, description, descriptionUr, type,
                fileUrl, thumbnailUrl, fileName, fileSize, mimeType,
                category, isFeatured, sortOrder, createdAt, updatedAt
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `);
            seedStmt.run(
              "gal-seed-1",
              "Chief Minister Mir Sarfraz Bugti Official Portrait",
              "وزیر اعلیٰ میر سرفراز بگٹی سرکاری تصویر",
              "High-resolution official portrait of the Chief Minister of Balochistan.",
              "وزیر اعلیٰ بلوچستان کی اعلیٰ معیاری سرکاری تصویر۔",
              "IMAGE",
              "/images/chief-minister-portrait.jpg",
              "/images/chief-minister-portrait.jpg",
              "chief-minister-portrait.jpg",
              245000,
              "image/jpeg",
              "Official Events",
              1,
              1
            );
            seedStmt.run(
              "gal-seed-2",
              "Government of Balochistan Secretariat Coat of Arms",
              "حکومت بلوچستان سیکریٹریٹ کا سرکاری نشان",
              "Official provincial emblem representing the sovereign heritage of Balochistan.",
              "صوبہ بلوچستان کا روایتی و آئینی سرکاری نشان۔",
              "IMAGE",
              "/images/balochistan-logo.png",
              "/images/balochistan-logo.png",
              "balochistan-logo.png",
              165956,
              "image/png",
              "General",
              1,
              2
            );
            seedStmt.run(
              "gal-seed-3",
              "Chief Minister House Secretariat Main Portal",
              "وزیراعلیٰ ہاؤس کوئٹہ مرکزی کمپلیکس",
              "Administrative headquarters and executive secretariat Zarghoon Road Quetta.",
              "انتظامی ہیڈکوارٹرز اور چیف منسٹر سیکریٹریٹ زرغون روڈ کوئٹہ۔",
              "IMAGE",
              "/images/cm-balochistan-banner.png",
              "/images/cm-balochistan-banner.png",
              "cm-balochistan-banner.png",
              850000,
              "image/png",
              "District Visits",
              1,
              3
            );
          }
          const markSeedStmt = rawDb.prepare(`
            INSERT OR REPLACE INTO WebsiteSetting (id, key, valueEn, valueUr, category, updatedAt)
            VALUES (?, 'gallery_seed_completed', '1', NULL, 'system', CURRENT_TIMESTAMP)
          `);
          markSeedStmt.run(`set-${crypto.randomUUID()}`);
        }
      } catch {
        // Seed safeguard
      }
    } catch {
      // Table already configured
    }

    // Wrap prepare so stmt.all() and stmt.get() return plain objects for React 19 RSC serialization
    const origPrepare = rawDb.prepare.bind(rawDb);
    rawDb.prepare = ((sql: string) => {
      const stmt = origPrepare(sql);
      const origAll = stmt.all.bind(stmt);
      const origGet = stmt.get.bind(stmt);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      stmt.all = (...args: any[]) => JSON.parse(JSON.stringify(origAll(...args)));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      stmt.get = (...args: any[]) => {
        const row = origGet(...args);
        return row ? JSON.parse(JSON.stringify(row)) : undefined;
      };
      return stmt;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;

    globalForDb.sqliteDbInstance = rawDb;
  }
  return globalForDb.sqliteDbInstance;
}

export const dbRaw = getDbInstance();

// Repository pattern operations
export const db = {
  users: {
    findByEmail(email: string): DBUser | null {
      const stmt = getDbInstance().prepare("SELECT * FROM User WHERE email = ? LIMIT 1");
      const user = stmt.get(email.toLowerCase().trim()) as DBUser | undefined;
      return user || null;
    },
    findById(id: string): DBUser | null {
      const stmt = getDbInstance().prepare("SELECT * FROM User WHERE id = ? LIMIT 1");
      const user = stmt.get(id) as DBUser | undefined;
      return user || null;
    },
    create(data: { email: string; passwordHash: string; name: string; role: Role; permissions?: string | null }): DBUser {
      const id = `usr-${crypto.randomUUID()}`;
      const stmt = getDbInstance().prepare(`
        INSERT INTO User (id, email, passwordHash, name, role, active, permissions, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      stmt.run(id, data.email.toLowerCase().trim(), data.passwordHash, data.name, data.role, data.permissions || null);
      return db.users.findById(id)!;
    },
    findMany(): DBUser[] {
      const stmt = getDbInstance().prepare("SELECT id, email, name, role, active, permissions, createdAt, updatedAt FROM User ORDER BY name ASC");
      return stmt.all() as DBUser[];
    },
    update(id: string, data: { name?: string; role?: Role; active?: number; permissions?: string | null }): boolean {
      const stmt = getDbInstance().prepare(`
        UPDATE User
        SET name = COALESCE(?, name),
            role = COALESCE(?, role),
            active = COALESCE(?, active),
            permissions = CASE WHEN ? = 1 THEN ? ELSE permissions END,
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      const hasPerms = data.permissions !== undefined ? 1 : 0;
      stmt.run(
        data.name || null,
        data.role || null,
        data.active !== undefined ? data.active : null,
        hasPerms,
        data.permissions || null,
        id
      );
      return true;
    },
    updatePassword(id: string, passwordHash: string): boolean {
      const stmt = getDbInstance().prepare("UPDATE User SET passwordHash = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?");
      stmt.run(passwordHash, id);
      return true;
    },
    countActiveSuperAdmins(): number {
      const stmt = getDbInstance().prepare("SELECT COUNT(*) as count FROM User WHERE role = 'SUPER_ADMIN' AND active = 1");
      const row = stmt.get() as { count: number } | undefined;
      return row?.count || 0;
    },
    delete(id: string): boolean {
      const stmt = getDbInstance().prepare("DELETE FROM User WHERE id = ?");
      stmt.run(id);
      return true;
    },
  },

  sessions: {
    create(userId: string, expiresAt: Date): string {
      const id = `ses-${crypto.randomUUID()}`;
      const token = crypto.randomBytes(32).toString("hex");
      const stmt = getDbInstance().prepare(`
        INSERT INTO Session (id, token, userId, expiresAt, createdAt)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      stmt.run(id, token, userId, expiresAt.toISOString());
      return token;
    },
    findValid(token: string): { user: DBUser; token: string; expiresAt: string } | null {
      const stmt = getDbInstance().prepare(`
        SELECT s.token, s.expiresAt, u.id, u.email, u.name, u.role, u.active, u.permissions, u.createdAt, u.updatedAt
        FROM Session s
        JOIN User u ON s.userId = u.id
        WHERE s.token = ? AND datetime(s.expiresAt) > datetime('now') AND u.active = 1
        LIMIT 1
      `);
      const row = stmt.get(token) as (DBUser & { token: string; expiresAt: string }) | undefined;
      if (!row) return null;
      return {
        user: {
          id: row.id,
          email: row.email,
          passwordHash: "",
          name: row.name,
          role: row.role,
          active: row.active,
          permissions: row.permissions || null,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
        token: row.token,
        expiresAt: row.expiresAt,
      };
    },
    delete(token: string): void {
      const stmt = getDbInstance().prepare("DELETE FROM Session WHERE token = ?");
      stmt.run(token);
    },
    deleteExpired(): void {
      getDbInstance().exec("DELETE FROM Session WHERE datetime(expiresAt) <= datetime('now')");
    },
  },

  cmProfile: {
    get(): DBChiefMinisterProfile | null {
      const stmt = getDbInstance().prepare("SELECT * FROM ChiefMinisterProfile WHERE active = 1 ORDER BY updatedAt DESC LIMIT 1");
      const profile = stmt.get() as DBChiefMinisterProfile | undefined;
      return profile || null;
    },
    update(id: string, data: Partial<DBChiefMinisterProfile>): boolean {
      const stmt = getDbInstance().prepare(`
        UPDATE ChiefMinisterProfile
        SET nameEn = COALESCE(?, nameEn),
            nameUr = COALESCE(?, nameUr),
            titleEn = COALESCE(?, titleEn),
            titleUr = COALESCE(?, titleUr),
            welcomeMessageEn = COALESCE(?, welcomeMessageEn),
            welcomeMessageUr = COALESCE(?, welcomeMessageUr),
            quoteEn = COALESCE(?, quoteEn),
            quoteUr = COALESCE(?, quoteUr),
            bioParagraphsEn = COALESCE(?, bioParagraphsEn),
            photoUrl = COALESCE(?, photoUrl),
            inOfficeSince = COALESCE(?, inOfficeSince),
            party = COALESCE(?, party),
            assembly = COALESCE(?, assembly),
            residence = COALESCE(?, residence),
            termLength = COALESCE(?, termLength),
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(
        data.nameEn || null,
        data.nameUr || null,
        data.titleEn || null,
        data.titleUr || null,
        data.welcomeMessageEn || null,
        data.welcomeMessageUr || null,
        data.quoteEn || null,
        data.quoteUr || null,
        data.bioParagraphsEn || null,
        data.photoUrl || null,
        data.inOfficeSince || null,
        data.party || null,
        data.assembly || null,
        data.residence || null,
        data.termLength || null,
        id
      );
      return true;
    },
  },

  visionMission: {
    get(): DBVisionMission | null {
      const stmt = getDbInstance().prepare("SELECT * FROM VisionMission LIMIT 1");
      const record = stmt.get() as DBVisionMission | undefined;
      return record || null;
    },
    update(id: string, data: { visionEn: string; visionUr?: string | null; missionEn: string; missionUr?: string | null }): boolean {
      const stmt = getDbInstance().prepare(`
        UPDATE VisionMission
        SET visionEn = ?,
            visionUr = COALESCE(?, visionUr),
            missionEn = ?,
            missionUr = COALESCE(?, missionUr),
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(data.visionEn, data.visionUr || null, data.missionEn, data.missionUr || null, id);
      return true;
    },
  },

  priorities: {
    findMany(options?: { isFirstDay?: boolean }): DBPriority[] {
      if (options?.isFirstDay !== undefined) {
        const stmt = getDbInstance().prepare("SELECT * FROM Priority WHERE active = 1 AND isFirstDay = ? ORDER BY sortOrder ASC");
        return stmt.all(options.isFirstDay ? 1 : 0) as DBPriority[];
      }
      const stmt = getDbInstance().prepare("SELECT * FROM Priority WHERE active = 1 ORDER BY sortOrder ASC");
      return stmt.all() as DBPriority[];
    },
    findBySlug(slug: string): DBPriority | null {
      const stmt = getDbInstance().prepare("SELECT * FROM Priority WHERE slug = ? AND active = 1 LIMIT 1");
      const record = stmt.get(slug) as DBPriority | undefined;
      return record || null;
    },
    create(data: {
      slug: string;
      titleEn: string;
      titleUr?: string | null;
      shortEn: string;
      shortUr?: string | null;
      descriptionEn: string;
      descriptionUr?: string | null;
      icon: string;
      initiativesJson: string;
      sortOrder: number;
      isFirstDay: number;
      bgImage?: string | null;
      iconImage?: string | null;
      articleText?: string | null;
      articleImage?: string | null;
    }): DBPriority {
      const id = `pri-${crypto.randomUUID()}`;
      const stmt = getDbInstance().prepare(`
        INSERT INTO Priority (
          id, slug, titleEn, titleUr, shortEn, shortUr, descriptionEn, descriptionUr,
          icon, initiativesJson, sortOrder, isFirstDay, active, bgImage, iconImage, articleText, articleImage, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      stmt.run(
        id, data.slug, data.titleEn, data.titleUr || null, data.shortEn, data.shortUr || null,
        data.descriptionEn, data.descriptionUr || null, data.icon, data.initiativesJson,
        data.sortOrder, data.isFirstDay, data.bgImage || null, data.iconImage || null,
        data.articleText || null, data.articleImage || null
      );
      return db.priorities.findBySlug(data.slug)!;
    },
    update(id: string, data: Partial<DBPriority>): boolean {
      const stmt = getDbInstance().prepare(`
        UPDATE Priority
        SET titleEn = COALESCE(?, titleEn),
            shortEn = COALESCE(?, shortEn),
            descriptionEn = COALESCE(?, descriptionEn),
            icon = COALESCE(?, icon),
            sortOrder = COALESCE(?, sortOrder),
            isFirstDay = COALESCE(?, isFirstDay),
            active = COALESCE(?, active),
            bgImage = COALESCE(?, bgImage),
            iconImage = COALESCE(?, iconImage),
            articleText = COALESCE(?, articleText),
            articleImage = COALESCE(?, articleImage),
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(
        data.titleEn || null,
        data.shortEn || null,
        data.descriptionEn || null,
        data.icon || null,
        data.sortOrder !== undefined ? data.sortOrder : null,
        data.isFirstDay !== undefined ? data.isFirstDay : null,
        data.active !== undefined ? data.active : null,
        data.bgImage !== undefined ? data.bgImage : null,
        data.iconImage !== undefined ? data.iconImage : null,
        data.articleText !== undefined ? data.articleText : null,
        data.articleImage !== undefined ? data.articleImage : null,
        id
      );
      return true;
    },
    delete(id: string): boolean {
      const stmt = getDbInstance().prepare("DELETE FROM Priority WHERE id = ?");
      stmt.run(id);
      return true;
    },
  },

  initiatives: {
    findMany(options?: { featured?: boolean; category?: string }): DBInitiative[] {
      if (options?.featured) {
        const stmt = getDbInstance().prepare("SELECT * FROM Initiative WHERE active = 1 AND featured = 1 ORDER BY sortOrder ASC");
        return stmt.all() as DBInitiative[];
      }
      if (options?.category) {
        const stmt = getDbInstance().prepare("SELECT * FROM Initiative WHERE active = 1 AND category = ? ORDER BY sortOrder ASC");
        return stmt.all(options.category) as DBInitiative[];
      }
      const stmt = getDbInstance().prepare("SELECT * FROM Initiative WHERE active = 1 ORDER BY sortOrder ASC");
      return stmt.all() as DBInitiative[];
    },
    create(data: {
      titleEn: string;
      titleUr?: string | null;
      category: string;
      descriptionEn: string;
      descriptionUr?: string | null;
      status: string;
      progressPercent: number;
      featured: number;
      sortOrder: number;
      bgImage?: string | null;
    }): DBInitiative {
      const id = `init-${crypto.randomUUID()}`;
      const stmt = getDbInstance().prepare(`
        INSERT INTO Initiative (
          id, titleEn, titleUr, category, descriptionEn, descriptionUr,
          status, progressPercent, featured, sortOrder, active, bgImage, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      stmt.run(
        id, data.titleEn, data.titleUr || null, data.category, data.descriptionEn,
        data.descriptionUr || null, data.status, data.progressPercent, data.featured, data.sortOrder,
        data.bgImage || null
      );
      const fetchStmt = getDbInstance().prepare("SELECT * FROM Initiative WHERE id = ?");
      return fetchStmt.get(id) as DBInitiative;
    },
    update(id: string, data: Partial<DBInitiative>): boolean {
      const stmt = getDbInstance().prepare(`
        UPDATE Initiative
        SET titleEn = COALESCE(?, titleEn),
            category = COALESCE(?, category),
            descriptionEn = COALESCE(?, descriptionEn),
            status = COALESCE(?, status),
            progressPercent = COALESCE(?, progressPercent),
            featured = COALESCE(?, featured),
            sortOrder = COALESCE(?, sortOrder),
            active = COALESCE(?, active),
            bgImage = COALESCE(?, bgImage),
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(
        data.titleEn || null,
        data.category || null,
        data.descriptionEn || null,
        data.status || null,
        data.progressPercent !== undefined ? data.progressPercent : null,
        data.featured !== undefined ? data.featured : null,
        data.sortOrder !== undefined ? data.sortOrder : null,
        data.active !== undefined ? data.active : null,
        data.bgImage !== undefined ? data.bgImage : null,
        id
      );
      return true;
    },
    delete(id: string): boolean {
      const stmt = getDbInstance().prepare("DELETE FROM Initiative WHERE id = ?");
      stmt.run(id);
      return true;
    },
  },

  cabinet: {
    findMany(): DBCabinetMember[] {
      const stmt = getDbInstance().prepare("SELECT * FROM CabinetMember WHERE active = 1 ORDER BY sortOrder ASC");
      return stmt.all() as DBCabinetMember[];
    },
    create(data: {
      nameEn: string;
      nameUr?: string | null;
      designationEn: string;
      designationUr?: string | null;
      portfolioEn: string;
      portfolioUr?: string | null;
      ministryEn: string;
      ministryUr?: string | null;
      photoUrl?: string | null;
      departmentUrl?: string | null;
      sortOrder: number;
    }): DBCabinetMember {
      const id = `cab-${crypto.randomUUID()}`;
      const stmt = getDbInstance().prepare(`
        INSERT INTO CabinetMember (
          id, nameEn, nameUr, designationEn, designationUr, portfolioEn, portfolioUr,
          ministryEn, ministryUr, photoUrl, departmentUrl, sortOrder, active, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      stmt.run(
        id, data.nameEn, data.nameUr || null, data.designationEn, data.designationUr || null,
        data.portfolioEn, data.portfolioUr || null, data.ministryEn, data.ministryUr || null,
        data.photoUrl || null, data.departmentUrl || null, data.sortOrder
      );
      const fetchStmt = getDbInstance().prepare("SELECT * FROM CabinetMember WHERE id = ?");
      return fetchStmt.get(id) as DBCabinetMember;
    },
    update(id: string, data: Partial<DBCabinetMember>): boolean {
      const stmt = getDbInstance().prepare(`
        UPDATE CabinetMember
        SET nameEn = COALESCE(?, nameEn),
            designationEn = COALESCE(?, designationEn),
            portfolioEn = COALESCE(?, portfolioEn),
            ministryEn = COALESCE(?, ministryEn),
            departmentUrl = COALESCE(?, departmentUrl),
            sortOrder = COALESCE(?, sortOrder),
            active = COALESCE(?, active),
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(
        data.nameEn || null,
        data.designationEn || null,
        data.portfolioEn || null,
        data.ministryEn || null,
        data.departmentUrl || null,
        data.sortOrder !== undefined ? data.sortOrder : null,
        data.active !== undefined ? data.active : null,
        id
      );
      return true;
    },
    delete(id: string): boolean {
      const stmt = getDbInstance().prepare("DELETE FROM CabinetMember WHERE id = ?");
      stmt.run(id);
      return true;
    },
  },

  formerCms: {
    findMany(): DBFormerChiefMinister[] {
      const stmt = getDbInstance().prepare("SELECT * FROM FormerChiefMinister ORDER BY sortOrder ASC");
      return stmt.all() as DBFormerChiefMinister[];
    },
  },

  news: {
    findMany(options?: { category?: string; search?: string; limit?: number }): DBNewsArticle[] {
      let query = "SELECT * FROM NewsArticle WHERE isPublished = 1";
      const params: (string | number)[] = [];

      if (options?.category && options.category !== "All Updates") {
        query += " AND category = ?";
        params.push(options.category);
      }

      if (options?.search) {
        query += " AND (titleEn LIKE ? OR excerptEn LIKE ? OR bodyEn LIKE ?)";
        const term = `%${options.search}%`;
        params.push(term, term, term);
      }

      query += " ORDER BY publishedDate DESC";

      if (options?.limit) {
        query += " LIMIT ?";
        params.push(options.limit);
      }

      const stmt = getDbInstance().prepare(query);
      return stmt.all(...params) as DBNewsArticle[];
    },
    findAllForAdmin(): DBNewsArticle[] {
      const stmt = getDbInstance().prepare("SELECT * FROM NewsArticle ORDER BY publishedDate DESC");
      return stmt.all() as DBNewsArticle[];
    },
    findBySlug(slug: string): DBNewsArticle | null {
      const stmt = getDbInstance().prepare("SELECT * FROM NewsArticle WHERE slug = ? LIMIT 1");
      const record = stmt.get(slug) as DBNewsArticle | undefined;
      return record || null;
    },
    create(data: {
      slug: string;
      titleEn: string;
      titleUr?: string | null;
      excerptEn: string;
      excerptUr?: string | null;
      bodyEn: string;
      bodyUr?: string | null;
      category: string;
      coverImageUrl?: string | null;
      videoUrl?: string | null;
      mediaType?: string | null;
      publishedDate: string;
      readTime: string;
      isPublished: number;
      isFeatured: number;
    }): DBNewsArticle {
      const id = `news-${crypto.randomUUID()}`;
      const stmt = getDbInstance().prepare(`
        INSERT INTO NewsArticle (
          id, slug, titleEn, titleUr, excerptEn, excerptUr, bodyEn, bodyUr,
          category, coverImageUrl, videoUrl, mediaType, publishedDate, readTime, isPublished, isFeatured, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      stmt.run(
        id, data.slug, data.titleEn, data.titleUr || null, data.excerptEn, data.excerptUr || null,
        data.bodyEn, data.bodyUr || null, data.category, data.coverImageUrl || null,
        data.videoUrl || null, data.mediaType || "ARTICLE", data.publishedDate, data.readTime,
        data.isPublished, data.isFeatured
      );
      return db.news.findBySlug(data.slug)!;
    },
    update(id: string, data: Partial<DBNewsArticle>): boolean {
      const stmt = getDbInstance().prepare(`
        UPDATE NewsArticle
        SET titleEn = COALESCE(?, titleEn),
            excerptEn = COALESCE(?, excerptEn),
            bodyEn = COALESCE(?, bodyEn),
            category = COALESCE(?, category),
            coverImageUrl = COALESCE(?, coverImageUrl),
            videoUrl = COALESCE(?, videoUrl),
            mediaType = COALESCE(?, mediaType),
            readTime = COALESCE(?, readTime),
            isPublished = COALESCE(?, isPublished),
            isFeatured = COALESCE(?, isFeatured),
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(
        data.titleEn || null,
        data.excerptEn || null,
        data.bodyEn || null,
        data.category || null,
        data.coverImageUrl !== undefined ? data.coverImageUrl : null,
        data.videoUrl !== undefined ? data.videoUrl : null,
        data.mediaType !== undefined ? data.mediaType : null,
        data.readTime || null,
        data.isPublished !== undefined ? data.isPublished : null,
        data.isFeatured !== undefined ? data.isFeatured : null,
        id
      );
      return true;
    },
    delete(id: string): boolean {
      const stmt = getDbInstance().prepare("DELETE FROM NewsArticle WHERE id = ?");
      stmt.run(id);
      return true;
    },
  },

  complaints: {
    generateTrackingCode(): string {
      const year = new Date().getFullYear();
      // Generate a random 4-digit code e.g. CMB-2026-7842
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      return `CMB-${year}-${randomNum}`;
    },
    create(data: {
      citizenName: string;
      citizenPhone: string;
      citizenEmail?: string | null;
      district: string;
      category: string;
      department?: string | null;
      description: string;
      attachmentUrl?: string | null;
      priorityLevel?: string;
    }): { complaint: DBComplaint; trackingCode: string } {
      const id = `cmp-${crypto.randomUUID()}`;
      let trackingCode = db.complaints.generateTrackingCode();

      // Ensure unique tracking code
      const checkStmt = getDbInstance().prepare("SELECT id FROM Complaint WHERE trackingCode = ?");
      while (checkStmt.get(trackingCode)) {
        trackingCode = db.complaints.generateTrackingCode();
      }

      const insertComplaintStmt = getDbInstance().prepare(`
        INSERT INTO Complaint (
          id, trackingCode, citizenName, citizenPhone, citizenEmail,
          district, category, department, description, attachmentUrl,
          status, priorityLevel, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);

      const insertHistoryStmt = getDbInstance().prepare(`
        INSERT INTO ComplaintStatusHistory (
          id, complaintId, previousStatus, newStatus, changedById, comments, createdAt
        ) VALUES (?, ?, NULL, 'SUBMITTED', NULL, 'Grievance submitted by citizen through the official portal. Official tracking code generated.', CURRENT_TIMESTAMP)
      `);

      insertComplaintStmt.run(
        id,
        trackingCode,
        data.citizenName.trim(),
        data.citizenPhone.trim(),
        data.citizenEmail?.trim() || null,
        data.district.trim(),
        data.category.trim(),
        data.department?.trim() || null,
        data.description.trim(),
        data.attachmentUrl || null,
        data.priorityLevel || "NORMAL"
      );

      insertHistoryStmt.run(`csh-${crypto.randomUUID()}`, id);

      const fetchStmt = getDbInstance().prepare("SELECT * FROM Complaint WHERE id = ?");
      const complaint = fetchStmt.get(id) as DBComplaint;

      return { complaint, trackingCode };
    },
    findByTrackingCode(trackingCode: string): {
      complaint: DBComplaint;
      timeline: DBComplaintStatusHistory[];
    } | null {
      const cleanCode = trackingCode.toUpperCase().trim();
      const stmt = getDbInstance().prepare("SELECT * FROM Complaint WHERE trackingCode = ? LIMIT 1");
      const complaint = stmt.get(cleanCode) as DBComplaint | undefined;

      if (!complaint) return null;

      const historyStmt = getDbInstance().prepare(`
        SELECT h.*, u.name as changedByName
        FROM ComplaintStatusHistory h
        LEFT JOIN User u ON h.changedById = u.id
        WHERE h.complaintId = ?
        ORDER BY h.createdAt ASC
      `);
      const timeline = historyStmt.all(complaint.id) as DBComplaintStatusHistory[];

      return { complaint, timeline };
    },
    findMany(options?: { status?: ComplaintStatus; district?: string; category?: string; limit?: number }): DBComplaint[] {
      let query = "SELECT * FROM Complaint WHERE 1=1";
      const params: (string | number)[] = [];

      if (options?.status) {
        query += " AND status = ?";
        params.push(options.status);
      }
      if (options?.district) {
        query += " AND district = ?";
        params.push(options.district);
      }
      if (options?.category) {
        query += " AND category = ?";
        params.push(options.category);
      }

      query += " ORDER BY createdAt DESC";
      if (options?.limit) {
        query += " LIMIT ?";
        params.push(options.limit);
      }

      const stmt = getDbInstance().prepare(query);
      return stmt.all(...params) as DBComplaint[];
    },
    updateStatus(data: {
      complaintId: string;
      newStatus: ComplaintStatus;
      comments: string;
      changedById?: string;
      department?: string;
      priorityLevel?: string;
      resolutionNotes?: string;
    }): boolean {
      const fetchStmt = getDbInstance().prepare("SELECT status FROM Complaint WHERE id = ?");
      const existing = fetchStmt.get(data.complaintId) as { status: ComplaintStatus } | undefined;
      if (!existing) return false;

      const updateStmt = getDbInstance().prepare(`
        UPDATE Complaint
        SET status = ?,
            department = COALESCE(?, department),
            priorityLevel = COALESCE(?, priorityLevel),
            resolutionNotes = COALESCE(?, resolutionNotes),
            resolvedAt = CASE WHEN ? = 'RESOLVED' THEN CURRENT_TIMESTAMP ELSE resolvedAt END,
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      updateStmt.run(
        data.newStatus,
        data.department || null,
        data.priorityLevel || null,
        data.resolutionNotes || null,
        data.newStatus,
        data.complaintId
      );

      const historyStmt = getDbInstance().prepare(`
        INSERT INTO ComplaintStatusHistory (
          id, complaintId, previousStatus, newStatus, changedById, comments, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      historyStmt.run(
        `csh-${crypto.randomUUID()}`,
        data.complaintId,
        existing.status,
        data.newStatus,
        data.changedById || null,
        data.comments.trim()
      );

      return true;
    },
    recordCitizenFeedback(data: {
      trackingCode: string;
      rating?: number;
      comments: string;
      requestEscalation?: boolean;
    }): boolean {
      const cleanCode = data.trackingCode.toUpperCase().trim();
      const fetchStmt = getDbInstance().prepare("SELECT * FROM Complaint WHERE trackingCode = ?");
      const complaint = fetchStmt.get(cleanCode) as DBComplaint | undefined;
      if (!complaint) return false;

      const newStatus = data.requestEscalation ? "UNDER_REVIEW" : complaint.status;
      const newPriority = data.requestEscalation ? "URGENT" : complaint.priorityLevel;

      const updateStmt = getDbInstance().prepare(`
        UPDATE Complaint
        SET status = ?,
            priorityLevel = ?,
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      updateStmt.run(newStatus, newPriority, complaint.id);

      const historyStmt = getDbInstance().prepare(`
        INSERT INTO ComplaintStatusHistory (
          id, complaintId, previousStatus, newStatus, changedById, comments, createdAt
        ) VALUES (?, ?, ?, ?, NULL, ?, CURRENT_TIMESTAMP)
      `);

      const prefix = data.requestEscalation
        ? "CITIZEN APPEAL / ESCALATION: Issue reported unresolved by citizen. Escalated to Tier-2 Secretariat Oversight."
        : `CITIZEN FEEDBACK: Rated ${data.rating ? `${data.rating}/5 stars.` : "Feedback received."}`;

      const fullComments = `${prefix} Remarks: ${data.comments.trim()}`;

      historyStmt.run(
        `csh-${crypto.randomUUID()}`,
        complaint.id,
        complaint.status,
        newStatus,
        fullComments
      );

      return true;
    },
    getStats(): { total: number; resolved: number; inProgress: number; submitted: number } {
      const stmt = getDbInstance().prepare(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) as resolved,
          SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as inProgress,
          SUM(CASE WHEN status = 'SUBMITTED' THEN 1 ELSE 0 END) as submitted
        FROM Complaint
      `);
      const row = stmt.get() as { total: number; resolved: number; inProgress: number; submitted: number };
      return {
        total: row.total || 0,
        resolved: row.resolved || 0,
        inProgress: row.inProgress || 0,
        submitted: row.submitted || 0,
      };
    },
  },

  contactInquiry: {
    create(data: { name: string; email: string; phone?: string; subject: string; message: string }): DBContactInquiry {
      const id = `inq-${crypto.randomUUID()}`;
      const stmt = getDbInstance().prepare(`
        INSERT INTO ContactInquiry (id, name, email, phone, subject, message, status, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, 'UNREAD', CURRENT_TIMESTAMP)
      `);
      stmt.run(id, data.name.trim(), data.email.trim(), data.phone?.trim() || null, data.subject.trim(), data.message.trim());
      const fetchStmt = getDbInstance().prepare("SELECT * FROM ContactInquiry WHERE id = ?");
      return fetchStmt.get(id) as DBContactInquiry;
    },
    findMany(options?: { status?: string; limit?: number }): DBContactInquiry[] {
      let query = "SELECT * FROM ContactInquiry WHERE 1=1";
      const params: (string | number)[] = [];
      if (options?.status) {
        query += " AND status = ?";
        params.push(options.status);
      }
      query += " ORDER BY createdAt DESC";
      if (options?.limit) {
        query += " LIMIT ?";
        params.push(options.limit);
      }
      const stmt = getDbInstance().prepare(query);
      return stmt.all(...params) as DBContactInquiry[];
    },
    updateStatus(id: string, status: string): boolean {
      const stmt = getDbInstance().prepare(`
        UPDATE ContactInquiry
        SET status = ?,
            repliedAt = CASE WHEN ? = 'REPLIED' THEN CURRENT_TIMESTAMP ELSE repliedAt END
        WHERE id = ?
      `);
      stmt.run(status, status, id);
      return true;
    },
  },

  settings: {
    getAll(): DBWebsiteSetting[] {
      const stmt = getDbInstance().prepare("SELECT * FROM WebsiteSetting ORDER BY key ASC");
      return stmt.all() as DBWebsiteSetting[];
    },
    get(key: string): DBWebsiteSetting | null {
      const stmt = getDbInstance().prepare("SELECT * FROM WebsiteSetting WHERE key = ? LIMIT 1");
      const record = stmt.get(key) as DBWebsiteSetting | undefined;
      return record || null;
    },
    set(key: string, valueEn: string, valueUr?: string, category = "general"): void {
      const stmt = getDbInstance().prepare(`
        INSERT INTO WebsiteSetting (id, key, valueEn, valueUr, category, updatedAt)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET
          valueEn = excluded.valueEn,
          valueUr = COALESCE(excluded.valueUr, WebsiteSetting.valueUr),
          category = excluded.category,
          updatedAt = CURRENT_TIMESTAMP
      `);
      stmt.run(`set-${crypto.randomUUID()}`, key, valueEn, valueUr || null, category);
    },
  },

  audit: {
    log(data: { userId?: string; action: string; entity: string; entityId?: string; details?: string; ipAddress?: string }): void {
      const id = `aud-${crypto.randomUUID()}`;
      const stmt = getDbInstance().prepare(`
        INSERT INTO AuditLog (id, userId, action, entity, entityId, details, ipAddress, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      stmt.run(
        id,
        data.userId || null,
        data.action,
        data.entity,
        data.entityId || null,
        data.details || null,
        data.ipAddress || null
      );
    },
    findMany(options?: { limit?: number; entity?: string }): (DBAuditLog & { userName?: string })[] {
      let query = `
        SELECT a.*, u.name as userName
        FROM AuditLog a
        LEFT JOIN User u ON a.userId = u.id
        WHERE 1=1
      `;
      const params: (string | number)[] = [];
      if (options?.entity) {
        query += " AND a.entity = ?";
        params.push(options.entity);
      }
      query += " ORDER BY a.createdAt DESC";
      if (options?.limit) {
        query += " LIMIT ?";
        params.push(options.limit);
      }
      const stmt = getDbInstance().prepare(query);
      return stmt.all(...params) as (DBAuditLog & { userName?: string })[];
    },
  },

  gallery: {
    findAll(options?: {
      type?: "IMAGE" | "VIDEO";
      category?: string;
      query?: string;
      featuredOnly?: boolean;
      limit?: number;
    }): DBGalleryItem[] {
      let sql = "SELECT * FROM GalleryItem WHERE 1=1";
      const params: (string | number)[] = [];

      if (options?.type) {
        sql += " AND type = ?";
        params.push(options.type);
      }

      if (options?.category && options.category !== "All") {
        sql += " AND category = ?";
        params.push(options.category);
      }

      if (options?.featuredOnly) {
        sql += " AND isFeatured = 1";
      }

      if (options?.query) {
        sql += " AND (title LIKE ? OR description LIKE ? OR category LIKE ?)";
        const q = `%${options.query}%`;
        params.push(q, q, q);
      }

      sql += " ORDER BY isFeatured DESC, sortOrder ASC, createdAt DESC";

      if (options?.limit) {
        sql += " LIMIT ?";
        params.push(options.limit);
      }

      const stmt = getDbInstance().prepare(sql);
      return stmt.all(...params) as DBGalleryItem[];
    },

    findById(id: string): DBGalleryItem | null {
      const stmt = getDbInstance().prepare("SELECT * FROM GalleryItem WHERE id = ? LIMIT 1");
      const item = stmt.get(id) as DBGalleryItem | undefined;
      return item || null;
    },

    create(data: {
      title: string;
      titleUr?: string | null;
      description?: string | null;
      descriptionUr?: string | null;
      type: "IMAGE" | "VIDEO";
      fileUrl: string;
      thumbnailUrl?: string | null;
      fileName: string;
      fileSize: number;
      mimeType: string;
      category?: string;
      isFeatured?: number;
      sortOrder?: number;
    }): DBGalleryItem {
      const id = `gal-${crypto.randomUUID()}`;
      const stmt = getDbInstance().prepare(`
        INSERT INTO GalleryItem (
          id, title, titleUr, description, descriptionUr, type,
          fileUrl, thumbnailUrl, fileName, fileSize, mimeType,
          category, isFeatured, sortOrder, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      stmt.run(
        id,
        data.title,
        data.titleUr || null,
        data.description || null,
        data.descriptionUr || null,
        data.type,
        data.fileUrl,
        data.thumbnailUrl || null,
        data.fileName,
        data.fileSize,
        data.mimeType,
        data.category || "General",
        data.isFeatured || 0,
        data.sortOrder || 0
      );
      return this.findById(id)!;
    },

    update(
      id: string,
      data: Partial<Omit<DBGalleryItem, "id" | "createdAt" | "updatedAt">>
    ): DBGalleryItem | null {
      const existing = this.findById(id);
      if (!existing) return null;

      const fields: string[] = [];
      const params: (string | number | null)[] = [];

      if (data.title !== undefined) { fields.push("title = ?"); params.push(data.title); }
      if (data.titleUr !== undefined) { fields.push("titleUr = ?"); params.push(data.titleUr); }
      if (data.description !== undefined) { fields.push("description = ?"); params.push(data.description); }
      if (data.descriptionUr !== undefined) { fields.push("descriptionUr = ?"); params.push(data.descriptionUr); }
      if (data.category !== undefined) { fields.push("category = ?"); params.push(data.category); }
      if (data.isFeatured !== undefined) { fields.push("isFeatured = ?"); params.push(data.isFeatured); }
      if (data.sortOrder !== undefined) { fields.push("sortOrder = ?"); params.push(data.sortOrder); }
      if (data.thumbnailUrl !== undefined) { fields.push("thumbnailUrl = ?"); params.push(data.thumbnailUrl); }

      if (fields.length === 0) return existing;

      fields.push("updatedAt = CURRENT_TIMESTAMP");
      params.push(id);

      const sql = `UPDATE GalleryItem SET ${fields.join(", ")} WHERE id = ?`;
      const stmt = getDbInstance().prepare(sql);
      stmt.run(...params);

      return this.findById(id);
    },

    delete(id: string): { success: boolean; item?: DBGalleryItem } {
      const item = this.findById(id);
      if (!item) return { success: false };

      const stmt = getDbInstance().prepare("DELETE FROM GalleryItem WHERE id = ?");
      stmt.run(id);
      return { success: true, item };
    },

    getStats(): { total: number; images: number; videos: number; totalSizeBytes: number } {
      const stmt = getDbInstance().prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN type = 'IMAGE' THEN 1 ELSE 0 END) as images,
          SUM(CASE WHEN type = 'VIDEO' THEN 1 ELSE 0 END) as videos,
          COALESCE(SUM(fileSize), 0) as totalSizeBytes
        FROM GalleryItem
      `);
      const res = stmt.get() as { total: number; images: number; videos: number; totalSizeBytes: number } | undefined;
      return res || { total: 0, images: 0, videos: 0, totalSizeBytes: 0 };
    },
  },
};
