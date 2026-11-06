"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, ShieldCheck, X } from "lucide-react";
import { AdminNav } from "./admin-nav";
import type { Role } from "@/lib/db";
import type { AdminModule } from "@/lib/auth";

interface AdminShellProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  allowedModules: AdminModule[];
  children: React.ReactNode;
}

export function AdminShell({ user, allowedModules, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar drawer automatically on navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll and listen for Escape key when mobile drawer is open
  useEffect(() => {
    if (!sidebarOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sidebarOpen]);

  const roleLabels: Record<string, { label: string; color: string }> = {
    SUPER_ADMIN: { label: "Super Admin", color: "bg-purple-100 text-purple-900 border-purple-300" },
    EDITOR: { label: "Information Officer", color: "bg-blue-100 text-blue-900 border-blue-300" },
    GRIEVANCE_OFFICER: { label: "Grievance Officer", color: "bg-amber-100 text-amber-900 border-amber-300" },
  };

  const badge = roleLabels[user.role] || { label: user.role, color: "bg-gray-100 text-gray-800" };

  return (
    <div className="min-h-screen bg-sand/40 flex">
      {/* 1. DESKTOP SIDEBAR (Fixed left on lg: 1024px and above) */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-40 glass-panel-3d border-r border-white/80 shrink-0 justify-between">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Header */}
          <div className="p-5 border-b border-pine-900/10 flex items-center gap-3 shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl image-3d-frame p-1.5 shrink-0">
              <Image
                src="/images/balochistan-logo.png"
                alt="Government of Balochistan"
                width={36}
                height={36}
                className="h-auto w-auto object-contain drop-shadow pointer-events-none select-none"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-sm text-pine-950 leading-tight truncate">
                CM Balochistan
              </p>
              <p className="text-[10px] font-semibold text-pine-900/60 uppercase tracking-wider truncate">
                CMS Administration
              </p>
            </div>
          </div>

          {/* Navigation Links (Scrollable) */}
          <div className="flex-1 overflow-y-auto">
            <AdminNav userRole={user.role} allowedModules={allowedModules} />
          </div>
        </div>

        {/* User Profile Badge at bottom of Desktop sidebar */}
        <div className="p-3.5 glass-card-3d m-3 rounded-2xl border border-white/90 shadow-sm shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl icon-box-3d bg-pine-900 text-white font-bold text-xs shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-xs font-bold text-pine-950 truncate">{user.name}</p>
              <p className="text-[10px] text-pine-900/60 truncate">{user.email}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wide truncate ${badge.color}`}>
              {badge.label}
            </span>
            <span className="flex items-center gap-1 text-[9px] text-emerald-700 font-semibold shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Active
            </span>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE / TABLET SLIDE-OVER DRAWER (< 1024px) */}
      {sidebarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Administrative Navigation Menu"
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Dark Backdrop Overlay with blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-Over Drawer Panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-sand/95 backdrop-blur-2xl border-r border-pine-900/15 shadow-2xl flex flex-col justify-between h-[100dvh] lg:hidden animate-in slide-in-from-left duration-300">
            <div className="flex flex-col flex-1 min-h-0">
              {/* Drawer Header: Logo + Title + Close Button */}
              <div className="p-4 border-b border-pine-900/10 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl image-3d-frame p-1 shrink-0">
                    <Image
                      src="/images/balochistan-logo.png"
                      alt="Government of Balochistan"
                      width={32}
                      height={32}
                      className="h-auto w-auto object-contain drop-shadow"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm text-pine-950 leading-tight truncate">
                      CM Balochistan
                    </p>
                    <p className="text-[10px] font-semibold text-pine-900/60 uppercase tracking-wider truncate">
                      CMS Administration
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-pine-900/15 text-pine-900 hover:bg-white/80 active:scale-95 cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="flex-1 overflow-y-auto">
                <AdminNav
                  userRole={user.role}
                  allowedModules={allowedModules}
                  onNavigate={() => setSidebarOpen(false)}
                />
              </div>
            </div>

            {/* User Profile Badge at bottom of Mobile drawer */}
            <div className="p-3.5 glass-card-3d m-3 rounded-2xl border border-white/90 shadow-sm shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl icon-box-3d bg-pine-900 text-white font-bold text-xs shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 overflow-hidden">
                  <p className="text-xs font-bold text-pine-950 truncate">{user.name}</p>
                  <p className="text-[10px] text-pine-900/60 truncate">{user.email}</p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wide truncate ${badge.color}`}>
                  {badge.label}
                </span>
                <span className="flex items-center gap-1 text-[9px] text-emerald-700 font-semibold shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN DASHBOARD CONTENT AREA (Offset by lg:pl-64 on desktop, full-width on mobile) */}
      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/80 glass-panel-3d px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          {/* Left: 3-Bar Hamburger Button (< 1024px) & Portal Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* 3-Bar Hamburger Menu Button (☰) */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation sidebar"
              className="inline-flex lg:hidden items-center justify-center h-10 w-10 rounded-xl icon-box-3d text-pine-950 shrink-0 cursor-pointer active:scale-95 transition-all"
            >
              <span className="sr-only">Toggle Sidebar Menu</span>
              <div className="flex flex-col items-center justify-center w-5 h-5 gap-1" aria-hidden="true">
                <span className="w-5 h-[2px] bg-pine-950 rounded-full transition-all" />
                <span className="w-5 h-[2px] bg-pine-950 rounded-full transition-all" />
                <span className="w-5 h-[2px] bg-pine-950 rounded-full transition-all" />
              </div>
            </button>

            <div className="flex items-center gap-2 text-xs min-w-0">
              <div className="p-1 icon-box-3d text-pine-700 shrink-0 hidden min-[360px]:flex">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold text-pine-950 truncate">
                Official Administrative Portal
              </span>
              <span className="hidden md:inline text-pine-900/60 truncate">
                · Government of Balochistan
              </span>
            </div>
          </div>

          {/* Right: View Public Portal Button */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-glass rounded-xl px-2.5 sm:px-3.5 py-1.5 text-xs font-bold gap-1.5 inline-flex items-center"
            >
              <span className="hidden sm:inline">View Public Portal</span>
              <span className="sm:hidden">Portal</span>
              <ExternalLink className="h-3.5 w-3.5 text-pine-700 shrink-0" />
            </Link>
          </div>
        </header>

        {/* Main Content Container (Zero Squishing & Zero Horizontal Overflow) */}
        <main className="flex-1 w-full max-w-7xl mx-auto min-w-0 max-w-full overflow-x-hidden px-3 sm:px-6 py-4 sm:py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
