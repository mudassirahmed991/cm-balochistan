"use server";

import { db } from "@/lib/db";
import { ComplaintFormSchema, sanitizeString } from "@/lib/security";

export type ComplaintActionResult = {
  success: boolean;
  message: string;
  trackingCode?: string;
  errors?: Record<string, string>;
};

export async function submitComplaintAction(
  _prevState: ComplaintActionResult | null,
  formData: FormData
): Promise<ComplaintActionResult> {
  const rawData = {
    citizenName: formData.get("citizenName")?.toString() || "",
    citizenPhone: formData.get("citizenPhone")?.toString() || "",
    citizenEmail: formData.get("citizenEmail")?.toString() || "",
    district: formData.get("district")?.toString() || "",
    category: formData.get("category")?.toString() || "",
    department: formData.get("department")?.toString() || "",
    description: formData.get("description")?.toString() || "",
  };

  const parsed = ComplaintFormSchema.safeParse(rawData);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]?.toString();
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    }
    return {
      success: false,
      message: "Please correct the highlighted errors in the form.",
      errors,
    };
  }

  const { citizenName, citizenPhone, citizenEmail, district, category, department, description } = parsed.data;

  try {
    const { trackingCode } = db.complaints.create({
      citizenName,
      citizenPhone,
      citizenEmail: citizenEmail || null,
      district,
      category,
      department: department || null,
      description,
      priorityLevel: "NORMAL",
    });

    db.audit.log({
      action: "CREATE",
      entity: "Complaint",
      entityId: trackingCode,
      details: `Complaint ${trackingCode} registered from district ${district} under category ${category}.`,
    });

    return {
      success: true,
      trackingCode,
      message: `Your grievance has been successfully registered. Official Tracking Code: ${trackingCode}. Please keep this code safe for future tracking.`,
    };
  } catch (err) {
    console.error("Complaint registration error:", err);
    return {
      success: false,
      message: "An internal server error occurred while lodging your grievance. Please try again shortly.",
    };
  }
}

export type TrackingResult = {
  success: boolean;
  message: string;
  complaint?: {
    trackingCode: string;
    district: string;
    category: string;
    department: string | null;
    status: string;
    priorityLevel: string;
    createdAt: string;
    resolvedAt: string | null;
    resolutionNotes: string | null;
  };
  timeline?: {
    id: string;
    newStatus: string;
    comments: string | null;
    createdAt: string;
    changedByName?: string | null;
  }[];
};

export async function trackComplaintAction(trackingCode: string): Promise<TrackingResult> {
  const cleanCode = trackingCode.trim().toUpperCase();

  if (!cleanCode) {
    return {
      success: false,
      message: "Please enter your official Tracking Code (e.g., CMB-2026-1001).",
    };
  }

  try {
    const result = db.complaints.findByTrackingCode(cleanCode);

    if (!result) {
      return {
        success: false,
        message: `No grievance found matching Tracking Code "${cleanCode}". Please verify your reference number.`,
      };
    }

    // Sanitize citizen private data for public status lookup
    return {
      success: true,
      message: "Grievance record located.",
      complaint: {
        trackingCode: result.complaint.trackingCode,
        district: result.complaint.district,
        category: result.complaint.category,
        department: result.complaint.department,
        status: result.complaint.status,
        priorityLevel: result.complaint.priorityLevel,
        createdAt: result.complaint.createdAt,
        resolvedAt: result.complaint.resolvedAt,
        resolutionNotes: result.complaint.resolutionNotes,
      },
      timeline: result.timeline.map((item) => ({
        id: item.id,
        newStatus: item.newStatus,
        comments: item.comments,
        createdAt: item.createdAt,
        changedByName: item.changedByName || "Secretariat Officer",
      })),
    };
  } catch (err) {
    console.error("Complaint tracking error:", err);
    return {
      success: false,
      message: "An error occurred while retrieving your grievance record.",
    };
  }
}

export type FeedbackActionResult = {
  success: boolean;
  message: string;
};

export async function submitComplaintFeedbackAction(
  trackingCode: string,
  comments: string,
  rating: number = 5,
  requestEscalation: boolean = false
): Promise<FeedbackActionResult> {
  const cleanCode = trackingCode.trim().toUpperCase();
  const cleanComments = comments.trim();

  if (!cleanCode) {
    return { success: false, message: "Tracking code is required." };
  }
  if (!cleanComments || cleanComments.length < 5) {
    return { success: false, message: "Please provide feedback or appeal remarks (minimum 5 characters)." };
  }

  try {
    const ok = db.complaints.recordCitizenFeedback({
      trackingCode: cleanCode,
      rating,
      comments: cleanComments,
      requestEscalation,
    });

    if (!ok) {
      return { success: false, message: `Grievance record "${cleanCode}" not found.` };
    }

    db.audit.log({
      action: requestEscalation ? "ESCALATE" : "FEEDBACK",
      entity: "Complaint",
      entityId: cleanCode,
      details: requestEscalation
        ? `Citizen escalated grievance ${cleanCode} for higher review.`
        : `Citizen submitted feedback for grievance ${cleanCode} (Rating: ${rating}/5).`,
    });

    return {
      success: true,
      message: requestEscalation
        ? "Your appeal and escalation request has been registered and forwarded to the Secretariat Oversight Cell."
        : "Thank you for submitting your feedback. Your assessment has been recorded in the grievance audit file.",
    };
  } catch (err) {
    console.error("Feedback submission error:", err);
    return {
      success: false,
      message: "An error occurred while recording your feedback. Please try again.",
    };
  }
}
