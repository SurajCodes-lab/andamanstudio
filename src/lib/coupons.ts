import { db } from "./db/client";
import { coupons } from "./db/schema";
import { eq, sql } from "drizzle-orm";

export type Coupon = typeof coupons.$inferSelect;

export type CouponCheck =
  | { ok: true; coupon: Coupon; discount: number; total: number }
  | { ok: false; reason: string };

/** Compute the rupee discount a coupon yields on a subtotal (never below 0). */
export function couponDiscount(c: Pick<Coupon, "type" | "value">, subtotal: number): number {
  const d = c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value;
  return Math.max(0, Math.min(d, subtotal));
}

/** Validate a coupon code against a subtotal and return the resulting discount/total. */
export async function checkCoupon(code: string, subtotal: number): Promise<CouponCheck> {
  const clean = code.trim().toUpperCase();
  if (!clean) return { ok: false, reason: "No code entered" };
  const c = await db.query.coupons.findFirst({ where: eq(coupons.code, clean) });
  if (!c) return { ok: false, reason: "Code not found" };
  if (!c.active) return { ok: false, reason: "Coupon is inactive" };
  const today = new Date().toISOString().slice(0, 10);
  if (c.startsAt && today < c.startsAt) return { ok: false, reason: `Not valid until ${c.startsAt}` };
  if (c.expiresAt && today > c.expiresAt) return { ok: false, reason: `Expired on ${c.expiresAt}` };
  if (c.maxRedemptions != null && c.timesUsed >= c.maxRedemptions) return { ok: false, reason: "Usage limit reached" };
  if (c.minAmount != null && subtotal < c.minAmount) return { ok: false, reason: `Min order ₹${c.minAmount.toLocaleString("en-IN")}` };
  const discount = couponDiscount(c, subtotal);
  return { ok: true, coupon: c, discount, total: subtotal - discount };
}

/** Increment redemption counter after a coupon is actually applied. */
export async function redeemCoupon(code: string) {
  const clean = code.trim().toUpperCase();
  if (!clean) return;
  await db.update(coupons).set({ timesUsed: sql`${coupons.timesUsed} + 1` }).where(eq(coupons.code, clean));
}
