"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { enquiries, activities, bookings, quotes, tasks } from "@/lib/db/schema";
import { randomUUID } from "node:crypto";

type Stage = "new" | "contacted" | "quoted" | "won" | "lost";
type Kind = "note" | "call" | "whatsapp" | "email" | "stage" | "payment" | "assign";

async function log(sp: { userId: number; name: string }, leadId: number, kind: Kind, body: string) {
  await db.insert(activities).values({ entityType: "lead", entityId: leadId, userId: sp.userId, userName: sp.name, kind, body });
}
function bust(id?: number) {
  revalidatePath("/admin/leads");
  if (id) revalidatePath(`/admin/leads/${id}`);
}

export async function addLead(formData: FormData) {
  const sp = await requirePermission("leads");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const value = Number(formData.get("value")) || null;
  const [row] = await db
    .insert(enquiries)
    .values({
      name,
      phone: (String(formData.get("phone") ?? "").trim() || null) as string | null,
      email: (String(formData.get("email") ?? "").trim() || null) as string | null,
      message: String(formData.get("message") ?? "").trim() || "—",
      source: "manual",
      value,
    })
    .returning({ id: enquiries.id });
  await log(sp, row.id, "note", "Lead created");
  // Automation: raise a same-day follow-up task assigned to whoever added it.
  const due = new Date();
  due.setDate(due.getDate() + 1);
  await db.insert(tasks).values({
    title: `Follow up with ${name}`,
    dueAt: due.toISOString().slice(0, 10),
    ownerId: sp.userId,
    relatedType: "lead",
    relatedId: row.id,
  });
  revalidatePath("/admin/tasks");
  bust();
}

export async function setStage(formData: FormData) {
  const sp = await requirePermission("leads");
  const id = Number(formData.get("id"));
  const stage = String(formData.get("stage")) as Stage;
  if (!id) return;
  await db.update(enquiries).set({ stage }).where(eq(enquiries.id, id));
  await log(sp, id, "stage", `Moved to ${stage}`);
  bust(id);
}

export async function assignLead(formData: FormData) {
  const sp = await requirePermission("leads");
  const id = Number(formData.get("id"));
  const ownerId = Number(formData.get("ownerId")) || null;
  if (!id) return;
  await db.update(enquiries).set({ ownerId }).where(eq(enquiries.id, id));
  await log(sp, id, "assign", ownerId ? `Assigned to user #${ownerId}` : "Unassigned (returned to pool)");
  bust(id);
}

export async function claimLead(formData: FormData) {
  const sp = await requirePermission("leads");
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.update(enquiries).set({ ownerId: sp.userId }).where(eq(enquiries.id, id));
  await log(sp, id, "assign", `${sp.name} claimed this lead`);
  bust(id);
}

export async function setFollowUp(formData: FormData) {
  const sp = await requirePermission("leads");
  const id = Number(formData.get("id"));
  const raw = String(formData.get("followUpAt") ?? "").trim();
  if (!id) return;
  const followUpAt = raw ? new Date(raw) : null;
  await db.update(enquiries).set({ followUpAt }).where(eq(enquiries.id, id));
  await log(sp, id, "note", followUpAt ? `Follow-up set for ${raw}` : "Follow-up cleared");
  bust(id);
}

export async function addNote(formData: FormData) {
  const sp = await requirePermission("leads");
  const id = Number(formData.get("id"));
  const body = String(formData.get("body") ?? "").trim();
  const kind = (String(formData.get("kind") ?? "note") as Kind) || "note";
  if (!id || !body) return;
  await log(sp, id, kind, body);
  bust(id);
}

export async function convertToBooking(formData: FormData) {
  const sp = await requirePermission("leads");
  const id = Number(formData.get("id"));
  if (!id) return;
  const lead = await db.query.enquiries.findFirst({ where: eq(enquiries.id, id) });
  if (!lead || lead.bookingId) return;
  const [b] = await db
    .insert(bookings)
    .values({
      clientName: lead.name,
      phone: lead.phone,
      email: lead.email,
      shoot: lead.message?.slice(0, 200) ?? null,
      amount: lead.value ?? 0,
      amountPaid: 0,
      status: "confirmed",
      paymentStatus: "unpaid",
      ownerId: lead.ownerId,
    })
    .returning({ id: bookings.id });
  await db.update(enquiries).set({ bookingId: b.id, stage: "won" }).where(eq(enquiries.id, id));
  await log(sp, id, "stage", `Converted to booking #${b.id}`);
  revalidatePath("/admin/bookings");
  bust(id);
}

export async function updateLeadFields(formData: FormData) {
  const sp = await requirePermission("leads");
  const id = Number(formData.get("id"));
  if (!id) return;
  const value = Number(formData.get("value")) || null;
  const score = Math.max(0, Math.min(100, Number(formData.get("score")) || 0));
  const source = String(formData.get("source") ?? "").trim() || "manual";
  const lostReason = String(formData.get("lostReason") ?? "").trim() || null;
  await db.update(enquiries).set({ value, score, source, lostReason }).where(eq(enquiries.id, id));
  await log(sp, id, "note", "Lead details updated");
  bust(id);
}

/** One-tap: spin up a draft quote pre-filled from this lead and jump into the builder. */
export async function quoteFromLead(formData: FormData) {
  const sp = await requirePermission("leads");
  const id = Number(formData.get("id"));
  if (!id) return;
  const lead = await db.query.enquiries.findFirst({ where: eq(enquiries.id, id) });
  if (!lead) return;
  const [q] = await db
    .insert(quotes)
    .values({ clientName: lead.name, phone: lead.phone, email: lead.email, leadId: lead.id, ownerId: lead.ownerId ?? sp.userId, token: randomUUID().replace(/-/g, "").slice(0, 32) })
    .returning({ id: quotes.id });
  if (lead.stage === "new" || lead.stage === "contacted") {
    await db.update(enquiries).set({ stage: "quoted" }).where(eq(enquiries.id, id));
  }
  await log(sp, id, "note", `Quote #${q.id} started`);
  revalidatePath("/admin/quotes");
  redirect(`/admin/quotes/${q.id}`);
}

export async function deleteLead(formData: FormData) {
  await requirePermission("leads");
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(enquiries).where(eq(enquiries.id, id));
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}
