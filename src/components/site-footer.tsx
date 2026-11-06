"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { priorities, site } from "@/lib/site";
import { Container } from "./ui";
import { SocialIcon } from "./social-icons";

const cmOfficeLinks = [
  { label: "About Chief Minister", href: "/chief-minister" },
  { label: "Chief Ministers & Cabinet", href: "/chief-ministers" },
  { label: "Media & Video Gallery", href: "/gallery" },
  { label: "About Balochistan", href: "/about-balochistan" },
];

const publicServiceLinks = [
  { label: "Register a Complaint (Official GRM)", href: "https://grmbalochistan.com/complain", external: true },
  { label: "Track Complaint Status", href: "https://grmbalochistan.com/track", external: true },
  { label: "Provincial Assembly", href: "https://www.pabalochistan.gov.pk", external: true },
  { label: "Government of Balochistan", href: "https://balochistan.gov.pk", external: true },
];

const currentYear = new Date().getFullYear();

export function SiteFooter() {
  const pathname = usePathname();

  // Do not render public footer inside the administration portal
  if (pathname.startsWith("/enter") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative isolate overflow-hidden border-t border-pine-900/10 bg-pine-100/70 text-pine-950 backdrop-blur-xl">
      {/* Light-green transparent ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[420px] w-[420px] rounded-full bg-pine-300/30 blur-[130px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 right-10 h-[360px] w-[360px] rounded-full bg-gold-400/15 blur-[120px]" aria-hidden="true" />

      <Container className="relative z-10 pt-16 pb-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
          {/* Column 1: Government Identity & Official Contact */}
          <div>
            <Link href="/" className="group flex items-center gap-3.5" aria-label={`${site.fullName} — home`}>
            {/* 3D Y-Axis Rotating Logo ("3D Y-Axis Rotation") */}
            <div className="perspective-600 relative flex h-12 w-12 shrink-0 items-center justify-center">
              <div
                className="logo-spin-3d flex h-12 w-12 items-center justify-center"
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
                  width={48}
                  height={48}
                  className="h-12 w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)] pointer-events-none select-none"
                />
              </div>
            </div>
              <span className="flex flex-col leading-tight">
                <span className="font-display text-[16px] font-bold tracking-tight text-pine-950">
                  Office of the Chief Minister
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-pine-700 uppercase">
                  Government of Balochistan
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-pine-900/75">
              Official digital portal of the Chief Minister&apos;s Office — serving the people with transparent governance,
              effective public service delivery, and sustainable development across every district.
            </p>

            <div className="mt-6 space-y-2.5 text-xs font-medium text-pine-900/80">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pine-700" aria-hidden="true" />
                <span>{site.address}</span>
              </p>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 transition-colors hover:text-pine-950">
                <Phone className="h-4 w-4 shrink-0 text-pine-700" aria-hidden="true" />
                <span>{site.phone}</span>
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 transition-colors hover:text-pine-950">
                <Mail className="h-4 w-4 shrink-0 text-pine-700" aria-hidden="true" />
                <span>{site.email}</span>
              </a>
            </div>
          </div>

          {/* Column 2: Chief Minister's Office */}
          <div>
            <h2 className="text-[11px] font-bold tracking-[0.18em] text-pine-800 uppercase">Chief Minister&apos;s Office</h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              {cmOfficeLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-pine-900/70 transition-colors hover:text-pine-950 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Priorities */}
          <div>
            <h2 className="text-[11px] font-bold tracking-[0.18em] text-pine-800 uppercase">Immediate Priorities</h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              {priorities.slice(0, 6).map((priority) => (
                <li key={priority.slug}>
                  <Link href={`/priorities/${priority.slug}`} className="text-pine-900/70 transition-colors hover:text-pine-950 hover:underline">
                    {priority.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Public Services & Grievances */}
          <div>
            <h2 className="text-[11px] font-bold tracking-[0.18em] text-pine-800 uppercase">Citizen Services</h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              {publicServiceLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-pine-900/70 transition-colors hover:text-pine-950 hover:underline"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link href={link.href} className="text-pine-900/70 transition-colors hover:text-pine-950 hover:underline">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-2.5">
              {site.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl icon-box-3d text-pine-800 transition-colors hover:text-pine-950"
                >
                  <SocialIcon name={item.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Legal, Privacy & Accessibility Bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-pine-900/10 pt-6 text-xs text-pine-900/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} {site.fullName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/privacy-policy" className="transition-colors hover:text-pine-950 hover:underline">
              Privacy Policy
            </Link>
            <span className="h-3 w-px bg-pine-900/15" aria-hidden="true" />
            <Link href="/terms-of-use" className="transition-colors hover:text-pine-950 hover:underline">
              Terms of Use
            </Link>
            <span className="h-3 w-px bg-pine-900/15" aria-hidden="true" />
            <Link href="/accessibility" className="transition-colors hover:text-pine-950 hover:underline">
              Accessibility
            </Link>
            <span className="h-3 w-px bg-pine-900/15" aria-hidden="true" />
            <span className="rounded-full bg-pine-200/90 px-2.5 py-0.5 font-bold text-pine-900 text-[10px] tracking-wider uppercase border border-pine-300/50 shadow-sm">Official Portal</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
