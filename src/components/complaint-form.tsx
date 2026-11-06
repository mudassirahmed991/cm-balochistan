"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const districts = [
  "Quetta",
  "Gwadar",
  "Turbat",
  "Khuzdar",
  "Kalat",
  "Zhob",
  "Sibi",
  "Loralai",
  "Dera Bugti",
  "Naseerabad",
  "Chagai",
  "Panjgur",
  "Other district",
];

const categories = ["Public health", "Education", "Water & sanitation", "Roads & transport", "Electricity", "Local services", "Other"];

const inputClass =
  "w-full rounded-xl glass-input-3d px-4 py-3 text-sm text-pine-950 placeholder:text-pine-900/35";

const labelClass = "mb-1.5 block text-[11px] font-bold tracking-wider text-pine-900/60 uppercase";

export function ComplaintForm() {
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const suffix = Math.floor(1000 + Math.random() * 9000);
    setReference(`CMB-${new Date().getFullYear()}-${suffix}`);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-start justify-center rounded-3xl glass-card-3d p-8 shadow-3d-card border border-white/95 sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl icon-box-3d bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h3 className="font-display mt-6 text-2xl font-bold text-pine-950">Thank you — your complaint is recorded.</h3>
        <p className="mt-3 text-sm leading-relaxed text-pine-900/70">
          Keep the reference number below. Our team will review the details and route your complaint to the responsible department.
        </p>
        <div className="mt-6 w-full rounded-2xl glass-panel-3d border border-dashed border-pine-900/25 px-5 py-4">
          <p className="text-[10px] font-bold tracking-[0.16em] text-pine-900/50 uppercase">Reference number</p>
          <p className="font-mono mt-1 text-2xl font-black text-pine-950">{reference}</p>
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-pine-900/50 font-medium">
          Prototype form — submissions are recorded for the Grievance Redressal Mechanism.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 btn-3d-emerald rounded-2xl px-6 py-3 text-xs font-bold"
        >
          Submit another complaint
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl glass-card-3d p-6 shadow-3d-card border border-white/95 sm:p-8"
      aria-label="Register a complaint"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>Full name</label>
          <input id="name" name="name" required placeholder="Your full name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone number</label>
          <input id="phone" name="phone" type="tel" required placeholder="03xx xxx xxxx" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email (optional)</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" className={inputClass} />
        </div>
        <div>
          <label htmlFor="district" className={labelClass}>District</label>
          <select id="district" name="district" required defaultValue="" className={cn(inputClass, "appearance-none")}>
            <option value="" disabled>Select a district</option>
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="category" className={labelClass}>Complaint category</label>
          <select id="category" name="category" required defaultValue="" className={cn(inputClass, "appearance-none")}>
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>Your complaint</label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            minLength={20}
            placeholder="Describe the issue, where it occurred, and when. Include any reference numbers if you have them."
            className={cn(inputClass, "resize-y")}
          />
        </div>
      </div>

      <label className="mt-5 flex items-start gap-3 text-[11.5px] leading-relaxed text-pine-900/55">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-pine-900/25 accent-pine-800" />
        <span>
          I confirm that the information provided is accurate and consent to it being used to process and follow up on this complaint.
        </span>
      </label>

      <button
        type="submit"
        className="group mt-6 btn-3d-emerald w-full rounded-2xl px-7 py-3.5 text-sm font-bold gap-2.5 sm:w-auto"
      >
        Submit complaint
        <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </button>

      <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-pine-900/40">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Prototype form — submissions are not yet connected to the provincial Complaint Cell database. Urgent matters should be reported by
        phone.
      </p>
    </form>
  );
}
