import { db } from "@/lib/db";
import { History } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administrative Audit Trail | Government of Balochistan",
  description: "Complete chronological audit log of secretariat actions and CMS updates.",
};

export default function AdminAuditLogsPage() {
  const logs = db.audit.findMany({ limit: 50 });

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pine-900/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-700 uppercase tracking-wider mb-1">
            <History className="h-3.5 w-3.5" />
            Compliance & Transparency
          </div>
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-pine-950">
            Administrative Audit Trail
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-pine-900/65">
            Immutable chronological record of logins, content modifications, and grievance status updates.
          </p>
        </div>
      </div>

      <div className="rounded-3xl glass-card-3d border border-white/95 shadow-3d-card overflow-hidden">
        <div className="w-full overflow-x-auto rounded-lg">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-mist/70 border-b border-pine-900/8 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pine-900/60">
              <tr>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">Timestamp</th>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">Action</th>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">Entity</th>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">Authorized Officer</th>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">Modification Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pine-900/6">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-mist/30 transition-colors">
                  <td className="whitespace-nowrap px-3 sm:px-6 py-2.5 sm:py-4 text-pine-900/65 font-mono text-[11px] sm:text-xs">
                    {new Date(log.createdAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-6 py-2.5 sm:py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                        log.action === "CREATE"
                          ? "bg-emerald-100 text-emerald-800"
                          : log.action === "UPDATE"
                          ? "bg-blue-100 text-blue-900"
                          : log.action === "DELETE"
                          ? "bg-red-100 text-red-800"
                          : "bg-purple-100 text-purple-900"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-6 py-2.5 sm:py-4 font-semibold text-pine-950">
                    {log.entity}
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-6 py-2.5 sm:py-4">
                    <span className="font-bold text-pine-900">{log.userName || "System"}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-pine-900/80 min-w-[200px]">
                    <p className="line-clamp-2">{log.details}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
