"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { media } from "@/lib/db/schema";

export async function updateAlt(formData: FormData) {
  await requirePermission("content");
  const id = Number(formData.get("id"));
  const alt = String(formData.get("alt") ?? "").slice(0, 300);
  if (!id) return;
  await db.update(media).set({ alt }).where(eq(media.id, id));
  revalidatePath("/", "layout");
}

export async function deleteMedia(formData: FormData) {
  await requirePermission("content");
  const id = Number(formData.get("id"));
  if (!id) return;
  try {
    await db.delete(media).where(eq(media.id, id));
    revalidatePath("/", "layout");
  } catch {
    // Foreign-key violation → image is still used somewhere. Leave it in place.
    // (The UI tells the user to swap it out of any content first.)
  }
}
