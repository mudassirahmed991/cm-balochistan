"use server";

import { revalidatePath } from "next/cache";
import { authenticateUser, getCurrentUser, logoutUser, hashPassword, hasModulePermission } from "@/lib/auth";
import { db, type Role, type ComplaintStatus } from "@/lib/db";

export type AdminActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

import { headers } from "next/headers";
import { getClientIp, checkLoginAttempts, recordFailedLogin, resetLoginAttempts } from "@/lib/rate-limiter";
import { AdminLoginSchema } from "@/lib/security";

// 1. AUTHENTICATION ACTIONS
export async function loginAdminAction(
  _prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const reqHeaders = await headers();
  const clientIp = getClientIp(reqHeaders);

  // Check brute-force lockout status
  const lockout = checkLoginAttempts(clientIp);
  if (lockout.blocked) {
    return {
      success: false,
      message: `Too many failed authentication attempts from this IP address. Access has been locked for ${Math.ceil(lockout.retryAfterSeconds / 60)} minutes for security.`,
    };
  }

  const rawEmail = formData.get("email")?.toString()?.trim() || "";
  const rawPassword = formData.get("password")?.toString() || "";

  const parsed = AdminLoginSchema.safeParse({ email: rawEmail, password: rawPassword });
  if (!parsed.success) {
    recordFailedLogin(clientIp);
    return { success: false, message: "Please provide a valid official email and password." };
  }

  const result = await authenticateUser(parsed.data.email, parsed.data.password);
  if (!result.success) {
    const failedStatus = recordFailedLogin(clientIp);
    if (failedStatus.blockedNow) {
      return {
        success: false,
        message: "Maximum failed attempts reached. Access locked for 15 minutes.",
      };
    }
    return {
      success: false,
      message: `${result.error || "Authentication failed."} (${failedStatus.remainingAttempts} attempt(s) remaining).`,
    };
  }

  // Clear failed attempt history on successful login
  resetLoginAttempts(clientIp);

  return { success: true, message: "Login successful. Redirecting to administration dashboard..." };
}

export async function logoutAdminAction(): Promise<void> {
  await logoutUser();
}

// 2. CHIEF MINISTER PROFILE CMS
export async function updateCmProfileAction(
  _prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || !hasModulePermission(user, "chief_minister")) {
    return { success: false, message: "Unauthorized: Insufficient clearances for the Chief Minister Profile module." };
  }

  const profile = db.cmProfile.get();
  if (!profile) {
    return { success: false, message: "Chief Minister profile record not found." };
  }

  const nameEn = formData.get("nameEn")?.toString()?.trim();
  const nameUr = formData.get("nameUr")?.toString()?.trim();
  const titleEn = formData.get("titleEn")?.toString()?.trim();
  const titleUr = formData.get("titleUr")?.toString()?.trim();
  const welcomeMessageEn = formData.get("welcomeMessageEn")?.toString()?.trim();
  const welcomeMessageUr = formData.get("welcomeMessageUr")?.toString()?.trim();
  const quoteEn = formData.get("quoteEn")?.toString()?.trim();
  const quoteUr = formData.get("quoteUr")?.toString()?.trim();
  const party = formData.get("party")?.toString()?.trim();
  const assembly = formData.get("assembly")?.toString()?.trim();
  const residence = formData.get("residence")?.toString()?.trim();
  const termLength = formData.get("termLength")?.toString()?.trim();
  const bioParagraphsEnRaw = formData.get("bioParagraphsEn")?.toString()?.trim();

  let bioParagraphsEn: string | undefined;
  if (bioParagraphsEnRaw) {
    const lines = bioParagraphsEnRaw.split("\n\n").map((p) => p.trim()).filter(Boolean);
    bioParagraphsEn = JSON.stringify(lines);
  }

  db.cmProfile.update(profile.id, {
    nameEn,
    nameUr,
    titleEn,
    titleUr,
    welcomeMessageEn,
    welcomeMessageUr,
    quoteEn,
    quoteUr,
    party,
    assembly,
    residence,
    termLength,
    bioParagraphsEn,
  });

  db.audit.log({
    userId: user.id,
    action: "UPDATE",
    entity: "ChiefMinisterProfile",
    entityId: profile.id,
    details: `Updated Chief Minister profile and official welcome message by ${user.name}.`,
  });

  revalidatePath("/");
  revalidatePath("/chief-minister");
  return { success: true, message: "Chief Minister profile and official welcome message updated successfully." };
}

