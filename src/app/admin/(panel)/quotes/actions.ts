"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { quotes, quoteItems, bookings, enquiries, activities } from "@/lib/db/schema";
import { checkCoupon, redeemCoupon } from "@/lib/coupons";

import { randomUUID } from "node:crypto";

const newToken = () => randomUUID().replace(/-/g, "").slice(0, 32);
const norm = (v: FormDataEntryValue | null) => String(v ?? "").trim();
const num = (v: FormDataEntryValue | null) => {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) ? Math.round(n) : 0;
};

/** Recompute subtotal/discount/total from the items + any applied coupon. */
async function recompute(quoteId: number) {
  const q = await db.query.quotes.findFirst({ where: eq(quotes.id, quoteId), with: { items: true } });
  if (!q) return;
  const subtotal = q.items.reduce((s, it) => s + it.unitPrice * it.qty, 0);
  let discount = 0;
  if (q.couponCode) {
    const chk = await checkCoupon(q.couponCode, subtotal);
    discount = chk.ok ? chk.discount : 0;
  }
  await db.update(quotes).set({ subtotal, discount, total: subtotal - discount }).where(eq(quotes.id, quoteId));
}

export async function createQuote(formData: FormData) {
  const sp = await requirePermission("quotes");
  const clientName = norm(formData.get("clientName"));
  if (!clientName) return;
  const leadId = num(formData.get("leadId")) || null;
  const [q] = await db
    .insert(quotes)
    .values({
      clientName,
      phone: norm(formData.get("phone")) || null,
      email: norm(formData.get("email")) || null,
      leadId,
      ownerId: sp.userId,
      validUntil: norm(formData.get("validUntil")) || null,
      notes: norm(formData.get("notes")) || null,
      token: newToken(),
    })
    .returning();
  revalidatePath("/admin/quotes");
  redirect(`/admin/quotes/${q.id}`);
}

/** Make sure an older quote has a public token (for the share link). */
export async function ensureQuoteToken(formData: FormData) {
  await requirePermission("quotes");
  const quoteId = num(formData.get("quoteId"));
  const q = await db.query.quotes.findFirst({ where: eq(quotes.id, quoteId) });
  if (!q) return;
  if (!q.token) await db.update(quotes).set({ token: newToken() }).where(eq(quotes.id, quoteId));
  revalidatePath(`/admin/quotes/${quoteId}`);
}

/** Record a payment against the quote manually (until the gateway settles it). */
export async function markQuotePaid(formData: FormData) {
  const sp = await requirePermission("quotes");
  const quoteId = num(formData.get("quoteId"));
  const q = await db.query.quotes.findFirst({ where: eq(quotes.id, quoteId) });
  if (!q) return;
  await db.update(quotes).set({ paymentStatus: "paid", amountPaid: q.total }).where(eq(quotes.id, quoteId));
  if (q.leadId) {
    await db.insert(activities).values({
      entityType: "lead", entityId: q.leadId, userId: sp.userId, userName: sp.name,
      kind: "payment", body: `Quote #${q.id} marked paid (${q.total.toLocaleString("en-IN")})`,
    });
  }
  revalidatePath(`/admin/quotes/${quoteId}`);
}

export async function addQuoteItem(formData: FormData) {
  await requirePermission("quotes");
  const quoteId = num(formData.get("quoteId"));
  const name = norm(formData.get("name"));
  if (!quoteId || !name) return;
  await db.insert(quoteItems).values({
    quoteId,
    name,
    qty: Math.max(1, num(formData.get("qty")) || 1),
    unitPrice: num(formData.get("unitPrice")),
    order: 999,
  });
  await recompute(quoteId);
  revalidatePath(`/admin/quotes/${quoteId}`);
}

