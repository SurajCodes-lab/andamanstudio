"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { categories, categoryImages, products, priceTiers, blackoutDates } from "@/lib/db/schema";

function bust() {
  revalidatePath("/", "layout");
}

/* ---------------- Seasonal price tiers ---------------- */
export async function addPriceTier(formData: FormData) {
  await requirePermission("content");
  const productId = Number(formData.get("productId"));
  const startOn = String(formData.get("startOn") ?? "").trim();
  const endOn = String(formData.get("endOn") ?? "").trim();
  const price = Number(formData.get("price"));
  if (!productId || !startOn || !endOn || !Number.isFinite(price)) return;
  await db.insert(priceTiers).values({
    productId,
    label: String(formData.get("label") ?? "").trim() || "Season",
    startOn,
    endOn,
    price: Math.round(price),
    order: 999,
  });
  bust();
}

export async function deletePriceTier(formData: FormData) {
  await requirePermission("content");
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(priceTiers).where(eq(priceTiers.id, id));
  bust();
}

/* ---------------- Per-product blackout days (slots full) ---------------- */
export async function addBlackout(formData: FormData) {
  await requirePermission("content");
  const productId = Number(formData.get("productId"));
  const day = String(formData.get("day") ?? "").trim();
  if (!productId || !day) return;
  await db
    .insert(blackoutDates)
    .values({ productId, day, reason: String(formData.get("reason") ?? "").trim() || null })
    .onConflictDoNothing();
  bust();
}

export async function deleteBlackout(formData: FormData) {
  await requirePermission("content");
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(blackoutDates).where(eq(blackoutDates.id, id));
  bust();
}

const catSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().min(1).max(200),
  blurb: z.string().min(1),
  longDescription: z.string().min(1),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(400).optional(),
});

export async function updateCategory(formData: FormData) {
  await requirePermission("content");
  const v = catSchema.parse({
    id: formData.get("id"),
    title: formData.get("title"),
    blurb: formData.get("blurb"),
    longDescription: formData.get("longDescription"),
    metaTitle: (formData.get("metaTitle") as string) || undefined,
    metaDescription: (formData.get("metaDescription") as string) || undefined,
  });
  await db
    .update(categories)
    .set({ title: v.title, blurb: v.blurb, longDescription: v.longDescription, metaTitle: v.metaTitle ?? null, metaDescription: v.metaDescription ?? null })
    .where(eq(categories.id, v.id));
  bust();
}

export async function setCategoryHero(formData: FormData) {
  await requirePermission("content");
  const targetId = Number(formData.get("targetId"));
  const mediaId = Number(formData.get("mediaId"));
  if (!targetId || !mediaId) return;
  await db.update(categories).set({ heroMediaId: mediaId }).where(eq(categories.id, targetId));
  bust();
}

export async function addCategoryImage(formData: FormData) {
  await requirePermission("content");
  const targetId = Number(formData.get("targetId"));
  const mediaId = Number(formData.get("mediaId"));
  if (!targetId || !mediaId) return;
  await db.insert(categoryImages).values({ categoryId: targetId, mediaId, order: 999 });
  bust();
}

export async function removeCategoryImage(formData: FormData) {
  await requirePermission("content");
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(categoryImages).where(eq(categoryImages.id, id));
  bust();
}

const prodSchema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().min(1).max(160),
  price: z.coerce.number().int().min(0).max(10_000_000),
  note: z.string().max(300).optional(),
  specs: z.string(),
});

export async function updateProduct(formData: FormData) {
  await requirePermission("content");
  const v = prodSchema.parse({
    id: formData.get("id"),
    name: formData.get("name"),
    price: formData.get("price"),
    note: (formData.get("note") as string) || undefined,
    specs: formData.get("specs") ?? "",
  });
  const specs = v.specs.split("\n").map((s) => s.trim()).filter(Boolean);
  await db.update(products).set({ name: v.name, price: v.price, note: v.note ?? null, specs }).where(eq(products.id, v.id));
  bust();
}

export async function addProduct(formData: FormData) {
  await requirePermission("content");
  const categoryId = Number(formData.get("categoryId"));
  if (!categoryId) return;
  await db.insert(products).values({ categoryId, name: "New package", price: 0, specs: [], order: 999 });
  bust();
}

export async function deleteProduct(formData: FormData) {
  await requirePermission("content");
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(products).where(eq(products.id, id));
  bust();
}
