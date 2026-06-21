"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { bookings, payments, activities } from "@/lib/db/schema";

type SP = { userId: number; name: string };
async function logB(sp: SP, bookingId: number, kind: "note" | "payment" | "stage" | "assign", body: string) {
  await db.insert(activities).values({ entityType: "booking", entityId: bookingId, userId: sp.userId, userName: sp.name, kind, body });
}
async function recompute(bookingId: number) {
  const ps = await db.query.payments.findMany({ where: eq(payments.bookingId, bookingId) });
  const paid = ps.reduce((n, p) => n + p.amount, 0);
  const b = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingId) });
  const total = b?.amount ?? 0;
  const status = paid <= 0 ? "unpaid" : paid >= total ? "paid" : "partial";
  await db.update(bookings).set({ amountPaid: paid, paymentStatus: status }).where(eq(bookings.id, bookingId));
}
function bust(id?: number) {
  revalidatePath("/admin/bookings");
  if (id) revalidatePath(`/admin/bookings/${id}`);
}

const bookingSchema = z.object({
  clientName: z.string().min(1).max(160),
  phone: z.string().max(40).optional(),
  email: z.string().max(160).optional(),
  shoot: z.string().max(200).optional(),
  shootDate: z.string().max(60).optional(),
  shootOn: z.string().max(20).optional(),
  amount: z.coerce.number().int().min(0).max(100_000_000),
  status: z.enum(["enquiry", "confirmed", "completed", "cancelled"]),
  ownerId: z.coerce.number().int().optional(),
  notes: z.string().max(600).optional(),
});
function parse(fd: FormData) {
  return bookingSchema.parse({
    clientName: fd.get("clientName"),
    phone: (fd.get("phone") as string) || undefined,
    email: (fd.get("email") as string) || undefined,
    shoot: (fd.get("shoot") as string) || undefined,
    shootDate: (fd.get("shootDate") as string) || undefined,
    shootOn: (fd.get("shootOn") as string) || undefined,
    amount: fd.get("amount") ?? 0,
    status: fd.get("status") || "confirmed",
    ownerId: (fd.get("ownerId") as string) || undefined,
    notes: (fd.get("notes") as string) || undefined,
  });
}

export async function addBooking(formData: FormData) {
  await requirePermission("bookings");
  const v = parse(formData);
  await db.insert(bookings).values({
    clientName: v.clientName,
    phone: v.phone ?? null,
    email: v.email ?? null,
    shoot: v.shoot ?? null,
    shootDate: v.shootDate ?? null,
    shootOn: v.shootOn ?? null,
    amount: v.amount,
    status: v.status,
    ownerId: v.ownerId ?? null,
    notes: v.notes ?? null,
  });
  bust();
}

export async function updateBooking(formData: FormData) {
  await requirePermission("bookings");
  const id = Number(formData.get("id"));
  if (!id) return;
  const v = parse(formData);
  await db
    .update(bookings)
    .set({
      clientName: v.clientName,
      phone: v.phone ?? null,
      email: v.email ?? null,
      shoot: v.shoot ?? null,
      shootDate: v.shootDate ?? null,
      amount: v.amount,
      status: v.status,
      ownerId: v.ownerId ?? null,
      notes: v.notes ?? null,
    })
    .where(eq(bookings.id, id));
  await recompute(id);
  bust(id);
}

export async function deleteBooking(formData: FormData) {
  await requirePermission("bookings");
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(bookings).where(eq(bookings.id, id));
  revalidatePath("/admin/bookings");
  redirect("/admin/bookings");
}

/* ---------------- Payments ---------------- */
export async function addPayment(formData: FormData) {
  const sp = await requirePermission("bookings");
  const bookingId = Number(formData.get("bookingId"));
  const amount = Number(formData.get("amount"));
  const method = (String(formData.get("method")) || "upi") as "cash" | "upi" | "bank" | "card" | "other";
  const paidAt = (String(formData.get("paidAt") ?? "").trim() || null) as string | null;
  const note = (String(formData.get("note") ?? "").trim() || null) as string | null;
  if (!bookingId || !amount) return;
  await db.insert(payments).values({ bookingId, amount, method, paidAt, note });
  await recompute(bookingId);
  await logB(sp, bookingId, "payment", `Payment ₹${amount.toLocaleString("en-IN")} (${method})`);
  bust(bookingId);
}

export async function deletePayment(formData: FormData) {
  await requirePermission("bookings");
  const id = Number(formData.get("id"));
  if (!id) return;
  const p = await db.query.payments.findFirst({ where: eq(payments.id, id) });
  await db.delete(payments).where(eq(payments.id, id));
  if (p) {
    await recompute(p.bookingId);
    bust(p.bookingId);
  }
}

/* ---------------- Deliverables ---------------- */
export async function updateDeliverables(formData: FormData) {
  const sp = await requirePermission("bookings");
  const id = Number(formData.get("id"));
  if (!id) return;
  const deliveryStatus = String(formData.get("deliveryStatus")) as "pending" | "shot" | "editing" | "delivered";
  await db
    .update(bookings)
    .set({
      deliveryStatus,
      rawCount: Number(formData.get("rawCount")) || null,
      editedCount: Number(formData.get("editedCount")) || null,
      deliveredAt: (String(formData.get("deliveredAt") ?? "").trim() || null) as string | null,
    })
    .where(eq(bookings.id, id));
  await logB(sp, id, "stage", `Delivery: ${deliveryStatus}`);
  bust(id);
}

/* ---------------- Assignment ---------------- */
export async function assignBooking(formData: FormData) {
  const sp = await requirePermission("bookings");
  const id = Number(formData.get("id"));
  const ownerId = Number(formData.get("ownerId")) || null;
  if (!id) return;
  await db.update(bookings).set({ ownerId }).where(eq(bookings.id, id));
  await logB(sp, id, "assign", ownerId ? `Assigned to user #${ownerId}` : "Unassigned");
  bust(id);
}

export async function claimBooking(formData: FormData) {
  const sp = await requirePermission("bookings");
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.update(bookings).set({ ownerId: sp.userId }).where(eq(bookings.id, id));
  await logB(sp, id, "assign", `${sp.name} claimed this booking`);
  bust(id);
}
