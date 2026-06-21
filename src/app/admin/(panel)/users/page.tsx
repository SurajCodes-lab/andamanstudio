import { db } from "@/lib/db/client";
import { guardPage, MODULES } from "@/lib/permissions";
import { Card, Field, PageHeader, SaveButton, fieldCls } from "../ui";
import { addRole, updateRolePermissions, deleteRole, addUser, setUserRole, resetPassword, deleteUser } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminUsers() {
  await guardPage("users");
  const allRoles = await db.query.roles.findMany({ orderBy: (t, { asc }) => asc(t.id) });
  const allUsers = await db.query.users.findMany({ orderBy: (t, { asc }) => asc(t.id), with: { roleRef: true } });

  return (
    <div>
      <PageHeader title="Users & roles" subtitle="Create staff logins, assign roles, and control exactly what each role can see and do." />

      {/* Roles + permission matrix */}
      <h2 className="meta mb-3 text-on-deep/45">Roles & permissions</h2>
      <div className="space-y-5">
        {allRoles.map((r) => (
          <Card key={r.id}>
            <form action={updateRolePermissions}>
              <input type="hidden" name="id" value={r.id} />
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-lg text-gold-soft">{r.name}{r.isOwner && <span className="ml-2 text-xs text-on-deep/40">· full access</span>}</h3>
                {!r.isOwner && (
                  <button formAction={deleteRole} className="text-xs uppercase tracking-[0.1em] text-on-deep/40 hover:text-[#e0633b]">Delete role</button>
                )}
              </div>
              {r.isOwner ? (
                <p className="text-sm text-on-deep/50">The Owner role can do everything and can&apos;t be restricted.</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-on-deep/40">
                          <th className="py-1 font-normal">Module</th>
                          <th className="px-3 py-1 text-center font-normal">View</th>
                          <th className="px-3 py-1 text-center font-normal">Manage (add / edit)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MODULES.map((m) => {
                          const p = r.permissions[m.key] ?? { view: false, manage: false };
                          return (
                            <tr key={m.key} className="border-t border-line">
                              <td className="py-2 text-on-deep/80">{m.label}</td>
                              <td className="px-3 py-2 text-center"><input type="checkbox" name={`${m.key}.view`} defaultChecked={p.view} className="h-4 w-4 accent-[#d8a82f]" /></td>
                              <td className="px-3 py-2 text-center"><input type="checkbox" name={`${m.key}.manage`} defaultChecked={p.manage} className="h-4 w-4 accent-[#d8a82f]" /></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-[0.7rem] text-on-deep/35">Tip: turn off “Manage” to make a role view-only — its Add/Edit buttons disappear automatically.</p>
                  <div className="mt-3"><SaveButton>Save permissions</SaveButton></div>
                </>
              )}
            </form>
          </Card>
        ))}

        <Card>
          <form action={addRole} className="flex items-end gap-3">
            <div className="flex-1"><Field label="New role name"><input name="name" placeholder="e.g. Photographer" className={fieldCls} /></Field></div>
            <SaveButton>Add role</SaveButton>
          </form>
        </Card>
      </div>

      {/* Users */}
      <h2 className="meta mb-3 mt-12 text-on-deep/45">Staff logins</h2>
      <Card className="mb-5">
        <h3 className="mb-3 font-serif text-lg text-gold-soft">Add a user</h3>
        <form action={addUser} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name"><input name="name" className={fieldCls} /></Field>
            <Field label="Email"><input name="email" type="email" required className={fieldCls} /></Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Password" hint="min 8 chars"><input name="password" type="text" required className={fieldCls} /></Field>
            <Field label="Role">
              <select name="roleId" className={fieldCls}>
                {allRoles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </Field>
          </div>
          <SaveButton>Add user</SaveButton>
        </form>
      </Card>

      <div className="space-y-3">
        {allUsers.map((u) => (
          <div key={u.id} className="rounded-xl border border-line bg-surface/30 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-serif text-on-deep">{u.name ?? u.email}</span>
              <span className="mono text-[0.6rem] text-on-deep/40">{u.email}</span>
              <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-gold">{u.roleRef?.name ?? "Owner"}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <form action={setUserRole} className="flex items-end gap-2">
                <input type="hidden" name="id" value={u.id} />
                <select name="roleId" defaultValue={u.roleId ?? ""} className={`${fieldCls} w-44`}>
                  {allRoles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <button className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.08em] text-on-deep/70 hover:border-gold hover:text-gold">Set role</button>
              </form>
              <form action={resetPassword} className="flex items-end gap-2">
                <input type="hidden" name="id" value={u.id} />
                <input name="password" placeholder="New password" className={`${fieldCls} w-44`} />
                <button className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.08em] text-on-deep/70 hover:border-gold hover:text-gold">Reset</button>
              </form>
              {!u.roleRef?.isOwner && (
                <form action={deleteUser} className="ml-auto"><input type="hidden" name="id" value={u.id} /><button className="text-xs uppercase tracking-[0.1em] text-on-deep/40 hover:text-[#e0633b]">Delete</button></form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
