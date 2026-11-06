import { redirect } from "next/navigation";
import { getCurrentUser, getUserAllowedModules } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/enter/login");
  }

  const allowedModules = getUserAllowedModules(user);

  return (
    <AdminShell user={user} allowedModules={allowedModules}>
      {children}
    </AdminShell>
  );
}
