"use client";

import { useState, useTransition } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Edit2,
  KeyRound,
  Loader2,
  Lock,
  Plus,
  Save,
  Shield,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { saveUserAction, deleteUserAction } from "@/app/actions/admin";
import type { DBUser, Role } from "@/lib/db";

const SELECTABLE_MODULES = [
  { id: "news", label: "News & Media Room", description: "Press releases, news articles, official media" },
  { id: "chief_minister", label: "CM Profile & Welcome", description: "CM biography, messages, official details" },
  { id: "vision_mission", label: "Vision & Mission", description: "Provincial vision, mission, and policy statements" },
  { id: "priorities", label: "Priorities & Initiatives", description: "First-day directives, provincial initiatives" },
  { id: "cabinet", label: "Cabinet & Former CMs", description: "Cabinet ministers, portfolios, historical CM archives" },
  { id: "complaints", label: "Complaint Cell / GRM", description: "Public complaints, departmental routing, resolution" },
  { id: "inquiries", label: "Public Inquiries", description: "Citizen questions and public contact inquiries" },
  { id: "settings", label: "Portal Settings", description: "Contact information, secretariat details, helplines" },
  { id: "audit_logs", label: "Audit Logs", description: "Chronological security and administrative action logs" },
];

const PRESETS = [
  {
    name: "Press & Media Officer",
    modules: ["news", "chief_minister"],
  },
  {
    name: "Grievance Officer",
    modules: ["complaints", "inquiries"],
  },
  {
    name: "Cabinet Secretary",
    modules: ["cabinet", "priorities"],
  },
  {
    name: "General Content Editor",
    modules: ["news", "chief_minister", "vision_mission", "priorities", "cabinet"],
  },
  {
    name: "All Non-Admin Modules",
    modules: SELECTABLE_MODULES.map((m) => m.id),
  },
];