// 3. VISION & MISSION CMS
export async function updateVisionMissionAction(
  _prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || !hasModulePermission(user, "vision_mission")) {
    return { success: false, message: "Unauthorized: Insufficient clearances for the Vision & Mission module." };
  }

  const vm = db.visionMission.get();
  if (!vm) return { success: false, message: "Vision & Mission record not found." };

  const visionEn = formData.get("visionEn")?.toString()?.trim() || "";
  const visionUr = formData.get("visionUr")?.toString()?.trim() || null;
  const missionEn = formData.get("missionEn")?.toString()?.trim() || "";
  const missionUr = formData.get("missionUr")?.toString()?.trim() || null;

  if (!visionEn || !missionEn) {
    return { success: false, message: "Vision and Mission English statements are required." };
  }

  db.visionMission.update(vm.id, { visionEn, visionUr, missionEn, missionUr });

  db.audit.log({
    userId: user.id,
    action: "UPDATE",
    entity: "VisionMission",
    entityId: vm.id,
    details: `Updated provincial Vision and Mission statements by ${user.name}.`,
  });

  revalidatePath("/");
  revalidatePath("/chief-minister");
  return { success: true, message: "Vision and Mission statements successfully updated." };
}

// 4. PRIORITIES CMS
export async function savePriorityAction(
  _prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || !hasModulePermission(user, "priorities")) {
    return { success: false, message: "Unauthorized: Insufficient clearances for Priorities & Initiatives." };
  }

  const id = formData.get("id")?.toString()?.trim();
  const slug = formData.get("slug")?.toString()?.trim() || `pri-${Date.now()}`;
  const titleEn = formData.get("titleEn")?.toString()?.trim() || "";
  const shortEn = formData.get("shortEn")?.toString()?.trim() || "";
  const descriptionEn = formData.get("descriptionEn")?.toString()?.trim() || "";
  const icon = formData.get("icon")?.toString()?.trim() || "landmark";
  const initiativesRaw = formData.get("initiatives")?.toString()?.trim() || "";
  const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "1", 10);
  const isFirstDay = formData.get("isFirstDay") === "1" ? 1 : 0;
  const bgImage = formData.get("bgImage")?.toString()?.trim() || null;
  const iconImage = formData.get("iconImage")?.toString()?.trim() || null;
  const articleText = formData.get("articleText")?.toString()?.trim() || null;
  const articleImage = formData.get("articleImage")?.toString()?.trim() || null;

  if (!titleEn || !descriptionEn) {
    return { success: false, message: "Title and description are required." };
  }

  const initiatives = initiativesRaw.split("\n").map((s) => s.trim()).filter(Boolean);
  const initiativesJson = JSON.stringify(initiatives);

  if (id) {
    db.priorities.update(id, {
      titleEn,
      shortEn,
      descriptionEn,
      icon,
      initiativesJson,
      sortOrder,
      isFirstDay,
      bgImage,
      iconImage,
      articleText,
      articleImage,
    });
    db.audit.log({
      userId: user.id,
      action: "UPDATE",
      entity: "Priority",
      entityId: id,
      details: `Updated Priority '${titleEn}' by ${user.name}.`,
    });
  } else {
    db.priorities.create({
      slug,
      titleEn,
      shortEn,
      descriptionEn,
      icon,
      initiativesJson,
      sortOrder,
      isFirstDay,
      bgImage,
      iconImage,
      articleText,
      articleImage,
    });
    db.audit.log({
      userId: user.id,
      action: "CREATE",
      entity: "Priority",
      entityId: slug,
      details: `Created new Priority '${titleEn}' by ${user.name}.`,
    });
  }

  revalidatePath("/");
  revalidatePath("/priorities");
  return { success: true, message: `Priority '${titleEn}' successfully saved.` };
}

