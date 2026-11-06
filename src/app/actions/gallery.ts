"use server";

import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function deleteGalleryItemAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser();
    // Allow authorized deletion
    const existing = db.gallery.findById(id);
    if (!existing) {
      return { success: false, message: "Gallery item not found." };
    }

    // Delete record from DB
    const res = db.gallery.delete(id);
    if (!res.success) {
      return { success: false, message: "Could not remove gallery item from database." };
    }

    // If file is stored in /uploads/gallery/, remove it from disk
    if (existing.fileUrl.startsWith("/uploads/gallery/")) {
      const filePath = path.resolve(process.cwd(), "public", existing.fileUrl.replace(/^\//, ""));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn("Could not delete physical file:", filePath, err);
        }
      }
    }

    // Audit log
    db.audit.log({
      userId: user?.id,
      action: "DELETE",
      entity: "GalleryItem",
      entityId: id,
      details: `Deleted gallery media: "${existing.title}" (${existing.type})`,
    });

    revalidatePath("/gallery");
    revalidatePath("/enter/gallery");
    return { success: true, message: "Media file deleted successfully." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete item.",
    };
  }
}

export async function updateGalleryItemAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const titleUr = formData.get("titleUr") as string | null;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string | null;
    const descriptionUr = formData.get("descriptionUr") as string | null;
    const isFeatured = formData.get("isFeatured") === "1" ? 1 : 0;
    const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

    if (!id || !title) {
      return { success: false, message: "Missing required identification or title." };
    }

    const updated = db.gallery.update(id, {
      title,
      titleUr: titleUr || null,
      category: category || "General",
      description: description || null,
      descriptionUr: descriptionUr || null,
      isFeatured,
      sortOrder,
    });

    if (!updated) {
      return { success: false, message: "Item could not be updated." };
    }

    db.audit.log({
      userId: user?.id,
      action: "UPDATE",
      entity: "GalleryItem",
      entityId: id,
      details: `Updated gallery media details: "${title}"`,
    });

    revalidatePath("/gallery");
    revalidatePath("/enter/gallery");
    return { success: true, message: "Media details updated successfully." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update item.",
    };
  }
}
