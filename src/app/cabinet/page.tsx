import { redirect } from "next/navigation";
export { initialCabinet } from "@/lib/site";

export default function CabinetPage() {
  redirect("/chief-ministers?tab=cabinet");
}
