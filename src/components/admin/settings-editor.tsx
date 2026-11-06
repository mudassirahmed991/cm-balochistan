"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { saveSettingsAction } from "@/app/actions/admin";
import type { DBWebsiteSetting } from "@/lib/db";

export function SettingsEditor({ settings }: { settings: DBWebsiteSetting[] }) {
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const settingsMap = settings.reduce<Record<string, string>>((acc, s) => {
    acc[s.key] = s.valueEn;
    return acc;
  }, {});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await saveSettingsAction(null, formData);
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

      {/* Portal General Settings */}
      <div className="glass-card-3d rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-display text-lg font-bold text-pine-950">
            Portal Identity & Metadata
          </h3>
          <p className="mt-0.5 text-xs text-pine-900/60">
            Provincial title, taglines, and public office branding.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="site_name" className={labelClass}>Portal Title</label>
            <input
              id="site_name"
              name="site_name"
              defaultValue={settingsMap.site_name || "Office of the Chief Minister of Balochistan"}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="portal_tagline" className={labelClass}>Tagline</label>
            <input
              id="portal_tagline"
              name="portal_tagline"
              defaultValue={settingsMap.portal_tagline || "A stronger, fairer and more prosperous Balochistan."}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="secretariat_address" className={labelClass}>Secretariat Physical Address</label>
          <input
            id="secretariat_address"
            name="secretariat_address"
            defaultValue={settingsMap.secretariat_address || "Chief Minister House, Zarghoon Road, Quetta, Balochistan"}
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Helplines & Contact Info */}
      <div className="glass-card-3d rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-display text-lg font-bold text-pine-950">
            Helplines & Public Contact Channels
          </h3>
          <p className="mt-0.5 text-xs text-pine-900/60">
            Emergency numbers and grievance contact routes displayed in headers, footers, and GRM sections.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="complaint_helpline" className={labelClass}>Grievance Cell Helpline</label>
            <input
              id="complaint_helpline"
              name="complaint_helpline"
              defaultValue={settingsMap.complaint_helpline || "1122 / 081-9201500"}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="cm_office_phone" className={labelClass}>Secretariat PBX Exchange</label>
            <input
              id="cm_office_phone"
              name="cm_office_phone"
              defaultValue={settingsMap.cm_office_phone || "+92 81 920 1234"}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="official_email" className={labelClass}>Official Public Email</label>
            <input
              id="official_email"
              name="official_email"
              type="email"
              defaultValue={settingsMap.official_email || "info@cm.balochistan.gob.pk"}
              required
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="btn-3d-emerald inline-flex items-center gap-2 px-8 py-4 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Settings...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Portal Configuration
            </>
          )}
        </button>
      </div>
    </form>
  );
}
