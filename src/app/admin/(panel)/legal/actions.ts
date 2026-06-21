"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { legalPages } from "@/lib/db/schema";

const schema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(400).optional(),
});

export async function updateLegalPage(formData: FormData) {
  await requirePermission("content");
  const v = schema.parse({
    id: formData.get("id"),
    title: formData.get("title"),
    body: formData.get("body"),
    metaTitle: (formData.get("metaTitle") as string) || undefined,
    metaDescription: (formData.get("metaDescription") as string) || undefined,
  });
  await db
    .update(legalPages)
    .set({ title: v.title, body: v.body, metaTitle: v.metaTitle ?? null, metaDescription: v.metaDescription ?? null })
    .where(eq(legalPages.id, v.id));
  revalidatePath("/", "layout");
}
