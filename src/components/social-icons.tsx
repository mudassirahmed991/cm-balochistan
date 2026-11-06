import { cn } from "@/lib/utils";

export type SocialName = "facebook" | "x" | "instagram" | "youtube" | "linkedin" | "tiktok";

/** Brand glyphs drawn inline so the site does not depend on icon-pack branding. */
export function SocialIcon({ name, className }: { name: SocialName; className?: string }) {
  const classes = cn("h-4 w-4", className);

  switch (name) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={classes} aria-hidden="true">
          <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.87.24-1.46 1.49-1.46H16.6V4.35A20 20 0 0 0 14.28 4.2c-2.31 0-3.89 1.41-3.89 4v2.2H7.8v3h2.59V21h3.11Z" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={classes} aria-hidden="true">
          <path d="M17.53 3h2.86l-6.25 7.14L21.5 21h-5.77l-4.52-5.9L5.9 21H3.04l6.69-7.64L2.5 3h5.92l4.08 5.4L17.53 3Zm-1 16.2h1.58L6.6 4.7H4.9l11.63 14.5Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={classes} aria-hidden="true">
          <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
          <circle cx="12" cy="12" r="4.1" />
          <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={classes} aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .586.046.86.13V9.42a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.68a6.34 6.34 0 0 0 10.82 4.48 6.27 6.27 0 0 0 1.87-4.49V8.65a8.28 8.28 0 0 0 5.25 1.85v-3.51a4.93 4.93 0 0 1-1.35-.3Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={classes} aria-hidden="true">
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={classes} aria-hidden="true">
          <path d="M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92A1.96 1.96 0 0 0 5.25 3ZM21 13.68c0-3.4-1.82-4.99-4.24-4.99a3.66 3.66 0 0 0-3.32 1.83V8.5H10.1V21h3.38v-6.65c0-1.75.33-3.45 2.5-3.45 2.14 0 2.17 2 2.17 3.56V21H21v-7.32Z" />
        </svg>
      );
  }
}