export function UsersManager({
  users,
  currentUserId,
}: {
  users: DBUser[];
  currentUserId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingUser, setEditingUser] = useState<DBUser | "NEW" | null>(null);

  // Form state
  const [selectedRole, setSelectedRole] = useState<Role>("EDITOR");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const activeSuperAdmins = users.filter((u) => u.role === "SUPER_ADMIN" && u.active);
  const isSingleSuperAdmin = activeSuperAdmins.length <= 1;

  function openNewUserModal() {
    setSelectedRole("EDITOR");
    setSelectedModules(["news", "chief_minister", "vision_mission", "priorities", "cabinet"]);
    setEditingUser("NEW");
  }

  function openEditUserModal(user: DBUser) {
    setSelectedRole(user.role);
    if (user.role === "SUPER_ADMIN") {
      setSelectedModules(SELECTABLE_MODULES.map((m) => m.id));
    } else if (user.permissions) {
      try {
        const parsed = JSON.parse(user.permissions);
        setSelectedModules(Array.isArray(parsed) ? parsed : []);
      } catch {
        setSelectedModules([]);
      }
    } else {
      // Default modules by role
      if (user.role === "GRIEVANCE_OFFICER") {
        setSelectedModules(["complaints", "inquiries"]);
      } else {
        setSelectedModules(["news", "chief_minister", "vision_mission", "priorities", "cabinet"]);
      }
    }
    setEditingUser(user);
  }

  function toggleModule(moduleId: string) {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  }

  function applyPreset(modules: string[]) {
    setSelectedModules(modules);
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage(null);
    const formData = new FormData(e.currentTarget);
    formData.set("role", selectedRole);
    if (selectedRole !== "SUPER_ADMIN") {
      formData.set("permissions", JSON.stringify(selectedModules));
    }

    startTransition(async () => {
      const res = await saveUserAction(null, formData);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
        setEditingUser(null);
        window.location.reload();
      } else {
        setStatusMessage({ type: "error", text: res.message });
      }
    });
  }

  function handleDelete(id: string, email: string) {
    if (!confirm(`Are you sure you want to delete administrative user: "${email}"?`)) return;
    setStatusMessage(null);

    startTransition(async () => {
      const res = await deleteUserAction(id);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
        window.location.reload();
      } else {
        setStatusMessage({ type: "error", text: res.message });
      }
    });
  }

  const inputClass =
    "glass-input-3d w-full rounded-2xl px-4 py-3 text-xs sm:text-sm text-pine-950 placeholder:text-pine-900/40";
  const labelClass = "mb-1.5 block text-[11px] font-bold tracking-wider text-pine-900/70 uppercase";

  const roleBadges: Record<string, string> = {
    SUPER_ADMIN: "bg-purple-100 text-purple-900 border-purple-300",
    EDITOR: "bg-blue-100 text-blue-900 border-blue-300",
    GRIEVANCE_OFFICER: "bg-amber-100 text-amber-900 border-amber-300",
  };

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div
          className={`glass-card-3d rounded-2xl p-4 text-xs flex items-center gap-3 border ${
            statusMessage.type === "success"
              ? "border-emerald-300 bg-emerald-50/80 text-emerald-800"
              : "border-red-300 bg-red-50/80 text-red-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <p className="font-semibold">{statusMessage.text}</p>
        </div>
      )}

      {/* Overview Bar */}
      <div className="glass-card-3d flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-5 sm:p-6 rounded-3xl">
        <div>
          <h2 className="font-display font-bold text-pine-950 text-base sm:text-lg">
            Officer Accounts & Granular Access Control
          </h2>
          <p className="text-xs text-pine-900/65 mt-0.5">
            Managing {users.length} officer(s) with deny-by-default server-side permission checks.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewUserModal}
          className="btn-3d-emerald inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Authorized Officer
        </button>
      </div>

      {/* Users Table */}
      <div className="glass-card-3d rounded-3xl overflow-hidden">
        <div className="w-full overflow-x-auto rounded-lg">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-mist/80 border-b border-pine-900/10 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pine-900/70">
              <tr>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">Officer Name & Email</th>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">Base Role</th>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">Configured Clearances</th>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4">Status</th>
                <th className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pine-900/6">
              {users.map((u) => {
                const isTargetSelf = u.id === currentUserId;
                const isTargetSuperAdmin = u.role === "SUPER_ADMIN";
                const isProtectedSuperAdmin = isTargetSuperAdmin && isSingleSuperAdmin;

                let allowedList: string[] = [];
                if (isTargetSuperAdmin) {
                  allowedList = ["ALL_MODULES"];
                } else if (u.permissions) {
                  try {
                    const parsed = JSON.parse(u.permissions);
                    if (Array.isArray(parsed)) allowedList = parsed;
                  } catch {
                    allowedList = [];
                  }
                } else {
                  allowedList =
                    u.role === "GRIEVANCE_OFFICER"
                      ? ["complaints", "inquiries"]
                      : ["news", "chief_minister", "vision_mission", "priorities", "cabinet"];
                }

                return (
                  <tr key={u.id} className="hover:bg-mist/30 transition-colors">
                    <td className="whitespace-nowrap px-3 sm:px-6 py-2.5 sm:py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-pine-950">{u.name}</p>
                        {isTargetSelf && (
                          <span className="rounded bg-pine-100 text-pine-900 px-1.5 py-0.5 text-[9px] font-bold">
                            You
                          </span>
                        )}
                        {isProtectedSuperAdmin && (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 text-[9px] font-bold">
                            <Lock className="h-2.5 w-2.5" />
                            Protected Super Admin
                          </span>
                        )}
                      </div>
                      <p className="text-pine-900/60 font-mono text-[11px] mt-0.5">{u.email}</p>
                    </td>

                    <td className="whitespace-nowrap px-3 sm:px-6 py-2.5 sm:py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${
                          roleBadges[u.role] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {u.role.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-3 sm:px-6 py-2.5 sm:py-4 min-w-[200px]">
                      {isTargetSuperAdmin ? (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-1 text-[10px] font-bold">
                          <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                          Unrestricted Access (All Modules & User Admin)
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {allowedList.map((modId) => {
                            const modDef = SELECTABLE_MODULES.find((m) => m.id === modId);
                            return (
                              <span
                                key={modId}
                                className="rounded-lg bg-pine-50 border border-pine-900/10 text-pine-900 px-2 py-0.5 text-[10px] font-semibold"
                              >
                                {modDef?.label || modId}
                              </span>
                            );
                          })}
                          {allowedList.length === 0 && (
                            <span className="text-red-600 text-[10px] italic">No active clearances</span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-3 sm:px-6 py-2.5 sm:py-4">
                      <span className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        Active
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 sm:px-6 py-2.5 sm:py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditUserModal(u)}
                          className="icon-box-3d p-2 text-pine-700 hover:text-pine-950 transition-colors"
                          title="Edit User & Clearances"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {!isTargetSelf && !isProtectedSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDelete(u.id, u.email)}
                            className="icon-box-3d p-2 text-red-600 hover:text-red-800 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        {isProtectedSuperAdmin && !isTargetSelf && (
                          <span
                            className="icon-box-3d p-2 text-gray-400 opacity-60 cursor-not-allowed"
                            title="Cannot delete the only remaining Super Admin account"
                          >
                            <Lock className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT OFFICER & PERMISSIONS */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto">
          <div className="modal-3d max-w-2xl w-full p-6 sm:p-8 my-8 relative">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-pine-900/10">
              <div>
                <h3 className="font-display text-lg font-bold text-pine-950">
                  {editingUser === "NEW" ? "Authorize New Administrative Officer" : "Edit Officer & Security Clearances"}
                </h3>
                <p className="text-xs text-pine-900/60 mt-0.5">
                  Configure identity credentials and module authorizations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-full p-1 text-pine-900/40 hover:text-pine-950 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {editingUser !== "NEW" && <input type="hidden" name="id" value={editingUser.id} />}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Officer Full Name</label>
                  <input
                    name="name"
                    defaultValue={editingUser === "NEW" ? "" : editingUser.name}
                    required
                    placeholder="e.g. Asadullah Jamali"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Official Government Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingUser === "NEW" ? "" : editingUser.email}
                    required
                    readOnly={editingUser !== "NEW"}
                    placeholder="officer@balochistan.gov.pk"
                    className={`${inputClass} ${editingUser !== "NEW" ? "bg-gray-50 opacity-70 cursor-not-allowed" : ""}`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  {editingUser === "NEW" ? "Initial Password (min 8 chars)" : "Reset Password (leave blank to keep current)"}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-pine-900/35" />
                  <input
                    name="password"
                    type="password"
                    required={editingUser === "NEW"}
                    minLength={8}
                    placeholder="••••••••••••"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* ROLE SELECTION */}
              <div>
                <label className={labelClass}>Base Administrative Role</label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {(["SUPER_ADMIN", "EDITOR", "GRIEVANCE_OFFICER"] as Role[]).map((role) => {
                    const isSelected = selectedRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-pine-900 bg-pine-900 text-white shadow-soft"
                            : "border-pine-900/10 bg-white text-pine-950 hover:bg-mist/40"
                        }`}
                      >
                        <p className="font-bold text-xs uppercase tracking-wider">
                          {role.replace("_", " ")}
                        </p>
                        <p
                          className={`text-[10px] mt-1 line-clamp-2 ${
                            isSelected ? "text-white/80" : "text-pine-900/60"
                          }`}
                        >
                          {role === "SUPER_ADMIN"
                            ? "Full system control, users & security management"
                            : role === "EDITOR"
                            ? "Content authoring, media, cabinet & vision updates"
                            : "Complaint tracking, grievances & inquiries"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GRANULAR PERMISSIONS SECTION */}
              {selectedRole !== "SUPER_ADMIN" ? (
                <div className="rounded-2xl border border-pine-900/10 bg-sand/20 p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-pine-950 flex items-center gap-1.5">
                        <Shield className="h-4 w-4 text-pine-800" />
                        Granular Module Clearances (Deny-By-Default)
                      </h4>
                      <p className="text-[11px] text-pine-900/60 mt-0.5">
                        Explicitly authorize the modules this officer can view and edit.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {PRESETS.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => applyPreset(p.modules)}
                          className="rounded-lg bg-white border border-pine-900/15 px-2 py-1 text-[9px] font-bold text-pine-900 hover:bg-pine-100 transition-colors cursor-pointer"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {SELECTABLE_MODULES.map((mod) => {
                      const isChecked = selectedModules.includes(mod.id);
                      return (
                        <label
                          key={mod.id}
                          onClick={() => toggleModule(mod.id)}
                          className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                            isChecked
                              ? "border-emerald-500 bg-emerald-50/50"
                              : "border-pine-900/10 bg-white hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              isChecked
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-pine-900/30 bg-white"
                            }`}
                          >
                            {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-pine-950 leading-tight">
                              {mod.label}
                            </p>
                            <p className="text-[10px] text-pine-900/60 mt-0.5">
                              {mod.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-4 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-purple-700 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-purple-950">
                      Super Administrator Clearance
                    </p>
                    <p className="text-[11px] text-purple-900/70 mt-0.5">
                      Super Admins possess universal privileges across all modules, including user administration and portal security.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-pine-900/10">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="btn-3d-glass text-pine-950 px-5 py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-3d-emerald inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Officer Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
