import { db } from "@/lib/db";
import { PrioritiesManager } from "@/components/admin/priorities-manager";
import { Compass } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Priorities & Initiatives CMS | Government of Balochistan",
  description: "Manage day-one directives and flagship government initiatives across all sectors.",
};

export default function AdminPrioritiesPage() {
  const priorities = db.priorities.findMany({ isFirstDay: true });
  const initiatives = db.initiatives.findMany();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pine-900/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-700 uppercase tracking-wider mb-1">
            <Compass className="h-3.5 w-3.5" />
            Executive Mandates
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-pine-950">
            Priorities & Flagship Initiatives
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-pine-900/65">
            Manage day-one executive directives and long-term public welfare initiatives.
          </p>
        </div>
      </div>

      <PrioritiesManager priorities={priorities} initiatives={initiatives} />
    </div>
  );
}