export async function deleteQuoteItem(formData: FormData) {
  await requirePermission("quotes");
  const id = num(formData.get("id"));
  const quoteId = num(formData.get("quoteId"));
  if (!id) return;
  await db.delete(quoteItems).where(eq(quoteItems.id, id));
  await recompute(quoteId);
  revalidatePath(`/admin/quotes/${quoteId}`);
}

export async function applyQuoteCoupon(formData: FormData) {
  await requirePermission("quotes");
  const quoteId = num(formData.get("quoteId"));
  const code = norm(formData.get("couponCode")).toUpperCase();
  if (!quoteId) return;
  await db.update(quotes).set({ couponCode: code || null }).where(eq(quotes.id, quoteId));
  await recompute(quoteId);
  revalidatePath(`/admin/quotes/${quoteId}`);
}

export async function setQuoteStatus(formData: FormData) {
  await requirePermission("quotes");
  const quoteId = num(formData.get("quoteId"));
  const status = norm(formData.get("status")) as "draft" | "sent" | "accepted" | "declined" | "expired";
  if (!quoteId) return;
  await db.update(quotes).set({ status }).where(eq(quotes.id, quoteId));
  revalidatePath(`/admin/quotes/${quoteId}`);
}

export async function updateQuoteMeta(formData: FormData) {
  await requirePermission("quotes");
  const quoteId = num(formData.get("quoteId"));
  if (!quoteId) return;
  await db
    .update(quotes)
    .set({
      clientName: norm(formData.get("clientName")),
      phone: norm(formData.get("phone")) || null,
      email: norm(formData.get("email")) || null,
      validUntil: norm(formData.get("validUntil")) || null,
      notes: norm(formData.get("notes")) || null,
    })
    .where(eq(quotes.id, quoteId));
  revalidatePath(`/admin/quotes/${quoteId}`);
}

/** Accept the quote: create a booking from it, mark won, redeem the coupon. */
export async function acceptQuote(formData: FormData) {
  const sp = await requirePermission("quotes");
  const quoteId = num(formData.get("quoteId"));
  const q = await db.query.quotes.findFirst({ where: eq(quotes.id, quoteId), with: { items: true } });
  if (!q) return;
  if (q.bookingId) redirect(`/admin/bookings/${q.bookingId}`);

  const shoot = q.items.map((it) => (it.qty > 1 ? `${it.name} ×${it.qty}` : it.name)).join(", ");
  const [b] = await db
    .insert(bookings)
    .values({
      clientName: q.clientName,
      phone: q.phone,
      email: q.email,
      shoot: shoot || null,
      amount: q.total,
      discount: q.discount,
      couponCode: q.couponCode,
      quoteId: q.id,
      ownerId: q.ownerId ?? sp.userId,
      status: "confirmed",
      paymentStatus: "unpaid",
    })
    .returning();

  await db.update(quotes).set({ status: "accepted", bookingId: b.id }).where(eq(quotes.id, q.id));
  if (q.couponCode) await redeemCoupon(q.couponCode);
  if (q.leadId) {
    await db.update(enquiries).set({ stage: "won", bookingId: b.id }).where(eq(enquiries.id, q.leadId));
    await db.insert(activities).values({
      entityType: "lead", entityId: q.leadId, userId: sp.userId, userName: sp.name,
      kind: "stage", body: `Quote #${q.id} accepted → booking #${b.id} created`,
    });
  }
  await db.insert(activities).values({
    entityType: "booking", entityId: b.id, userId: sp.userId, userName: sp.name,
    kind: "note", body: `Created from quote #${q.id} (${q.total.toLocaleString("en-IN")})`,
  });

  revalidatePath("/admin/quotes");
  revalidatePath("/admin/bookings");
  redirect(`/admin/bookings/${b.id}`);
}

export async function deleteQuote(formData: FormData) {
  await requirePermission("quotes");
  const id = num(formData.get("id"));
  if (!id) return;
  await db.delete(quotes).where(eq(quotes.id, id));
  revalidatePath("/admin/quotes");
  redirect("/admin/quotes");
}
