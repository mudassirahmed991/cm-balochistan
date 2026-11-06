import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContourPattern, Emblem } from "@/components/patterns";

export default function NotFound() {
  return (
    <main id="main-content" className="grain relative isolate flex min-h-[70vh] items-center overflow-hidden bg-pine-950">
      <ContourPattern className="text-white/15" />
      <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-pine-600/25 blur-[110px]" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-2xl px-6 py-24 text-center">
        <Emblem className="mx-auto h-16 w-16" />
        <p className="font-display mt-8 text-7xl leading-none text-gold-300">404</p>
        <h1 className="font-display mt-4 text-3xl text-white sm:text-4xl">This page could not be found.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-pine-100/60">
          The page you are looking for may have moved or no longer exists. You can return to the homepage or explore the office&apos;s priorities.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="btn-3d-gold rounded-2xl px-7 py-3.5 text-sm font-bold gap-2"
          >
            Return home
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/priorities"
            className="btn-3d-glass rounded-2xl px-7 py-3.5 text-sm font-bold gap-2 text-white border-white/20"
          >
            Explore priorities
          </Link>
        </div>
      </div>
    </main>
  );
}