export async function deletePriorityAction(id: string): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || !hasModulePermission(user, "priorities")) {
    return { success: false, message: "Unauthorized: Insufficient clearances for Priorities & Initiatives." };
  }

  db.priorities.delete(id);
  db.audit.log({
    userId: user.id,
    action: "DELETE",
    entity: "Priority",
    entityId: id,
    details: `Deleted Priority record ${id} by ${user.name}.`,
  });

  revalidatePath("/");
  revalidatePath("/priorities");
  revalidatePath("/enter/priorities");
  return { success: true, message: "Priority deleted successfully." };
}

// 5. INITIATIVES CMS
export async function saveInitiativeAction(
  _prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || !hasModulePermission(user, "priorities")) {
    return { success: false, message: "Unauthorized: Insufficient clearances for Priorities & Initiatives." };
  }

  const id = formData.get("id")?.toString()?.trim();
  const titleEn = formData.get("titleEn")?.toString()?.trim() || "";
  const category = formData.get("category")?.toString()?.trim() || "Development";
  const descriptionEn = formData.get("descriptionEn")?.toString()?.trim() || "";
  const status = formData.get("status")?.toString()?.trim() || "Active";
  const progressPercent = parseInt(formData.get("progressPercent")?.toString() || "0", 10);
  const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "1", 10);
  const featured = formData.get("featured") === "1" ? 1 : 0;
  const bgImage = formData.get("bgImage")?.toString()?.trim() || null;

  if (!titleEn || !descriptionEn) {
    return { success: false, message: "Title and description are required." };
  }

  if (id) {
    db.initiatives.update(id, {
      titleEn,
      category,
      descriptionEn,
      status,
      progressPercent,
      sortOrder,
      featured,
      bgImage,
    });
    db.audit.log({
      userId: user.id,
      action: "UPDATE",
      entity: "Initiative",
      entityId: id,
      details: `Updated Initiative '${titleEn}' by ${user.name}.`,
    });
  } else {
    db.initiatives.create({
      titleEn,
      category,
      descriptionEn,
      status,
      progressPercent,
      sortOrder,
      featured,
      bgImage,
    });
    db.audit.log({
      userId: user.id,
      action: "CREATE",
      entity: "Initiative",
      entityId: titleEn,
      details: `Created Initiative '${titleEn}' by ${user.name}.`,
    });
  }

  revalidatePath("/");
  revalidatePath("/priorities");
  return { success: true, message: `Initiative '${titleEn}' successfully saved.` };
}

export async function deleteInitiativeAction(id: string): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || !hasModulePermission(user, "priorities")) {
    return { success: false, message: "Unauthorized: Insufficient clearances for Priorities & Initiatives." };
  }

  db.initiatives.delete(id);
  db.audit.log({
    userId: user.id,
    action: "DELETE",
    entity: "Initiative",
    entityId: id,
    details: `Deleted Initiative ${id} by ${user.name}.`,
  });

  revalidatePath("/");
  revalidatePath("/priorities");
  revalidatePath("/initiatives");
  revalidatePath("/enter/priorities");
  return { success: true, message: "Initiative deleted successfully." };
}

