import { db } from "@/lib/db";
import { NewsManager } from "@/components/admin/news-manager";
import { Newspaper } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "News & Media CMS | Government of Balochistan",
  description: "Publish, update, and manage official press releases, meetings, and statements.",
};

export default function AdminNewsPage() {
  const articles = db.news.findAllForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pine-900/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-700 uppercase tracking-wider mb-1">
            <Newspaper className="h-3.5 w-3.5" />
            Media Directorate
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-pine-950">
            News & Press Releases CMS
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-pine-900/65">
            Manage official announcements, development reviews, and provincial statements.
          </p>
        </div>
      </div>

      <NewsManager articles={articles} />
    </div>
  );
}
