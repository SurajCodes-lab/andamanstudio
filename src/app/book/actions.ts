"use server";

import { db } from "@/lib/db/client";
import { enquiries, tasks, activities, blackoutDates } from "@/lib/db/schema";
import { and, eq, isNull, or } from "drizzle-orm";
import { sendMail } from "@/lib/mail";
import { revalidatePath } from "next/cache";

export async function submitBooking(data: {
  name: string;
  phone?: string;
  email?: string;
  pkg: string;
  productId?: number;
  date: string;
  price?: number;
  message?: string;
}) {
  const name = (data.name || "").trim();
  const date = (data.date || "").trim();
  if (!name || !date) return { ok: false, error: "Name and date are required." };

  // Server-side guard: reject if the day is blocked globally or for this package (slots full).
  const blocked = await db.query.blackoutDates.findFirst({
    where: and(
      eq(blackoutDates.day, date),
      data.productId ? or(isNull(blackoutDates.productId), eq(blackoutDates.productId, data.productId)) : isNull(blackoutDates.productId)
    ),
  });
  if (blocked) return { ok: false, error: "That date is unavailable — please pick another." };

  const priceLine = data.price ? ` · ₹${data.price.toLocaleString("en-IN")}` : "";
  const message = `Booking request: ${data.pkg || "—"} on ${date}${priceLine}${data.message ? ` · ${data.message.trim()}` : ""}`;

  const [lead] = await db
    .insert(enquiries)
    .values({
      name,
      phone: data.phone?.trim() || null,
      email: data.email?.trim() || null,
      message,
      source: "booking",
      stage: "contacted",
      value: data.price || null,
    })
    .returning({ id: enquiries.id });

  await db.insert(activities).values({ entityType: "lead", entityId: lead.id, kind: "note", body: message });
  await db.insert(tasks).values({
    title: `Confirm booking — ${name} (${date})`,
    body: message,
    dueAt: new Date().toISOString().slice(0, 10),
    relatedType: "lead",
    relatedId: lead.id,
  });
  revalidatePath("/admin/leads");
  revalidatePath("/admin/tasks");

  await sendMail(
    `Booking request — ${name}`,
    `${message}\n\nPhone: ${data.phone ?? "-"}\nEmail: ${data.email ?? "-"}`
  );
  return { ok: true };
}
