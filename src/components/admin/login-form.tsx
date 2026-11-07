"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { loginAdminAction } from "@/app/actions/admin";

export function AdminLoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await loginAdminAction(null, formData);
      if (res.success) {
        setSuccess(true);
        router.push("/enter");
        router.refresh();
      } else {
        setError(res.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-600 shrink-0" />
          <p>Credentials verified. Launching administration panel...</p>
        </div>
      )}

      <div>
        <label htmlFor="admin-email" className="mb-1.5 block text-[11px] font-bold tracking-wider text-pine-900/60 uppercase">
          Official Email Address
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-pine-900/40">
            <Mail className="h-4 w-4" />
          </div>
          <input
            id="admin-email"
            name="email"
            type="email"
            required
            autoComplete="off"
            placeholder="officer@balochistan.gov.pk"
            className="w-full rounded-xl glass-input-3d pl-11 pr-4 py-3.5 text-xs sm:text-sm text-pine-950 placeholder:text-pine-900/35"
          />
        </div>
      </div>

      <div>
        <label htmlFor="admin-password" className="mb-1.5 block text-[11px] font-bold tracking-wider text-pine-900/60 uppercase">
          Secretariat Access Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-pine-900/40">
            <Lock className="h-4 w-4" />
          </div>
          <input
            id="admin-password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••••••••••"
            className="w-full rounded-xl glass-input-3d pl-11 pr-4 py-3.5 text-xs sm:text-sm text-pine-950 placeholder:text-pine-900/35"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending || success}
        className="w-full rounded-xl btn-3d-emerald py-4 text-xs font-bold gap-2 disabled:opacity-50 mt-2"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Authenticating...
          </>
        ) : (
          <>
            Sign In to Administration
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
