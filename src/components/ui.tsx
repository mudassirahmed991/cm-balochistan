import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContourPattern } from "./patterns";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Eyebrow(props: {
  children?: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  void props;
  return null;
}

type ButtonVariant = "primary" | "gold" | "light" | "outline" | "outlineLight";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "btn-3d-emerald rounded-full shadow-3d-btn",
  gold: "btn-3d-gold rounded-full",
  light: "btn-3d-glass rounded-full",
  outline: "btn-3d-glass rounded-full border border-pine-900/20 text-pine-900 hover:border-pine-600",
  outlineLight: "rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md shadow-sm hover:bg-white/20 hover:border-white/60 active:translate-y-0.5",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  external,
  arrow = true,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
  arrow?: boolean;
}) {
  const classes = cn(
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 min-h-[44px]",
    buttonStyles[variant],
    className,
  );

  const content = (
    <>
      <span className="shrink-0">{children}</span>
      {arrow && (
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

export function TextLink({
  href,
  children,
  tone = "dark",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-semibold",
        tone === "light" ? "text-white hover:text-gold-300" : "text-pine-800 hover:text-pine-600",
        className,
      )}
    >
      <span className="link-underline pb-0.5">{children}</span>
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  tone = "dark",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: { href: string; label: string };
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  void eyebrow;
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        <h2
          className={cn(
            "font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12] tracking-tight text-balance",
            tone === "light" ? "text-white" : "text-pine-950",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("mt-4 text-[0.98rem] leading-relaxed", tone === "light" ? "text-pine-100/75" : "text-pine-900/70")}>
            {description}
          </p>
        )}
      </div>
      {action && <TextLink href={action.href} tone={tone} className="shrink-0">{action.label}</TextLink>}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-white/55">
      <Link href="/" className="transition-colors hover:text-white">
        Home
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span aria-hidden="true" className="text-white/25">/</span>
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="text-white/85">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  children,
  compact = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs: { label: string; href?: string }[];
  children?: ReactNode;
  compact?: boolean;
}) {
  void eyebrow;
  return (
    <section className="grain relative isolate overflow-hidden bg-pine-950">
      <ContourPattern className="text-white/15" />
      <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-pine-600/25 blur-[110px]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" aria-hidden="true" />
      <Container className={cn("relative z-10", compact ? "py-8 sm:py-12 md:py-14" : "pt-8 pb-12 sm:pt-12 sm:pb-18 md:pt-16 md:pb-24")}>
        <Breadcrumbs items={crumbs} />
        <div className={cn("mt-6 sm:mt-8 grid gap-6 sm:gap-8", children ? "lg:grid-cols-[1.6fr_1fr] lg:items-end" : "max-w-4xl")}>
          <div className="w-full">
            <h1 className="font-display mt-2 max-w-4xl text-2xl sm:text-4xl md:text-5xl lg:text-[3.6rem] leading-[1.08] tracking-[-0.015em] text-balance text-white break-words">
              {title}
            </h1>
            {description && (
              <p className="mt-3 sm:mt-5 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-pine-100/70">{description}</p>
            )}
          </div>
          {children && <div className="w-full lg:w-auto lg:justify-self-end">{children}</div>}
        </div>
      </Container>
    </section>
  );
}

export function Pill({ children, tone = "dark", className }: { children: ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase",
        tone === "dark" ? "bg-pine-900/[0.06] text-pine-700" : "bg-white/10 text-white/80",
        className,
      )}
    >
      {children}
    </span>
  );
}
