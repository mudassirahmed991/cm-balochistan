"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { updateVisionMissionAction } from "@/app/actions/admin";
import type { DBVisionMission } from "@/lib/db";

export function VisionMissionEditor({ record }: { record: DBVisionMission }) {
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateVisionMissionAction(null, formData);
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

      {/* Vision */}
      <div className="glass-card-3d rounded-3xl p-6 sm:p-8 space-y-5">
        <div>
          <h3 className="font-display text-lg font-bold text-pine-950">
            Provincial Vision Statement
          </h3>
          <p className="mt-0.5 text-xs text-pine-900/60">
            Featured as Section 1.3 on the homepage and leadership portal.
          </p>
        </div>

        <div>
          <label htmlFor="visionEn" className={labelClass}>Vision Statement (English)</label>
          <textarea
            id="visionEn"
            name="visionEn"
            rows={4}
            defaultValue={record.visionEn}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="visionUr" className={labelClass}>Vision Statement (Urdu)</label>
          <textarea
            id="visionUr"
            name="visionUr"
            rows={3}
            defaultValue={record.visionUr || ""}
            className={inputClass}
            dir="rtl"
          />
        </div>
      </div>

      {/* Mission */}
      <div className="glass-card-3d rounded-3xl p-6 sm:p-8 space-y-5">
        <div>
          <h3 className="font-display text-lg font-bold text-pine-950">
            Executive Mission Statement
          </h3>
          <p className="mt-0.5 text-xs text-pine-900/60">
            Institutional commitments to transparent governance, rapid service delivery, and sustainable development.
          </p>
        </div>

        <div>
          <label htmlFor="missionEn" className={labelClass}>Mission Statement (English)</label>
          <textarea
            id="missionEn"
            name="missionEn"
            rows={4}
            defaultValue={record.missionEn}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="missionUr" className={labelClass}>Mission Statement (Urdu)</label>
          <textarea
            id="missionUr"
            name="missionUr"
            rows={3}
            defaultValue={record.missionUr || ""}
            className={inputClass}
            dir="rtl"
          />
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
              Saving Statements...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Vision & Mission
            </>
          )}
        </button>
      </div>
    </form>
  );
}
