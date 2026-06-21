"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { imageSlots, categories, services } from "@/lib/db/schema";

const target = z.object({
  targetId: z.coerce.number().int().positive(),
  mediaId: z.coerce.number().int().positive(),
});

export async function setSlotImage(formData: FormData) {
  await requirePermission("content");
  const { targetId, mediaId } = target.parse({ targetId: formData.get("targetId"), mediaId: formData.get("mediaId") });
  await db.update(imageSlots).set({ mediaId }).where(eq(imageSlots.id, targetId));
  revalidatePath("/", "layout");
}

export async function setCategoryHero(formData: FormData) {
  await requirePermission("content");
  const { targetId, mediaId } = target.parse({ targetId: formData.get("targetId"), mediaId: formData.get("mediaId") });
  await db.update(categories).set({ heroMediaId: mediaId }).where(eq(categories.id, targetId));
  revalidatePath("/", "layout");
}

export async function setServiceHero(formData: FormData) {
  await requirePermission("content");
  const { targetId, mediaId } = target.parse({ targetId: formData.get("targetId"), mediaId: formData.get("mediaId") });
  await db.update(services).set({ heroMediaId: mediaId }).where(eq(services.id, targetId));
  revalidatePath("/", "layout");
}
