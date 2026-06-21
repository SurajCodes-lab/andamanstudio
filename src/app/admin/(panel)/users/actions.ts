"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission, MODULES, type PermMap } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { roles, users } from "@/lib/db/schema";

function bust() {
  revalidatePath("/admin/users");
}

/* ---------------- Roles ---------------- */
export async function addRole(formData: FormData) {
  await requirePermission("users");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await db.insert(roles).values({ name, isOwner: false, permissions: {} }).onConflictDoNothing();
  bust();
}

export async function updateRolePermissions(formData: FormData) {
  await requirePermission("users");
  const id = Number(formData.get("id"));
  if (!id) return;
  const perms: PermMap = {};
  for (const m of MODULES) {
    const manage = formData.get(`${m.key}.manage`) === "on";
    const view = manage || formData.get(`${m.key}.view`) === "on";
    perms[m.key] = { view, manage };
  }
  await db.update(roles).set({ permissions: perms }).where(eq(roles.id, id));
  revalidatePath("/", "layout");
  bust();
}

export async function deleteRole(formData: FormData) {
  await requirePermission("users");
  const id = Number(formData.get("id"));
  if (!id) return;
  const role = await db.query.roles.findFirst({ where: eq(roles.id, id) });
  if (!role || role.isOwner) return; // never delete the Owner role
  await db.update(users).set({ roleId: null }).where(eq(users.roleId, id));
  await db.delete(roles).where(eq(roles.id, id));
  bust();
}

/* ---------------- Users ---------------- */
export async function addUser(formData: FormData) {
  await requirePermission("users");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim() || null;
  const roleId = Number(formData.get("roleId")) || null;
  if (!email || password.length < 8) return;
  const passwordHash = await bcrypt.hash(password, 12);
  await db
    .insert(users)
    .values({ email, name, passwordHash, role: "staff", roleId })
    .onConflictDoUpdate({ target: users.email, set: { name, roleId } });
  bust();
}

export async function setUserRole(formData: FormData) {
  await requirePermission("users");
  const id = Number(formData.get("id"));
  const roleId = Number(formData.get("roleId")) || null;
  if (!id) return;
  await db.update(users).set({ roleId }).where(eq(users.id, id));
  bust();
}

export async function resetPassword(formData: FormData) {
  await requirePermission("users");
  const id = Number(formData.get("id"));
  const password = String(formData.get("password") ?? "");
  if (!id || password.length < 8) return;
  await db.update(users).set({ passwordHash: await bcrypt.hash(password, 12) }).where(eq(users.id, id));
  bust();
}

export async function deleteUser(formData: FormData) {
  await requirePermission("users");
  const id = Number(formData.get("id"));
  if (!id) return;
  const u = await db.query.users.findFirst({ where: eq(users.id, id), with: { roleRef: true } });
  if (u?.roleRef?.isOwner) return; // protect owner accounts
  await db.delete(users).where(eq(users.id, id));
  bust();
}
