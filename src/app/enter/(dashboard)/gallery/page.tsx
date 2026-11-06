import { db } from "@/lib/db";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { Image as ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Media & Video Gallery CMS | Government of Balochistan",
  description: "Direct drag-and-drop upload and asset management for official photos, graphics, and 4K videos.",
};

export default function AdminGalleryPage() {
  const items = db.gallery.findAll();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pine-900/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-700 uppercase tracking-wider mb-1">
            <ImageIcon className="h-3.5 w-3.5 text-emerald-600" />
            Media Directorate & Visual Archives
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-pine-950">
            Media & Video Gallery CMS
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-pine-900/65">
            Directly upload high-definition images and videos of any size from your PC or browser via chunked streaming.
          </p>
        </div>
      </div>

      <GalleryManager items={items} />
    </div>
  );
}
