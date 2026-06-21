"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { services, serviceSections, serviceImages } from "@/lib/db/schema";

function bust() {
  revalidatePath("/", "layout");
}

const svcSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().min(1).max(200),
  eyebrow: z.string().min(1).max(200),
  summary: z.string().min(1).max(400),
  intro: z.string().min(1),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(400).optional(),
});

export async function updateService(formData: FormData) {
  await requirePermission("content");
  const v = svcSchema.parse({
    id: formData.get("id"),
    title: formData.get("title"),
    eyebrow: formData.get("eyebrow"),
    summary: formData.get("summary"),
    intro: formData.get("intro"),
    metaTitle: (formData.get("metaTitle") as string) || undefined,
    metaDescription: (formData.get("metaDescription") as string) || undefined,
  });
  await db
    .update(services)
    .set({
      title: v.title,
      eyebrow: v.eyebrow,
      summary: v.summary,
      intro: v.intro,
      metaTitle: v.metaTitle ?? null,
      metaDescription: v.metaDescription ?? null,
    })
    .where(eq(services.id, v.id));
  bust();
}

const secSchema = z.object({
  id: z.coerce.number().int().positive(),
  heading: z.string().min(1).max(200),
  body: z.string().min(1),
});

export async function updateSection(formData: FormData) {
  await requirePermission("content");
  const v = secSchema.parse({ id: formData.get("id"), heading: formData.get("heading"), body: formData.get("body") });
  await db.update(serviceSections).set({ heading: v.heading, body: v.body }).where(eq(serviceSections.id, v.id));
  bust();
}

export async function addSection(formData: FormData) {
  await requirePermission("content");
  const serviceId = Number(formData.get("serviceId"));
  if (!serviceId) return;
  await db.insert(serviceSections).values({ serviceId, heading: "New section", body: "Describe this part of the experience…", order: 999 });
  revalidatePath(`/admin/services`);
  bust();
}

export async function deleteSection(formData: FormData) {
  await requirePermission("content");
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(serviceSections).where(eq(serviceSections.id, id));
  bust();
}

export async function setServiceHero(formData: FormData) {
  await requirePermission("content");
  const targetId = Number(formData.get("targetId"));
  const mediaId = Number(formData.get("mediaId"));
  if (!targetId || !mediaId) return;
  await db.update(services).set({ heroMediaId: mediaId }).where(eq(services.id, targetId));
  bust();
}

export async function addGalleryImage(formData: FormData) {
  await requirePermission("content");
  const targetId = Number(formData.get("targetId"));
  const mediaId = Number(formData.get("mediaId"));
  if (!targetId || !mediaId) return;
  await db.insert(serviceImages).values({ serviceId: targetId, mediaId, order: 999 });
  bust();
}

export async function removeGalleryImage(formData: FormData) {
  await requirePermission("content");
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(serviceImages).where(eq(serviceImages.id, id));
  bust();
}
