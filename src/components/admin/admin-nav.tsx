"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Settings,
  ShieldCheck,
  Target,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAdminAction } from "@/app/actions/admin";
import type { Role } from "@/lib/db";
import type { AdminModule } from "@/lib/auth";

interface AdminNavProps {
  userRole: Role;
  allowedModules?: AdminModule[];
  onNavigate?: () => void;
}

export function AdminNav({ userRole, allowedModules, onNavigate }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      label: "Overview",
      href: "/enter",
      icon: LayoutDashboard,
      module: null,
    },
    {
      label: "CM Profile & Welcome",
      href: "/enter/chief-minister",
      icon: User,
      module: "chief_minister" as AdminModule,
    },
    {
      label: "Vision & Mission",
      href: "/enter/vision-mission",
      icon: Target,
      module: "vision_mission" as AdminModule,
    },
    {
      label: "Priorities & Initiatives",
      href: "/enter/priorities",
      icon: Compass,
      module: "priorities" as AdminModule,
    },
    {
      label: "Cabinet Members",
      href: "/enter/cabinet",
      icon: Users,
      module: "cabinet" as AdminModule,
    },
    {
      label: "News & Media Room",
      href: "/enter/news",
      icon: Newspaper,
      module: "news" as AdminModule,
    },
    {
      label: "Media & Video Gallery",
      href: "/enter/gallery",
      icon: ImageIcon,
      module: "gallery" as AdminModule,
    },
    {
      label: "Portal Settings",
      href: "/enter/settings",
      icon: Settings,
      module: "settings" as AdminModule,
    },
    {
      label: "Users & Security",
      href: "/enter/users",
      icon: ShieldCheck,
      module: "users" as AdminModule,
    },
    {
      label: "Audit Logs",
      href: "/enter/audit-logs",
      icon: History,
      module: "audit_logs" as AdminModule,
    },
  ];

  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        // Super Admin has universal access to every module
        if (userRole !== "SUPER_ADMIN") {
          // If item is tied to a specific module, check user clearance
          if (item.module && allowedModules && !allowedModules.includes(item.module)) {
            return null;
          }
        }

        const isActive =
          item.href === "/enter"
            ? pathname === "/enter" || pathname === "/admin"
            : pathname.startsWith(item.href) || pathname.startsWith(item.href.replace("/enter", "/admin"));

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onNavigate?.()}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 shrink-0",
              isActive
                ? "btn-3d-emerald !justify-start !text-left text-white shadow-3d-btn"
                : "text-pine-950/75 hover:bg-white/90 hover:text-pine-950 hover:shadow-sm hover:translate-x-1"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-gold-300" : "text-pine-700")} />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}

      <div className="pt-4 border-t border-pine-900/10 mt-4 shrink-0">
        <form
          action={async () => {
            await logoutAdminAction();
            router.push("/enter/login");
            router.refresh();
          }}
        >
          <button
            type="submit"
            className="w-full rounded-xl btn-3d-danger py-2.5 text-xs font-bold gap-2.5 !justify-start px-3.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0 text-white" />
            <span>End Official Session</span>
          </button>
        </form>
      </div>
    </nav>
  );
}
