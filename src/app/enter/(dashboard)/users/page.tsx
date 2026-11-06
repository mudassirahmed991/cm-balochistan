import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsersManager } from "@/components/admin/users-manager";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administrative Users & RBAC | Government of Balochistan",
  description: "Manage authorized administrative officers and role-based access control clearances.",
};

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (user?.role !== "SUPER_ADMIN") {
    redirect("/enter");
  }

  const users = db.users.findMany();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pine-900/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-700 uppercase tracking-wider mb-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Security & Access Control
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-pine-950">
            Authorized Administrative Users
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-pine-900/65">
            Role-Based Access Control (RBAC) governing portal editors, grievance officers, and secretariat administrators.
          </p>
        </div>
      </div>

      <UsersManager users={users} currentUserId={user.id} />
    </div>
  );
}
