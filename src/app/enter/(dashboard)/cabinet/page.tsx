import { db } from "@/lib/db";
import { CabinetManager } from "@/components/admin/cabinet-manager";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cabinet Members CMS | Government of Balochistan",
  description: "Manage provincial cabinet members, portfolios, and ministry portal links.",
};

export default function AdminCabinetPage() {
  const members = db.cabinet.findMany();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pine-900/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-700 uppercase tracking-wider mb-1">
            <Users className="h-3.5 w-3.5" />
            Executive Council
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-pine-950">
            Cabinet Members Directory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-pine-900/65">
            Add, update, or reorganize members of the Council of Ministers and provincial departments.
          </p>
        </div>
      </div>

      <CabinetManager members={members} />
    </div>
  );
}