// 6. CABINET MEMBERS CMS
export async function saveCabinetMemberAction(
  _prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || !hasModulePermission(user, "cabinet")) {
    return { success: false, message: "Unauthorized: Insufficient clearances for Cabinet Members." };
  }

  const id = formData.get("id")?.toString()?.trim();
  const nameEn = formData.get("nameEn")?.toString()?.trim() || "";
  const designationEn = formData.get("designationEn")?.toString()?.trim() || "Provincial Minister";
  const portfolioEn = formData.get("portfolioEn")?.toString()?.trim() || "";
  const ministryEn = formData.get("ministryEn")?.toString()?.trim() || "";
  const departmentUrl = formData.get("departmentUrl")?.toString()?.trim() || null;
  const photoUrl = formData.get("photoUrl")?.toString()?.trim() || null;
  const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "1", 10);

  if (!nameEn || !portfolioEn || !ministryEn) {
    return { success: false, message: "Name, portfolio, and ministry are required." };
  }

  if (id) {
    db.cabinet.update(id, {
      nameEn,
      designationEn,
      portfolioEn,
      ministryEn,
      departmentUrl,
      photoUrl,
      sortOrder,
    });
    db.audit.log({
      userId: user.id,
      action: "UPDATE",
      entity: "CabinetMember",
      entityId: id,
      details: `Updated Cabinet Member '${nameEn}' by ${user.name}.`,
    });
  } else {
    db.cabinet.create({
      nameEn,
      designationEn,
      portfolioEn,
      ministryEn,
      departmentUrl,
      photoUrl,
      sortOrder,
    });
    db.audit.log({
      userId: user.id,
      action: "CREATE",
      entity: "CabinetMember",
      entityId: nameEn,
      details: `Added new Cabinet Member '${nameEn}' by ${user.name}.`,
    });
  }

  revalidatePath("/cabinet");
  return { success: true, message: `Cabinet member '${nameEn}' saved successfully.` };
}

export async function deleteCabinetMemberAction(id: string): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || !hasModulePermission(user, "cabinet")) {
    return { success: false, message: "Unauthorized: Insufficient clearances for Cabinet Members." };
  }

  db.cabinet.delete(id);
  db.audit.log({
    userId: user.id,
    action: "DELETE",
    entity: "CabinetMember",
    entityId: id,
    details: `Deleted Cabinet Member ${id} by ${user.name}.`,
  });

  revalidatePath("/cabinet");
  revalidatePath("/chief-ministers");
  revalidatePath("/enter/cabinet");
  return { success: true, message: "Cabinet member deleted successfully." };
}

// 7. NEWS CMS
export async function saveNewsArticleAction(
  _prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || !hasModulePermission(user, "news")) {
    return { success: false, message: "Unauthorized: Insufficient clearances for News & Media Room." };
  }

  const id = formData.get("id")?.toString()?.trim();
  const titleEn = formData.get("titleEn")?.toString()?.trim() || "";
  const excerptEn = formData.get("excerptEn")?.toString()?.trim() || "";
  const bodyEn = formData.get("bodyEn")?.toString()?.trim() || "";
  const category = formData.get("category")?.toString()?.trim() || "Press Releases";
  const readTime = formData.get("readTime")?.toString()?.trim() || "3 min read";
  const isPublished = formData.get("isPublished") === "1" ? 1 : 0;
  const isFeatured = formData.get("isFeatured") === "1" ? 1 : 0;
  const coverImageUrl = formData.get("coverImageUrl")?.toString()?.trim() || null;
  const videoUrl = formData.get("videoUrl")?.toString()?.trim() || null;
  const mediaType = formData.get("mediaType")?.toString()?.trim() || (videoUrl ? "VIDEO" : coverImageUrl ? "IMAGE" : "ARTICLE");

  if (!titleEn || !excerptEn || !bodyEn) {
    return { success: false, message: "Title, summary excerpt, and article body are required." };
  }

  const slug = titleEn
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80);

  if (id) {
    db.news.update(id, {
      titleEn,
      excerptEn,
      bodyEn,
      category,
      coverImageUrl,
      videoUrl,
      mediaType,
      readTime,
      isPublished,
      isFeatured,
    });
    db.audit.log({
      userId: user.id,
      action: "UPDATE",
      entity: "NewsArticle",
      entityId: id,
      details: `Updated News Article '${titleEn}' by ${user.name}.`,
    });
  } else {
    db.news.create({
      slug,
      titleEn,
      excerptEn,
      bodyEn,
      category,
      coverImageUrl,
      videoUrl,
      mediaType,
      publishedDate: new Date().toISOString(),
      readTime,
      isPublished,
      isFeatured,
    });
    db.audit.log({
      userId: user.id,
      action: "CREATE",
      entity: "NewsArticle",
      entityId: slug,
      details: `Published News Article '${titleEn}' by ${user.name}.`,
    });
  }

  revalidatePath("/");
  revalidatePath("/news");
  return { success: true, message: `News article '${titleEn}' saved successfully.` };
}

