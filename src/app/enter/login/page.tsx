import { redirect } from "next/navigation";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/login-form";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Official Administration Login | Chief Minister Secretariat Balochistan",
  description: "Secure restricted administrative access for authorized government officers and secretariat staff.",
};

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/enter");
  }

  return (
    <div className="min-h-screen bg-sand flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-pine-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-gold-200/40 blur-[120px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl image-3d-frame mb-4 p-2">
          <Image
            src="/images/balochistan-logo.png"
            alt="Government of Balochistan Coat of Arms"
            width={64}
            height={64}
            className="h-auto w-auto object-contain drop-shadow-md"
          />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-pine-950">
          Secretariat Administration
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-pine-900/65">
          Office of the Chief Minister · Government of Balochistan
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="rounded-3xl glass-card-3d p-8 sm:p-10 shadow-3d-card border border-white/95">
          <AdminLoginForm />

          <div className="mt-6 border-t border-pine-900/8 pt-4">
            <div className="flex items-center gap-2 text-[11px] text-pine-900/60 justify-center">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>TLS 1.3 256-bit encrypted official government session.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
