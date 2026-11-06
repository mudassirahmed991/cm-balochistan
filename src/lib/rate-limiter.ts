/**
 * In-memory sliding window rate limiter for edge/middleware and API routes.
 * Designed for high throughput and zero external dependency.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic garbage collection every 5 minutes to prevent memory leaks
let lastCleanup = Date.now();
function cleanupExpiredRecords(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < 60000) return; // run at most once a minute
  lastCleanup = now;

  for (const [key, record] of rateLimitStore.entries()) {
    record.timestamps = record.timestamps.filter((t) => now - t < windowMs);
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Checks if a key (e.g. `ip:action`) has exceeded the maximum requests allowed within windowSeconds
 */
export function isRateLimited(
  key: string,
  maxRequests: number,
  windowSeconds: number
): { limited: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  cleanupExpiredRecords(windowMs);

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      limited: true,
      remaining: 0,
      retryAfter,
    };
  }

  record.timestamps.push(now);
  return {
    limited: false,
    remaining: Math.max(0, maxRequests - record.timestamps.length),
    retryAfter: 0,
  };
}

/**
 * Tracks failed authentication attempts specifically for brute-force mitigation
 */
const failedLoginAttempts = new Map<string, { count: number; lockedUntil: number }>();

export function checkLoginAttempts(ip: string, maxAttempts = 5, lockoutMinutes = 15): {
  blocked: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const record = failedLoginAttempts.get(ip);

  if (record && record.lockedUntil > now) {
    return {
      blocked: true,
      remainingAttempts: 0,
      retryAfterSeconds: Math.ceil((record.lockedUntil - now) / 1000),
    };
  }

  // If lockout expired, reset
  if (record && record.lockedUntil <= now && record.lockedUntil > 0) {
    failedLoginAttempts.delete(ip);
  }

  const currentCount = failedLoginAttempts.get(ip)?.count || 0;
  return {
    blocked: false,
    remainingAttempts: Math.max(0, maxAttempts - currentCount),
    retryAfterSeconds: 0,
  };
}

export function recordFailedLogin(ip: string, maxAttempts = 5, lockoutMinutes = 15): {
  blockedNow: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const record = failedLoginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
  record.count += 1;

  if (record.count >= maxAttempts) {
    record.lockedUntil = now + lockoutMinutes * 60 * 1000;
    failedLoginAttempts.set(ip, record);
    return {
      blockedNow: true,
      remainingAttempts: 0,
      retryAfterSeconds: lockoutMinutes * 60,
    };
  }

  failedLoginAttempts.set(ip, record);
  return {
    blockedNow: false,
    remainingAttempts: maxAttempts - record.count,
    retryAfterSeconds: 0,
  };
}

export function resetLoginAttempts(ip: string): void {
  failedLoginAttempts.delete(ip);
}

/**
 * Extracts the real client IP address from standard reverse-proxy headers
 */
export function getClientIp(headers: Headers): string {
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const first = xForwardedFor.split(",")[0].trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();
  return "127.0.0.1";
}
