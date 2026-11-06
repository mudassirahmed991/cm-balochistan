"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { updateCmProfileAction } from "@/app/actions/admin";
import type { DBChiefMinisterProfile } from "@/lib/db";

export function CmProfileEditor({ profile }: { profile: DBChiefMinisterProfile }) {
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Parse bio paragraphs
  let bioText = "";
  try {
    const arr = JSON.parse(profile.bioParagraphsEn);
    bioText = Array.isArray(arr) ? arr.join("\n\n") : profile.bioParagraphsEn;
  } catch {
    bioText = profile.bioParagraphsEn;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateCmProfileAction(null, formData);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
      } else {
        setStatusMessage({ type: "error", text: res.message });
      }
    });
  }

  const inputClass =
    "glass-input-3d w-full rounded-2xl px-4 py-3 text-xs sm:text-sm text-pine-950 placeholder:text-pine-900/40";
  const labelClass = "mb-1.5 block text-[11px] font-bold tracking-wider text-pine-900/70 uppercase";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {statusMessage && (
        <div
          className={`glass-card-3d rounded-2xl p-4 text-xs flex items-center gap-3 border ${
            statusMessage.type === "success"
              ? "border-emerald-300 bg-emerald-50/80 text-emerald-800"
              : "border-red-300 bg-red-50/80 text-red-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <p className="font-semibold">{statusMessage.text}</p>
        </div>
      )}

      {/* 1. Official Identity & Office Details */}
      <div className="glass-card-3d rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-display text-lg font-bold text-pine-950">
            Official Identity & Office Data
          </h3>
          <p className="mt-0.5 text-xs text-pine-900/60">
            Constitutional leadership details displayed across the portal header, hero, and bio.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="nameEn" className={labelClass}>Full Legal Name (English)</label>
            <input id="nameEn" name="nameEn" defaultValue={profile.nameEn} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="nameUr" className={labelClass}>Full Name (Urdu)</label>
            <input id="nameUr" name="nameUr" defaultValue={profile.nameUr || ""} className={inputClass} dir="rtl" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="titleEn" className={labelClass}>Official Title (English)</label>
            <input id="titleEn" name="titleEn" defaultValue={profile.titleEn} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="titleUr" className={labelClass}>Official Title (Urdu)</label>
            <input id="titleUr" name="titleUr" defaultValue={profile.titleUr || ""} className={inputClass} dir="rtl" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-4">
          <div>
            <label htmlFor="inOfficeSince" className={labelClass}>In Office Since</label>
            <input id="inOfficeSince" name="inOfficeSince" defaultValue={profile.inOfficeSince} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="party" className={labelClass}>Political Affiliation</label>
            <input id="party" name="party" defaultValue={profile.party} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="termLength" className={labelClass}>Term Length</label>
            <input id="termLength" name="termLength" defaultValue={profile.termLength} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="assembly" className={labelClass}>Constituency</label>
            <input id="assembly" name="assembly" defaultValue={profile.assembly} required className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="residence" className={labelClass}>Official Secretariat Residence</label>
          <input id="residence" name="residence" defaultValue={profile.residence} required className={inputClass} />
        </div>
      </div>

      {/* 2. Official Welcome Message */}
      <div className="glass-card-3d rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-display text-lg font-bold text-pine-950">
            Welcome Message (Section 1.2 of Requirements)
          </h3>
          <p className="mt-0.5 text-xs text-pine-900/60">
            Featured immediately under the Hero section on the homepage and at the top of the About CM page.
          </p>
        </div>

        <div>
          <label htmlFor="welcomeMessageEn" className={labelClass}>
            Welcome Message (English)
          </label>
          <textarea
            id="welcomeMessageEn"
            name="welcomeMessageEn"
            rows={5}
            defaultValue={profile.welcomeMessageEn}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="welcomeMessageUr" className={labelClass}>
            Welcome Message (Urdu Translation)
          </label>
          <textarea
            id="welcomeMessageUr"
            name="welcomeMessageUr"
            rows={4}
            defaultValue={profile.welcomeMessageUr || ""}
            className={inputClass}
            dir="rtl"
          />
        </div>
      </div>

      {/* 3. Official Quote & Biography */}
      <div className="glass-card-3d rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-display text-lg font-bold text-pine-950">
            Key Quote & Biographical Narrative
          </h3>
          <p className="mt-0.5 text-xs text-pine-900/60">
            Paragraphs will be rendered in order. Separate paragraphs with double line breaks.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="quoteEn" className={labelClass}>Official Quote (English)</label>
            <input id="quoteEn" name="quoteEn" defaultValue={profile.quoteEn} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="quoteUr" className={labelClass}>Official Quote (Urdu)</label>
            <input id="quoteUr" name="quoteUr" defaultValue={profile.quoteUr || ""} className={inputClass} dir="rtl" />
          </div>
        </div>

        <div>
          <label htmlFor="bioParagraphsEn" className={labelClass}>
            Biography Paragraphs (English — separate with blank line)
          </label>
          <textarea
            id="bioParagraphsEn"
            name="bioParagraphsEn"
            rows={6}
            defaultValue={bioText}
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex justify-end sticky bottom-6 z-20">
        <button
          type="submit"
          disabled={isPending}
          className="btn-3d-emerald inline-flex items-center gap-2 px-8 py-4 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Profile Changes...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Chief Minister Profile
            </>
          )}
        </button>
      </div>
    </form>
  );
}
