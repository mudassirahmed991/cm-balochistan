import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ComplaintFormSchema } from "@/lib/security";

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();

    const parsed = ComplaintFormSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || "Invalid grievance submission data.";
      return NextResponse.json(
        { error: firstIssue, errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { citizenName, citizenPhone, citizenEmail, district, category, department, description } = parsed.data;

    const { complaint, trackingCode } = db.complaints.create({
      citizenName,
      citizenPhone,
      citizenEmail: citizenEmail || null,
      district,
      category,
      department: department || null,
      description,
    });

    db.audit.log({
      action: "CREATE",
      entity: "Complaint",
      entityId: trackingCode,
      details: `Complaint ${trackingCode} registered via secure API from district ${district}.`,
    });

    return NextResponse.json({
      success: true,
      trackingCode,
      message: "Grievance registered successfully.",
      complaint: {
        trackingCode,
        status: complaint.status,
        createdAt: complaint.createdAt,
      },
    });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Malformed JSON payload. Please provide valid JSON." },
        { status: 400 }
      );
    }
    console.error("API complaint creation error:", err);
    return NextResponse.json(
      { error: "Internal server error while processing grievance." },
      { status: 500 }
    );
  }
}
