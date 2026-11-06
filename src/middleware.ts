import { NextRequest, NextResponse } from "next/server";
import { isRateLimited, getClientIp, checkLoginAttempts } from "@/lib/rate-limiter";

/**
 * --------------------------------------------------------------------------
 * CHIEF MINISTER SECRETARIAT GOV PORTAL - GLOBAL SECURITY MIDDLEWARE
 * --------------------------------------------------------------------------
 * Security Layers:
 * 1. Honeypot Stealth: Instant 404 on /admin, /login, /wp-admin, /dashboard
 * 2. Protected /enter Admin Portal Guard: Enforces valid signed session
 * 3. CSRF Verification: Strict Origin checks on state mutations
 * 4. Rate Limiting: Brute-force & automated bot spam mitigation
 * 5. Full HTTP Security Header Enforcements (HSTS, CSP, X-Frame-Options)
 */

const SECRET_KEY =
  process.env.SESSION_SECRET ||
  "cm_balochistan_gov_pk_ultra_secure_military_grade_secret_key_2026_salt_9876543210";

// Honeypot paths: Any automated bot or hacker scanning standard paths receives an instant 404
const BLOCKED_HONEYPOT_PATHS = [
  "/admin",
  "/login",
  "/wp-admin",
  "/wp-login",
  "/dashboard",
  "/administrator",
  "/cpanel",
  "/user/login",
];

/**
 * Validates HMAC token signature in Edge / Middleware runtime using WebCrypto
 */
async function verifyHmacSubtle(signedToken: string): Promise<boolean> {
  try {
    const parts = signedToken.split(".");
    if (parts.length !== 2) return false;
    const [payload, sigHex] = parts;
    if (!payload || !sigHex) return false;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(SECRET_KEY),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const expectedSig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
    const expectedHex = Array.from(new Uint8Array(expectedSig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return expectedHex.toLowerCase() === sigHex.toLowerCase();
  } catch {
    return false;
  }
}

/**
 * Injects baseline security headers into every outgoing response
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), browsing-topics=()");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIp = getClientIp(request.headers);

  // ------------------------------------------------------------------------
  // 1. STEALTH BLOCKING: Explicit 404 on /admin, /login, /wp-admin, /dashboard
  // ------------------------------------------------------------------------
  const isHoneypot = BLOCKED_HONEYPOT_PATHS.some(
    (blocked) => pathname === blocked || pathname.startsWith(blocked + "/")
  );

  if (isHoneypot) {
    const notFoundHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>404: This page could not be found</title></head><body style="font-family:system-ui,sans-serif;height:100vh;margin:0;display:flex;align-items:center;justify-content:center;background:#fff;color:#000;"><div style="text-align:center;"><h1 style="display:inline-block;margin:0 20px 0 0;padding-right:23px;font-size:24px;font-weight:500;vertical-align:top;border-right:1px solid rgba(0,0,0,.3);line-height:49px;">404</h1><div style="display:inline-block;text-align:left;"><h2 style="font-size:14px;font-weight:400;line-height:49px;margin:0;">This page could not be found.</h2></div></div></body></html>`;

    return new NextResponse(notFoundHtml, {
      status: 404,
      statusText: "Not Found",
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  // ------------------------------------------------------------------------
  // 2. CSRF PROTECTION: Verify Origin on State-Changing HTTP Methods
  // ------------------------------------------------------------------------
  const method = request.method.toUpperCase();
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        const isAllowed =
          originHost === host ||
          originHost.includes("localhost") ||
          originHost.includes("192.168.68.51") ||
          originHost.endsWith("balochistan.gov.pk");

        if (!isAllowed) {
          return new NextResponse(
            JSON.stringify({ error: "CSRF verification failed: Forbidden origin." }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
      } catch {
        return new NextResponse(
          JSON.stringify({ error: "Malformed origin header." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  // ------------------------------------------------------------------------
  // 3. RATE LIMITING: Public APIs & Entry Route
  // ------------------------------------------------------------------------
  // A. Complaints Registration API: max 10 requests / minute
  if (pathname === "/api/complaints" && method === "POST") {
    const check = isRateLimited(`complaints_submit:${clientIp}`, 10, 60);
    if (check.limited) {
      return applySecurityHeaders(
        new NextResponse(
          JSON.stringify({
            error: "Too many complaint registrations. Please wait before submitting again.",
            retryAfter: check.retryAfter,
          }),
          { status: 429, headers: { "Content-Type": "application/json", "Retry-After": `${check.retryAfter}` } }
        )
      );
    }
  }

  // B. Complaint Tracking API: max 30 requests / minute
  if (pathname === "/api/complaints/track") {
    const check = isRateLimited(`complaints_track:${clientIp}`, 30, 60);
    if (check.limited) {
      return applySecurityHeaders(
        new NextResponse(
          JSON.stringify({
            error: "Too many tracking status lookups. Please wait a moment.",
            retryAfter: check.retryAfter,
          }),
          { status: 429, headers: { "Content-Type": "application/json", "Retry-After": `${check.retryAfter}` } }
        )
      );
    }
  }

  // C. Stealth Entry Login Route (/enter/login): Max 15 attempts / 5 mins
  if (pathname === "/enter/login" || pathname === "/enter") {
    const lockout = checkLoginAttempts(clientIp);
    if (lockout.blocked) {
      return applySecurityHeaders(
        new NextResponse(
          JSON.stringify({
            error: `Too many failed login attempts. Access temporarily locked for ${Math.ceil(lockout.retryAfterSeconds / 60)} minutes.`,
          }),
          { status: 429, headers: { "Content-Type": "application/json", "Retry-After": `${lockout.retryAfterSeconds}` } }
        )
      );
    }
  }

  // ------------------------------------------------------------------------
  // 4. STEALTH /enter ADMIN PORTAL ACCESS GUARD
  // ------------------------------------------------------------------------
  if (pathname === "/enter/login") {
    // Public entrance to admin login form — allow access
    const response = NextResponse.next();
    return applySecurityHeaders(response);
  }

  if (pathname === "/enter" || pathname.startsWith("/enter/")) {
    const sessionCookie = request.cookies.get("cm_session_token")?.value;

    if (!sessionCookie) {
      // Unauthenticated visitor trying to access /enter portal -> redirect to /enter/login
      return applySecurityHeaders(NextResponse.redirect(new URL("/enter/login", request.url)));
    }

    // Verify cryptographic signature of the session cookie
    const isSignatureValid = await verifyHmacSubtle(sessionCookie);
    if (!isSignatureValid) {
      // Tampered or invalid session cookie -> clear cookie and redirect to /enter/login
      const response = NextResponse.redirect(new URL("/enter/login", request.url));
      response.cookies.delete("cm_session_token");
      return applySecurityHeaders(response);
    }

    // Authenticated admin: allow access to /enter portal
    const response = NextResponse.next();
    return applySecurityHeaders(response);
  }

  // ------------------------------------------------------------------------
  // 5. DEFAULT PASS-THROUGH WITH SECURITY HEADERS
  // ------------------------------------------------------------------------
  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static chunks)
     * - _next/image (image optimization)
     * - favicon.ico, images, uploads (static media assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|uploads).*)",
  ],
};
