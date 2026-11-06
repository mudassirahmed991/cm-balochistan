import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { SettingsEditor } from "@/components/admin/settings-editor";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Website Settings | Government of Balochistan",
  description: "Configure official helplines, secretariat contacts, and global portal metadata.",
};

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (user?.role !== "SUPER_ADMIN") {
    redirect("/enter");
  }

  const settings = db.settings.getAll();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pine-900/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-700 uppercase tracking-wider mb-1">
            <Settings className="h-3.5 w-3.5" />
            System Configuration
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-pine-950">
            Website & Secretariat Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-pine-900/65">
            Configure emergency hotlines, official phone exchanges, and public footer metadata.
          </p>
        </div>
      </div>

      <SettingsEditor settings={settings} />
    </div>
  );
}
