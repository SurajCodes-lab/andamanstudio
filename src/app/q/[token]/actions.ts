"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { quotes, activities } from "@/lib/db/schema";
import { getSite } from "@/lib/db/queries";
import { createPaymentLink } from "@/lib/payments/gateway";

async function bytoken(token: string) {
  return db.query.quotes.findFirst({ where: eq(quotes.token, token) });
}

export async function acceptQuotePublic(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const q = await bytoken(token);
  if (!q) return;
  if (q.status === "draft" || q.status === "sent") {
    await db.update(quotes).set({ status: "accepted" }).where(eq(quotes.id, q.id));
    if (q.leadId) {
      await db.insert(activities).values({ entityType: "lead", entityId: q.leadId, kind: "stage", body: `Client accepted quote #${q.id} online` });
      revalidatePath("/admin/leads");
    }
    revalidatePath("/admin/quotes");
    revalidatePath(`/q/${token}`);
  }
}

export async function startPaymentPublic(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const q = await bytoken(token);
  if (!q) return;

  const link = await createPaymentLink({ token, amount: q.total, clientName: q.clientName, email: q.email, phone: q.phone });
  if (link) redirect(link);

  // No gateway yet (CCAvenue pending) → hand off to WhatsApp to arrange payment.
  const site = await getSite();
  const text = `Hi Andaman Studio! I'd like to pay for quote #${q.id} (${q.clientName}) — total ₹${q.total.toLocaleString("en-IN")}.`;
  redirect(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`);
}
