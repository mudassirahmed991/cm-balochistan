import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CmProfileEditor } from "@/components/admin/cm-profile-editor";
import { UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Chief Minister Profile CMS | Government of Balochistan",
  description: "Manage official welcome message, biography, constitutional facts, and executive vision.",
};

export default function AdminCmProfilePage() {
  const profile = db.cmProfile.get();

  if (!profile) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pine-900/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-700 uppercase tracking-wider mb-1">
            <UserCheck className="h-3.5 w-3.5" />
            Executive Leadership
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-pine-950">
            Chief Minister Profile & Welcome Message
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-pine-900/65">
            Content updates here immediately reflect across the homepage welcome section and official leadership pages.
          </p>
        </div>
      </div>

      <CmProfileEditor profile={profile} />
    </div>
  );
}