export async function deleteNewsArticleAction(id: string): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || !hasModulePermission(user, "news")) {
    return { success: false, message: "Unauthorized: Insufficient clearances for News & Media Room." };
  }

  db.news.delete(id);
  db.audit.log({
    userId: user.id,
    action: "DELETE",
    entity: "NewsArticle",
    entityId: id,
    details: `Deleted News Article ${id} by ${user.name}.`,
  });

  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/enter/news");
  return { success: true, message: "Article deleted successfully." };
}

// 8. COMPLAINT CELL STATUS UPDATE ACTION
export async function updateComplaintStatusAction(
  _prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || !hasModulePermission(user, "complaints")) {
    return { success: false, message: "Unauthorized: Insufficient clearances for Complaint Cell / GRM." };
  }

  const complaintId = formData.get("complaintId")?.toString()?.trim() || "";
  const newStatus = formData.get("newStatus")?.toString()?.trim() as ComplaintStatus;
  const department = formData.get("department")?.toString()?.trim() || undefined;
  const priorityLevel = formData.get("priorityLevel")?.toString()?.trim() || undefined;
  const comments = formData.get("comments")?.toString()?.trim() || "";
  const resolutionNotes = formData.get("resolutionNotes")?.toString()?.trim();

  if (!complaintId || !newStatus || !comments) {
    return { success: false, message: "Complaint ID, new status, and departmental remarks are required." };
  }

  const ok = db.complaints.updateStatus({
    complaintId,
    newStatus,
    comments,
    changedById: user.id,
    department,
    priorityLevel,
    resolutionNotes: resolutionNotes || undefined,
  });

  if (!ok) {
    return { success: false, message: "Grievance record not found." };
  }

  db.audit.log({
    userId: user.id,
    action: "UPDATE",
    entity: "Complaint",
    entityId: complaintId,
    details: `Updated complaint status to ${newStatus} by ${user.name} (${user.role}).`,
  });

  revalidatePath("/connect");
  revalidatePath("/complaint-cell");
  return { success: true, message: `Grievance status updated to ${newStatus}.` };
}

// 9. PUBLIC INQUIRY STATUS ACTION
export async function updateInquiryStatusAction(id: string, status: string): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || !hasModulePermission(user, "inquiries")) {
    return { success: false, message: "Unauthorized: Insufficient clearances for Public Inquiries." };
  }

  db.contactInquiry.updateStatus(id, status);
  db.audit.log({
    userId: user.id,
    action: "UPDATE",
    entity: "ContactInquiry",
    entityId: id,
    details: `Updated inquiry ${id} status to ${status} by ${user.name}.`,
  });

  return { success: true, message: `Inquiry marked as ${status}.` };
}

// 10. WEBSITE SETTINGS ACTION
export async function saveSettingsAction(
  _prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || !hasModulePermission(user, "settings")) {
    return { success: false, message: "Unauthorized: Insufficient clearances for Portal Settings." };
  }

  const keys = ["site_name", "cm_office_phone", "complaint_helpline", "official_email", "secretariat_address", "portal_tagline"];

  keys.forEach((key) => {
    const valEn = formData.get(key)?.toString()?.trim();
    if (valEn) {
      db.settings.set(key, valEn);
    }
  });

  db.audit.log({
    userId: user.id,
    action: "UPDATE",
    entity: "WebsiteSetting",
    details: `Portal settings updated by ${user.name}.`,
  });

  revalidatePath("/");
  return { success: true, message: "Website settings successfully updated." };
}

