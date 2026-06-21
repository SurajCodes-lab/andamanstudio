"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { testimonials } from "@/lib/db/schema";

const schema = z.object({
  id: z.coerce.number().int().positive(),
  quote: z.string().min(1).max(800),
  name: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
});

function bust() {
  revalidatePath("/", "layout");
}

export async function updateTestimonial(formData: FormData) {
  await requirePermission("content");
  const v = schema.parse({
    id: formData.get("id"),
    quote: formData.get("quote"),
    name: formData.get("name"),
    role: formData.get("role"),
  });
  await db.update(testimonials).set({ quote: v.quote, name: v.name, role: v.role }).where(eq(testimonials.id, v.id));
  bust();
}

export async function addTestimonial() {
  await requirePermission("content");
  await db.insert(testimonials).values({ quote: "New review…", name: "Client name", role: "Their role", order: 999 });
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
  await requirePermission("content");
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(testimonials).where(eq(testimonials.id, id));
  bust();
  revalidatePath("/admin/testimonials");
}
