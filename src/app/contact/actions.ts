"use server";

import { db } from "@/lib/db/client";
import { enquiries, tasks, activities } from "@/lib/db/schema";
import { sendMail } from "@/lib/mail";
import { revalidatePath } from "next/cache";

// Public action — captures an enquiry from any page form (no auth).
export async function saveEnquiry(data: {
  name: string;
  phone?: string;
  email?: string;
  date?: string;
  pkg?: string;
  message?: string;
  source?: string;
}) {
  const name = (data.name || "").trim();
  if (!name) return { ok: false };
  const message =
    [data.pkg && `Package: ${data.pkg}`, data.date && `Preferred date: ${data.date}`, data.message?.trim()]
      .filter(Boolean)
      .join(" · ") || "—";
  const [lead] = await db
    .insert(enquiries)
    .values({
      name,
      phone: data.phone?.trim() || null,
      email: data.email?.trim() || null,
      message,
      source: data.source || "contact",
    })
    .returning({ id: enquiries.id });

  // Automation: log it on the timeline + raise a same-day follow-up task in the pool.
  await db.insert(activities).values({
    entityType: "lead", entityId: lead.id, kind: "note",
    body: `New ${data.source || "contact"} enquiry captured`,
  });
  const due = new Date();
  due.setDate(due.getDate() + 1);
  await db.insert(tasks).values({
    title: `Follow up with ${name}`,
    body: message,
    dueAt: due.toISOString().slice(0, 10),
    relatedType: "lead",
    relatedId: lead.id,
  });
  revalidatePath("/admin/leads");
  revalidatePath("/admin/tasks");

  await sendMail(
    `New enquiry — ${name}`,
    `Name: ${name}\nPhone: ${data.phone ?? "-"}\nEmail: ${data.email ?? "-"}\n\n${message}\n\nSource: ${data.source ?? "contact"}`
  );
  return { ok: true };
}
