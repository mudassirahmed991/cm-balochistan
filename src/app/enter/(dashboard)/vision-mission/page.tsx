import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { VisionMissionEditor } from "@/components/admin/vision-mission-editor";
import { Target } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Vision & Mission CMS | Government of Balochistan",
  description: "Manage official vision and mission declarations for the provincial government.",
};

export default function AdminVisionMissionPage() {
  const record = db.visionMission.get();

  if (!record) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pine-900/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-700 uppercase tracking-wider mb-1">
            <Target className="h-3.5 w-3.5" />
            Strategic Mandate
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-pine-950">
            Vision & Mission Statements
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-pine-900/65">
            Core declarations establishing the provincial agenda across public welfare, peace, and good governance.
          </p>
        </div>
      </div>

      <VisionMissionEditor record={record} />
    </div>
  );
}
