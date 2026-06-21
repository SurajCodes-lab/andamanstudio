import Link from "next/link";
import { db } from "@/lib/db/client";
import { guardPage, can } from "@/lib/permissions";
import { addTask, toggleTask, deleteTask } from "./actions";
import { Card, Field, PageHeader, SaveButton, fieldCls } from "../ui";

export const dynamic = "force-dynamic";

export default async function AdminTasks({ searchParams }: { searchParams: Promise<{ owner?: string }> }) {
  const sp = await guardPage("tasks");
  const manage = can(sp, "tasks", "manage");
  const { owner } = await searchParams;

  const rows = await db.query.tasks.findMany({ orderBy: (t, { asc }) => asc(t.dueAt) });
  const users = await db.query.users.findMany();
  const nameOf = (id: number | null) => users.find((u) => u.id === id)?.name ?? users.find((u) => u.id === id)?.email ?? "Anyone";
  const items = rows.filter((t) => (owner === "mine" ? t.ownerId === sp.userId : true));
  const open = items.filter((t) => !t.done);
  const done = items.filter((t) => t.done);
  const today = new Date().toISOString().slice(0, 10);

  const tab = (key: string, label: string) => (
    <Link href={key ? `/admin/tasks?owner=${key}` : "/admin/tasks"} className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.1em] ${(owner ?? "") === key ? "border-gold bg-gold text-ink-deep" : "border-line text-on-deep/65 hover:border-gold/50 hover:text-gold"}`}>{label}</Link>
  );

  const Row = ({ t }: { t: typeof rows[number] }) => (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface/30 p-3">
      {manage && (
        <form action={toggleTask}>
          <input type="hidden" name="id" value={t.id} />
          <input type="hidden" name="done" value={t.done ? "0" : "1"} />
          <button className={`flex h-5 w-5 items-center justify-center rounded border ${t.done ? "border-gold bg-gold text-ink-deep" : "border-line"}`}>{t.done ? "✓" : ""}</button>
        </form>
      )}
      <div className="min-w-0 flex-1">
        <p className={`text-sm ${t.done ? "text-on-deep/40 line-through" : "text-on-deep/85"}`}>{t.title}</p>
        <p className="mono text-[0.6rem] text-on-deep/35">{nameOf(t.ownerId)}{t.dueAt ? ` · due ${t.dueAt}${!t.done && t.dueAt < today ? " ⚠ overdue" : ""}` : ""}</p>
      </div>
      {manage && <form action={deleteTask}><input type="hidden" name="id" value={t.id} /><button className="text-xs text-on-deep/30 hover:text-[#e0633b]">✕</button></form>}
    </div>
  );

  return (
    <div>
      <PageHeader title="Tasks & reminders" subtitle="Assign follow-ups and to-dos to the team." action={<div className="flex gap-2">{tab("", "All")}{tab("mine", "Mine")}</div>} />

      {manage && (
        <Card className="mb-7">
          <form action={addTask} className="grid items-end gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
            <Field label="Task"><input name="title" required className={fieldCls} /></Field>
            <Field label="Due date"><input name="dueAt" type="date" className={fieldCls} /></Field>
            <Field label="Assign to"><select name="ownerId" className={fieldCls}><option value="">Anyone</option>{users.map((u) => <option key={u.id} value={u.id}>{u.name ?? u.email}</option>)}</select></Field>
            <SaveButton>Add</SaveButton>
          </form>
        </Card>
      )}

      <div className="space-y-2">
        {open.map((t) => <Row key={t.id} t={t} />)}
        {open.length === 0 && <p className="text-sm text-on-deep/40">No open tasks.</p>}
      </div>
      {done.length > 0 && (
        <>
          <h2 className="meta mb-2 mt-8 text-on-deep/40">Done</h2>
          <div className="space-y-2 opacity-60">{done.map((t) => <Row key={t.id} t={t} />)}</div>
        </>
      )}
    </div>
  );
}
