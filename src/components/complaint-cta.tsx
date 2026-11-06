import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, Mail, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { Container, Eyebrow } from "./ui";
import { ContourPattern } from "./patterns";
import { Reveal } from "./reveal";

export function ComplaintCta() {
  return (
    <section className="grain relative isolate overflow-hidden bg-pine-950">
      <ContourPattern className="text-white/15" />
      <div className="absolute -top-24 left-1/4 h-[360px] w-[360px] rounded-full bg-gold-500/10 blur-[110px]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" aria-hidden="true" />

      <Container className="relative z-10 py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_0.75fr]">
          <Reveal>
            <Eyebrow tone="light">Complaint Cell</Eyebrow>
            <h2 className="font-display mt-5 max-w-2xl text-3xl leading-[1.08] text-balance text-white sm:text-4xl lg:text-[3rem]">
              Your voice matters. <span className="text-pine-200">We are listening.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-pine-100/65 sm:text-base">
              Report a problem with a public service, share a concern, or follow up on an earlier request. Every complaint is logged,
              routed to the responsible department, and tracked to closure.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/connect#complaint"
                className="btn-3d-gold rounded-full px-6 py-3.5 text-sm font-semibold gap-2.5"
              >
                Register a complaint
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/connect"
                className="btn-3d-glass !text-white !bg-white/10 !border-white/20 rounded-full px-6 py-3.5 text-sm font-semibold gap-2 hover:!bg-white/20"
              >
                Contact the office
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-3xl glass-dark-3d p-7 shadow-3d-card border border-white/15">
              <p className="text-[10px] font-bold tracking-[0.2em] text-gold-300 uppercase">Reach us directly</p>
              <div className="mt-6 space-y-5">
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="group flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-300 shadow-sm transition-transform group-hover:scale-105">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[11px] text-white/50">Complaint helpline</span>
                    <span className="mt-0.5 block text-sm font-bold text-white transition-colors group-hover:text-gold-200">
                      {site.phone}
                    </span>
                  </span>
                </a>
                <a href={`mailto:${site.email}`} className="group flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-300 shadow-sm transition-transform group-hover:scale-105">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[11px] text-white/50">Email the office</span>
                    <span className="mt-0.5 block text-sm font-bold text-white transition-colors group-hover:text-gold-200">
                      {site.email}
                    </span>
                  </span>
                </a>
                <div className="flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-300 shadow-sm">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[11px] text-white/50">Office hours</span>
                    <span className="mt-0.5 block text-sm font-bold text-white">{site.officeHours}</span>
                  </span>
                </div>
              </div>
              <p className="mt-6 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-white/45">
                Complaints are acknowledged within three working days. Urgent matters are escalated to the relevant department the same day.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
