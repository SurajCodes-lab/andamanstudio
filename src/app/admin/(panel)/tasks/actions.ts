"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { tasks } from "@/lib/db/schema";

export async function addTask(formData: FormData) {
  await requirePermission("tasks");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  await db.insert(tasks).values({
    title,
    body: (String(formData.get("body") ?? "").trim() || null) as string | null,
    dueAt: (String(formData.get("dueAt") ?? "").trim() || null) as string | null,
    ownerId: Number(formData.get("ownerId")) || null,
  });
  revalidatePath("/admin/tasks");
  revalidatePath("/admin");
}

export async function toggleTask(formData: FormData) {
  await requirePermission("tasks");
  const id = Number(formData.get("id"));
  const done = formData.get("done") === "1";
  if (!id) return;
  await db.update(tasks).set({ done }).where(eq(tasks.id, id));
  revalidatePath("/admin/tasks");
  revalidatePath("/admin");
}

export async function deleteTask(formData: FormData) {
  await requirePermission("tasks");
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath("/admin/tasks");
}
