"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { coupons } from "@/lib/db/schema";

const norm = (v: FormDataEntryValue | null) => String(v ?? "").trim();
const num = (v: FormDataEntryValue | null) => {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) ? Math.round(n) : null;
};
const dateOrNull = (v: FormDataEntryValue | null) => {
  const s = norm(v);
  return s || null;
};

export async function addCoupon(formData: FormData) {
  await requirePermission("coupons");
  const code = norm(formData.get("code")).toUpperCase();
  if (!code) return;
  const type = norm(formData.get("type")) === "flat" ? "flat" : "percent";
  await db
    .insert(coupons)
    .values({
      code,
      description: norm(formData.get("description")) || null,
      type,
      value: num(formData.get("value")) ?? 0,
      minAmount: num(formData.get("minAmount")),
      maxRedemptions: num(formData.get("maxRedemptions")),
      startsAt: dateOrNull(formData.get("startsAt")),
      expiresAt: dateOrNull(formData.get("expiresAt")),
      active: true,
    })
    .onConflictDoNothing();
  revalidatePath("/admin/coupons");
}

export async function updateCoupon(formData: FormData) {
  await requirePermission("coupons");
  const id = Number(formData.get("id"));
  if (!id) return;
  const type = norm(formData.get("type")) === "flat" ? "flat" : "percent";
  await db
    .update(coupons)
    .set({
      description: norm(formData.get("description")) || null,
      type,
      value: num(formData.get("value")) ?? 0,
      minAmount: num(formData.get("minAmount")),
      maxRedemptions: num(formData.get("maxRedemptions")),
      startsAt: dateOrNull(formData.get("startsAt")),
      expiresAt: dateOrNull(formData.get("expiresAt")),
      active: norm(formData.get("active")) === "1",
    })
    .where(eq(coupons.id, id));
  revalidatePath("/admin/coupons");
}

export async function toggleCoupon(formData: FormData) {
  await requirePermission("coupons");
  const id = Number(formData.get("id"));
  const active = norm(formData.get("active")) === "1";
  if (!id) return;
  await db.update(coupons).set({ active }).where(eq(coupons.id, id));
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(formData: FormData) {
  await requirePermission("coupons");
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(coupons).where(eq(coupons.id, id));
  revalidatePath("/admin/coupons");
}
