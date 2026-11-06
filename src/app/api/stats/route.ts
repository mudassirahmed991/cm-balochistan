import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const stats = db.complaints.getStats();
    return NextResponse.json({
      success: true,
      complaints: stats,
      districts: 36,
      divisions: 7,
      provinces: 1,
    });
  } catch (err) {
    console.error("API stats error:", err);
    return NextResponse.json({ error: "Failed to load portal statistics." }, { status: 500 });
  }
}
