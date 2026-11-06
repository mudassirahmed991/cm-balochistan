import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { TrackingCodeRegex, sanitizeString } from "@/lib/security";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawCode = searchParams.get("code");

  if (!rawCode) {
    return NextResponse.json({ error: "Tracking code parameter 'code' is required." }, { status: 400 });
  }

  const cleanCode = sanitizeString(rawCode).toUpperCase();
  if (!TrackingCodeRegex.test(cleanCode)) {
    return NextResponse.json({ error: "Invalid tracking code format." }, { status: 400 });
  }

  const result = db.complaints.findByTrackingCode(cleanCode);
  if (!result) {
    return NextResponse.json({ error: "Grievance record not found." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
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
  });
}