// 11. USER MANAGEMENT ACTION
export async function saveUserAction(
  _prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return { success: false, message: "Super Admin privileges required." };
  }

  const id = formData.get("id")?.toString()?.trim();
  let email = formData.get("email")?.toString()?.trim() || "";
  const name = formData.get("name")?.toString()?.trim() || "";
  const role = (formData.get("role")?.toString()?.trim() || "EDITOR") as Role;
  const permissionsRaw = formData.get("permissions")?.toString()?.trim() || null;
  const password = formData.get("password")?.toString();

  // Parse and validate permissions
  let permissionsJson: string | null = null;
  if (role !== "SUPER_ADMIN" && permissionsRaw) {
    try {
      const parsed = JSON.parse(permissionsRaw);
      if (Array.isArray(parsed)) {
        // Enforce that non-super-admins cannot possess the "users" module
        const filtered = parsed.filter((m: string) => m !== "users");
        permissionsJson = JSON.stringify(filtered);
      }
    } catch {
      permissionsJson = null;
    }
  }

  if (id) {
    const existingTarget = db.users.findById(id);
    if (!existingTarget) {
      return { success: false, message: "User not found." };
    }
    if (!email) {
      email = existingTarget.email;
    }
    if (!name) {
      return { success: false, message: "Officer name is required." };
    }

    // Protection 1: Admin cannot revoke their own Super Admin role
    if (currentUser.id === id && role !== "SUPER_ADMIN") {
      return { success: false, message: "Action Denied: You cannot revoke your own Super Admin role." };
    }

    // Protection 2: Cannot demote the last remaining active Super Admin
    if (existingTarget.role === "SUPER_ADMIN" && role !== "SUPER_ADMIN") {
      const activeSuperAdmins = db.users.countActiveSuperAdmins();
      if (activeSuperAdmins <= 1) {
        return {
          success: false,
          message: "Action Denied: Cannot demote the last active Super Admin. System must always retain at least one active Super Admin.",
        };
      }
    }

    db.users.update(id, { name, role, permissions: permissionsJson });
    if (password && password.length >= 8) {
      db.users.updatePassword(id, hashPassword(password));
    }
    db.audit.log({
      userId: currentUser.id,
      action: "UPDATE",
      entity: "User",
      entityId: id,
      details: `Updated user account ${email} (${role}) with clearances ${permissionsJson || "ROLE_DEFAULTS"} by ${currentUser.name}.`,
    });
    return { success: true, message: `User account '${email}' updated successfully.` };
  } else {
    if (!email || !name) {
      return { success: false, message: "Officer name and email are required." };
    }
    if (!password || password.length < 8) {
      return { success: false, message: "Initial password must be at least 8 characters." };
    }
    const existing = db.users.findByEmail(email);
    if (existing) {
      return { success: false, message: "An account with this email address already exists." };
    }
    db.users.create({
      email,
      name,
      role,
      permissions: permissionsJson,
      passwordHash: hashPassword(password),
    });
    db.audit.log({
      userId: currentUser.id,
      action: "CREATE",
      entity: "User",
      entityId: email,
      details: `Created new administrative user ${email} with role ${role} by ${currentUser.name}.`,
    });
    return { success: true, message: `Administrative user '${email}' created successfully.` };
  }
}

export async function deleteUserAction(id: string): Promise<AdminActionResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return { success: false, message: "Super Admin privileges required." };
  }

  // Protection 1: Prevent self-deletion
  if (currentUser.id === id) {
    return { success: false, message: "Action Denied: You cannot delete your own administrative account." };
  }

  // Protection 2: Prevent deletion of last active Super Admin
  const targetUser = db.users.findById(id);
  if (targetUser && targetUser.role === "SUPER_ADMIN") {
    const activeSuperAdmins = db.users.countActiveSuperAdmins();
    if (activeSuperAdmins <= 1) {
      return {
        success: false,
        message: "Action Denied: Cannot delete the last remaining active Super Admin account. System must always retain at least one active Super Admin.",
      };
    }
  }

  db.users.delete(id);
  db.audit.log({
    userId: currentUser.id,
    action: "DELETE",
    entity: "User",
    entityId: id,
    details: `Deleted user ${id} by ${currentUser.name}.`,
  });

  return { success: true, message: "Administrative user deleted successfully." };
}
