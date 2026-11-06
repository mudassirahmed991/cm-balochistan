import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminComplaintsPage() {
  // Complaint Cell has been delegated to the standalone GRM system link
  redirect("/enter");
}
