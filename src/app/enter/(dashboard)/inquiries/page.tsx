import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminInquiriesPage() {
  // Public inquiries module removed as requested
  redirect("/enter");
}
