"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";

const priceSchema = z.object({
  id: z.coerce.number().int().positive(),
  price: z.coerce.number().int().min(0).max(10_000_000),
});

export async function updateProductPrice(formData: FormData) {
  await requirePermission("content");
  const { id, price } = priceSchema.parse({ id: formData.get("id"), price: formData.get("price") });
  await db.update(products).set({ price }).where(eq(products.id, id));
  // Prices appear on home, /packages, every /category/* and the nav → regenerate all.
  revalidatePath("/", "layout");
}

const nameSchema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().min(1).max(120),
});

export async function updateProductName(formData: FormData) {
  await requirePermission("content");
  const { id, name } = nameSchema.parse({ id: formData.get("id"), name: formData.get("name") });
  await db.update(products).set({ name }).where(eq(products.id, id));
  revalidatePath("/", "layout");
}
