"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Mail, Phone, X } from "lucide-react";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SearchDialog } from "./search-dialog";
import { SocialIcon } from "./social-icons";
import { useLanguage } from "@/lib/i18n";

export function SiteHeader() {
  const pathname = usePathname();

  // Do not render public website header inside the administration portal
  if (pathname.startsWith("/enter") || pathname.startsWith("/admin")) {
    return null;
  }

  const { locale, setLocale, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const isActive = (href?: string) =>
    href ? pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)) : false;

  return (
    <>


      {/* Main header */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300 w-full",
          scrolled
            ? "glass-panel-3d border-white/80 shadow-[0_12px_36px_-10px_rgba(31,41,55,0.12)] backdrop-blur-xl"
            : "border-black/5 bg-white/90 backdrop-blur-md",
        )}
      >
        <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* MOBILE, TABLET & IPAD ONLY (< 1280px / xl:hidden):
              Left side controls: 3-Bar Hamburger Menu Button (☰) & Search Icon
          */}
          <div className="flex xl:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-pine-900/15 bg-white/90 text-pine-950 shadow-sm transition-all duration-200 hover:bg-pine-100 hover:border-pine-900/30 active:scale-95 cursor-pointer shrink-0 header-tactile-btn"
            >
              <span className="sr-only">Toggle Menu</span>
              <div className="flex flex-col items-center justify-center w-5 h-5 gap-1" aria-hidden="true">
                <span className="w-5 h-[2px] bg-pine-950 rounded-full transition-all" />
                <span className="w-5 h-[2px] bg-pine-950 rounded-full transition-all" />
                <span className="w-5 h-[2px] bg-pine-950 rounded-full transition-all" />
              </div>
            </button>

            <SearchDialog compact />
          </div>

          {/* LOGO & TITLE:
              - Mobile / Tablet / iPad (< xl): Displayed on the RIGHT SIDE (flex-row-reverse text-right)
              - Desktop (xl+): Displayed on the LEFT SIDE (xl:order-1 xl:flex-row xl:text-left)
          */}
          <Link
            href="/"
            className="group shrink-0 flex items-center gap-2 sm:gap-3 flex-row-reverse text-right xl:flex-row xl:text-left xl:order-1"
            aria-label={`${site.fullName} — home`}
          >
            {/* 3D Rotating Logo Seal */}
            <div className="perspective-600 relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center">
              <div
                className="logo-spin-3d flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center shrink-0"
                style={{
                  animation: "logo-spin-3d 6s linear infinite",
                  WebkitAnimation: "logo-spin-3d 6s linear infinite",
                  transformStyle: "preserve-3d",
                  WebkitTransformStyle: "preserve-3d",
                  transformOrigin: "center center",
                  WebkitTransformOrigin: "center center",
                  willChange: "transform",
                }}
              >
                <Image
                  src="/images/balochistan-logo.png"
                  alt="Government of Balochistan"
                  width={44}
                  height={44}
                  className="h-10 w-10 sm:h-11 sm:w-11 object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.15)] pointer-events-none select-none shrink-0"
                  priority
                />
              </div>
            </div>

            {/* Title Text (Strictly whitespace-nowrap and shrink-0 so it NEVER crushes into letters) */}
            <div className="flex flex-col leading-tight whitespace-nowrap shrink-0">
              <span className="font-display text-xs min-[380px]:text-sm sm:text-base lg:text-lg font-bold tracking-tight text-pine-950 whitespace-nowrap leading-snug">
                {locale === "ur" ? "وزیر اعلیٰ بلوچستان" : "Chief Minister of Balochistan"}
              </span>
              <span className="text-[9px] min-[380px]:text-[10px] sm:text-xs font-semibold tracking-wider text-pine-700/80 uppercase whitespace-nowrap">
                {locale === "ur" ? "حکومت بلوچستان" : "GOVERNMENT OF BALOCHISTAN"}
              </span>
            </div>
          </Link>

          {/* DESKTOP ONLY (xl: 1280px+): Center Navigation Links (order-2) */}
          <nav
            aria-label="Main navigation"
            className="hidden xl:flex items-center gap-2.5 2xl:gap-4 text-xs 2xl:text-sm font-semibold whitespace-nowrap xl:order-2"
          >
            {nav.map((item) =>
              item.children ? (
                <div key={item.label} className="group relative">
                  <button
                    type="button"
                    aria-haspopup="true"
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 2xl:px-3 py-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap header-tactile-btn",
                      isActive(item.children[0]?.href) || item.children.some((child) => isActive(child.href))
                        ? "text-pine-950 bg-pine-100/70 shadow-sm font-bold"
                        : "text-pine-900/75 hover:text-pine-950 hover:bg-white/60",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180 text-pine-700" aria-hidden="true" />
                  </button>
                  <div className="invisible absolute left-0 top-full w-80 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 z-50">
                    <div className="overflow-hidden rounded-2xl glass-card-3d p-2 shadow-3d-hover border border-white/95">
                      {item.children.map((child) =>
                        child.external ? (
                          <a
                            key={child.label}
                            href={child.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group/link flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-pine-100/60 hover:translate-x-1"
                          >
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg icon-box-3d text-pine-700">
                              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-pine-950">{child.label}</span>
                              <span className="mt-0.5 block text-xs leading-relaxed text-pine-900/60">{child.description}</span>
                            </span>
                          </a>
                        ) : (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="group/link flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-pine-100/60 hover:translate-x-1"
                          >
                            <span className="mt-0.5 h-8 w-1 rounded-full bg-pine-300 transition-colors group-hover/link:bg-pine-600" aria-hidden="true" />
                            <span>
                              <span className="block text-sm font-semibold text-pine-950">{child.label}</span>
                              <span className="mt-0.5 block text-xs leading-relaxed text-pine-900/60">{child.description}</span>
                            </span>
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href ?? "/"}
                  className={cn(
                    "relative px-2.5 2xl:px-3 py-1.5 transition-all duration-200 rounded-full whitespace-nowrap header-tactile-btn",
                    isActive(item.href)
                      ? "text-pine-950 font-bold bg-pine-100/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]"
                      : "text-pine-900/75 hover:text-pine-950 hover:bg-white/60",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* DESKTOP ONLY (xl: 1280px+): Right Side Action Buttons (order-3)
              Strictly hidden on mobile, tablet, and iPad via hidden xl:flex & header-desktop-actions
          */}
          <div className="hidden xl:flex items-center gap-2 sm:gap-2.5 shrink-0 xl:order-3 header-desktop-actions">
            <SearchDialog compact />


          </div>
        </div>
      </header>

      {/* Mobile & Tablet & iPad Slide-out Drawer Menu (Contains complete header & portal navigation) */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation menu"
          className="fixed inset-0 z-[120] xl:hidden"
        >
          {/* Backdrop with smooth blur */}
          <div
            className="fixed inset-0 bg-pine-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container (Smooth Slide from left) */}
          <div className="fixed inset-y-0 left-0 w-full sm:max-w-md bg-pine-950 text-white shadow-2xl flex flex-col h-[100dvh] z-[121] border-r border-white/10 animate-in slide-in-from-left duration-300">
            {/* Drawer Top Bar: Logo, Title & Close Button */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 shrink-0">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 min-w-0">
                <div className="perspective-600 relative flex h-10 w-10 shrink-0 items-center justify-center">
                  <div
                    className="logo-spin-3d flex h-10 w-10 items-center justify-center"
                    style={{
                      animation: "logo-spin-3d 6s linear infinite",
                      WebkitAnimation: "logo-spin-3d 6s linear infinite",
                      transformStyle: "preserve-3d",
                      WebkitTransformStyle: "preserve-3d",
                      transformOrigin: "center center",
                      WebkitTransformOrigin: "center center",
                      willChange: "transform",
                    }}
                  >
                    <Image
                      src="/images/balochistan-logo.png"
                      alt="Government of Balochistan"
                      width={40}
                      height={40}
                      className="h-10 w-auto object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.2)] pointer-events-none select-none shrink-0"
                    />
                  </div>
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="font-display block text-sm sm:text-base font-bold text-white whitespace-nowrap truncate">
                    {locale === "ur" ? "وزیر اعلیٰ بلوچستان" : "Chief Minister of Balochistan"}
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-gold-300 uppercase whitespace-nowrap truncate">
                    {locale === "ur" ? "حکومت بلوچستان" : "GOVERNMENT OF BALOCHISTAN"}
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 text-white/80 transition-colors hover:bg-white/10 active:scale-95 cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Drawer Body (Scrollable: Complete Header items) */}
            <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
              {/* Full-width Search Trigger */}
              <div>
                <SearchDialog className="w-full !justify-start !bg-white/10 !border-white/15 !text-white hover:!bg-white/15 !h-11 !px-4 !rounded-xl" />
              </div>



              {/* Navigation Links Accordion */}
              <ul className="space-y-1 pt-2">
                {nav.map((item) =>
                  item.children ? (
                    <li key={item.label} className="border-b border-white/8">
                      <button
                        type="button"
                        onClick={() => setExpanded((current) => (current === item.label ? null : item.label))}
                        aria-expanded={expanded === item.label}
                        className="flex w-full items-center justify-between py-3.5 text-left text-white/90 hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="font-display text-lg font-bold">{item.label}</span>
                        <ChevronDown
                          className={cn("h-4 w-4 text-white/50 transition-transform duration-200", expanded === item.label && "rotate-180 text-gold-300")}
                          aria-hidden="true"
                        />
                      </button>
                      {expanded === item.label && (
                        <ul className="space-y-1.5 pb-4 pl-2">
                          {item.children.map((child) =>
                            child.external ? (
                              <li key={child.label}>
                                <a
                                  href={child.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                  <span>{child.label}</span>
                                  <ArrowUpRight className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
                                </a>
                              </li>
                            ) : (
                              <li key={child.label}>
                                <Link
                                  href={child.href}
                                  onClick={() => setMenuOpen(false)}
                                  className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li key={item.label} className="border-b border-white/8">
                      <Link
                        href={item.href ?? "/"}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between py-3.5 text-white/90 hover:text-white transition-colors"
                      >
                        <span className="font-display text-lg font-bold">{item.label}</span>
                        <ArrowUpRight className="h-4 w-4 text-white/40" aria-hidden="true" />
                      </Link>
                    </li>
                  ),
                )}
              </ul>

              {/* Government Quick Links from Utility Bar */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-white/70">
                <p className="text-[10px] uppercase font-bold text-gold-300 tracking-wider">Government Links</p>
                <div className="flex flex-col gap-2 pt-1">
                  <a href="https://balochistan.gov.pk" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-white">
                    <span>{t("govTitle")}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/40" />
                  </a>
                  <a href="https://www.pabalochistan.gov.pk" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-white">
                    <span>{t("provincialAssembly")}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/40" />
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-white/60 pt-4 border-t border-white/10">
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 text-gold-300" aria-hidden="true" />
                  {site.phone}
                </a>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 text-gold-300" aria-hidden="true" />
                  {site.email}
                </a>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center gap-3 pt-2">
                {site.social.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-white/70 hover:text-gold-300 hover:border-gold-300/40 hover:bg-white/10 transition-colors"
                  >
                    <SocialIcon name={item.icon} className="h-4 w-4" />
                  </a>
                ))}
              </div>

              {/* Accessibility & Language Selector */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-white/50">{locale === "ur" ? "زبان:" : "Language:"}</span>
                  <button
                    type="button"
                    onClick={() => setLocale("en")}
                    className={cn(
                      "rounded px-2.5 py-1 font-semibold transition-all cursor-pointer",
                      locale === "en" ? "bg-white/25 text-white font-bold" : "text-white/70 hover:bg-white/15",
                    )}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale("ur")}
                    className={cn(
                      "rounded px-2.5 py-1 font-semibold transition-all cursor-pointer",
                      locale === "ur" ? "bg-white/25 text-white font-bold" : "text-white/70 hover:bg-white/15",
                    )}
                  >
                    اردو
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/50">{t("textSize")}</span>
                  <button
                    type="button"
                    onClick={() => (document.documentElement.style.fontSize = "16px")}
                    className="rounded px-2 py-1 text-white/70 hover:bg-white/15 cursor-pointer"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => (document.documentElement.style.fontSize = "18px")}
                    className="rounded px-2 py-1 font-bold text-white/70 hover:bg-white/15 cursor-pointer"
                  >
                    A+
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
