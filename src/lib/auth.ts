import crypto from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { db, type DBUser } from "@/lib/db";

const SESSION_COOKIE_NAME = "cm_session_token";
const SESSION_DURATION_DAYS = 7;

/**
 * Hash password with scrypt and a cryptographically secure random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Timing-safe comparison to prevent timing attacks
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

import { signToken, verifyToken } from "@/lib/security";

/**
 * Authenticate user credentials and issue session token
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: DBUser; token?: string }> {
  const user = db.users.findByEmail(email);
  if (!user) {
    return { success: false, error: "Invalid official credentials." };
  }

  if (!user.active) {
    return { success: false, error: "Account has been suspended or deactivated." };
  }

  const isValid = verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Invalid official credentials." };
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  const rawToken = db.sessions.create(user.id, expiresAt);
  const cryptographicallySignedToken = signToken(rawToken);

  // Set HTTP-only, Strict SameSite, Secure cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, cryptographicallySignedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });

  // Log successful login audit
  db.audit.log({
    userId: user.id,
    action: "LOGIN",
    entity: "User",
    entityId: user.id,
    details: `User ${user.email} (${user.role}) logged in successfully.`,
  });

  return { success: true, user, token: cryptographicallySignedToken };
}

/**
 * Get current authenticated user from request cookie
 */
export async function getCurrentUser(): Promise<DBUser | null> {
  try {
    await connection();
    const cookieStore = await cookies();
    const rawCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!rawCookie) return null;

    // Verify cryptographic signature
    const verified = verifyToken(rawCookie);
    const tokenToLookup = verified.valid && verified.payload ? verified.payload : rawCookie;

    const session = db.sessions.findValid(tokenToLookup);
    if (!session) return null;

    return session.user;
  } catch {
    return null;
  }
}

/**
 * Log out and clear session cookie
 */
export async function logoutUser(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const rawCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (rawCookie) {
      const verified = verifyToken(rawCookie);
      const tokenToDelete = verified.valid && verified.payload ? verified.payload : rawCookie;
      db.sessions.delete(tokenToDelete);
      cookieStore.delete(SESSION_COOKIE_NAME);
    }
  } catch {
    // Ignore error
  }
}

// ----------------------------------------------------------------------
// GRANULAR EMPLOYEE-WISE ROLE & CMS ACCESS CONTROL (PART 3)
// ----------------------------------------------------------------------

export type AdminModule =
  | "chief_minister"
  | "vision_mission"
  | "priorities"
  | "cabinet"
  | "news"
  | "gallery"
  | "complaints"
  | "inquiries"
  | "settings"
  | "audit_logs"
  | "users";

export interface ModuleDefinition {
  id: AdminModule;
  label: string;
  description: string;
  category: "CONTENT" | "CITIZEN_SERVICES" | "GOVERNANCE" | "SECURITY";
}

export const ALL_ADMIN_MODULES: ModuleDefinition[] = [
  { id: "news", label: "News & Media Room", description: "Publish and edit official press releases, news articles, and statements", category: "CONTENT" },
  { id: "gallery", label: "Media & Video Gallery", description: "Direct drag-and-drop upload of images and videos of any size, media management", category: "CONTENT" },
  { id: "chief_minister", label: "CM Profile & Welcome", description: "Update Chief Minister biography, welcome message, and official quote", category: "CONTENT" },
  { id: "vision_mission", label: "Vision & Mission", description: "Update provincial vision and mission statements", category: "CONTENT" },
  { id: "priorities", label: "Priorities & Initiatives", description: "Manage first-day directives, provincial initiatives, and progress meters", category: "CONTENT" },
  { id: "cabinet", label: "Cabinet & Former CMs", description: "Update ministers, portfolios, biographies, and historical CM records", category: "GOVERNANCE" },
  { id: "complaints", label: "Complaint Cell / GRM", description: "Review public grievances, assign departments, and update resolution statuses", category: "CITIZEN_SERVICES" },
  { id: "inquiries", label: "Public Inquiries", description: "Manage and respond to official public contact inquiries", category: "CITIZEN_SERVICES" },
  { id: "settings", label: "Portal Settings", description: "Configure secretariat contact details, helpline numbers, and site metadata", category: "GOVERNANCE" },
  { id: "audit_logs", label: "Security Audit Logs", description: "View chronological administrative access and mutation audit records", category: "SECURITY" },
  { id: "users", label: "User Access & Clearances", description: "Manage administrative officers and configure granular employee permissions (Super Admin only)", category: "SECURITY" },
];

export const ROLE_DEFAULT_MODULES: Record<DBUser["role"], AdminModule[]> = {
  SUPER_ADMIN: [
    "chief_minister",
    "vision_mission",
    "priorities",
    "cabinet",
    "news",
    "gallery",
    "complaints",
    "inquiries",
    "settings",
    "audit_logs",
    "users",
  ],
  EDITOR: [
    "chief_minister",
    "vision_mission",
    "priorities",
    "cabinet",
    "news",
    "gallery",
  ],
  GRIEVANCE_OFFICER: [
    "complaints",
    "inquiries",
  ],
};

/**
 * Resolves the authorized modules for a given user.
 * Evaluates custom granular permissions if configured, otherwise falls back to role defaults.
 */
export function getUserAllowedModules(user: DBUser | null): AdminModule[] {
  if (!user || !user.active) return [];
  if (user.role === "SUPER_ADMIN") {
    return ALL_ADMIN_MODULES.map((m) => m.id);
  }

  // If user has specific granular permissions JSON configured
  if (user.permissions) {
    try {
      const parsed = JSON.parse(user.permissions);
      if (Array.isArray(parsed)) {
        // Enforce that non-super-admins can never have "users" module
        return parsed.filter((m: AdminModule) => m !== "users" && ALL_ADMIN_MODULES.some((all) => all.id === m));
      }
    } catch {
      // Fall through to role defaults if JSON invalid
    }
  }

  // Fallback to role defaults
  return ROLE_DEFAULT_MODULES[user.role] || [];
}

/**
 * Checks if a user has explicit clearance for a specific administrative module.
 * Strict deny-by-default behavior.
 */
export function hasModulePermission(user: DBUser | null, module: AdminModule): boolean {
  if (!user || !user.active) return false;
  if (user.role === "SUPER_ADMIN") return true;
  if (module === "users") return false; // Strictly SUPER_ADMIN only

  const allowed = getUserAllowedModules(user);
  return allowed.includes(module);
}

/**
 * Server-side guard that throws if the current session lacks permissions.
 */
export async function requireModulePermission(module: AdminModule): Promise<DBUser> {
  const user = await getCurrentUser();
  if (!user || !user.active) {
    throw new Error("Authentication required.");
  }
  if (!hasModulePermission(user, module)) {
    throw new Error(`Access Denied: Insufficient clearances for the '${module}' module.`);
  }
  return user;
}
