"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;
      // Show arrow when scrolled down near the end of the page (within 900px of bottom)
      const isNearEnd = scrollPosition >= totalHeight - 900;
      setVisible(isNearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/enter") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        position: "fixed",
        right: "24px",
        bottom: "92px",
        left: "auto",
        zIndex: 9998,
      }}
      className={cn(
        "!fixed floating-bottom-right-btn flex h-12 w-12 items-center justify-center rounded-2xl btn-3d-emerald !p-0 shadow-3d-btn cursor-pointer transition-all duration-300",
        visible ? "translate-y-0 opacity-100 pointer-events-auto" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
