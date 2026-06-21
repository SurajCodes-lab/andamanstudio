import "server-only";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { db } from "./db/client";
import { users } from "./db/schema";

// The permission modules. Each admin section maps to one of these.
export const MODULES = [
  { key: "leads", label: "Leads & pipeline" },
  { key: "quotes", label: "Quotes & proposals" },
  { key: "bookings", label: "Bookings & payments" },
  { key: "coupons", label: "Coupons & offers" },
  { key: "calendar", label: "Calendar & scheduling" },
  { key: "tasks", label: "Tasks & reminders" },
  { key: "content", label: "Content (images, packages, services, testimonials, legal)" },
  { key: "settings", label: "Site settings" },
  { key: "users", label: "Users & roles" },
] as const;

export type ModuleKey = (typeof MODULES)[number]["key"];
export type Cap = "view" | "manage";
export type PermMap = Record<string, { view: boolean; manage: boolean }>;
export type SessionPerms = { userId: number; name: string; email: string; roleName: string; isOwner: boolean; perms: PermMap };

export async function getSessionPerms(): Promise<SessionPerms | null> {
  const session = await auth();
  const id = Number(session?.user?.id);
  if (!id) return null;
  const u = await db.query.users.findFirst({ where: eq(users.id, id), with: { roleRef: true } });
  if (!u) return null;
  // Legacy admin (no role assigned) is treated as owner so existing logins keep full access.
  const isOwner = u.roleRef?.isOwner ?? !u.roleId;
  return {
    userId: id,
    name: u.name ?? u.email,
    email: u.email,
    roleName: u.roleRef?.name ?? "Owner",
    isOwner,
    perms: u.roleRef?.permissions ?? {},
  };
}

export function can(sp: SessionPerms | null, module: ModuleKey, cap: Cap = "view"): boolean {
  if (!sp) return false;
  if (sp.isOwner) return true;
  const p = sp.perms[module];
  if (!p) return false;
  return cap === "view" ? p.view || p.manage : p.manage;
}

/** For server actions — throws if the caller lacks the capability. */
export async function requirePermission(module: ModuleKey, cap: Cap = "manage") {
  const sp = await getSessionPerms();
  if (!can(sp, module, cap)) throw new Error("FORBIDDEN");
  return sp as SessionPerms;
}

/** For pages — redirects if the caller can't view the module. Returns perms for UI gating. */
export async function guardPage(module: ModuleKey, cap: Cap = "view") {
  const sp = await getSessionPerms();
  if (!sp) redirect("/admin/login");
  if (!can(sp, module, cap)) redirect("/admin");
  return sp;
}
