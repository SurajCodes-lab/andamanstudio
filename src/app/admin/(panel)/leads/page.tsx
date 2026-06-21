import Link from "next/link";
import { db } from "@/lib/db/client";
import { guardPage, can } from "@/lib/permissions";
import { formatINR } from "@/data/catalog";
import { addLead } from "./actions";
import { Card, Field, PageHeader, SaveButton, fieldCls } from "../ui";

export const dynamic = "force-dynamic";

const STAGES = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "quoted", label: "Quoted" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
] as const;

export default async function AdminLeads({ searchParams }: { searchParams: Promise<{ owner?: string; q?: string }> }) {
  const sp = await guardPage("leads");
  const manage = can(sp, "leads", "manage");
  const { owner, q } = await searchParams;
  const needle = (q ?? "").trim().toLowerCase();

  const rows = await db.query.enquiries.findMany({ orderBy: (t, { desc }) => desc(t.id) });
  const users = await db.query.users.findMany();
  const nameOf = (id: number | null) => users.find((u) => u.id === id)?.name ?? users.find((u) => u.id === id)?.email ?? null;

  const leads = rows.filter(
    (l) =>
      (owner === "mine" ? l.ownerId === sp.userId : owner === "pool" ? !l.ownerId : true) &&
      (!needle || [l.name, l.phone, l.email, l.message].some((v) => (v ?? "").toLowerCase().includes(needle)))
  );

  const qs = (extra: Record<string, string>) => {
    const p = new URLSearchParams();
    if (owner) p.set("owner", owner);
    if (q) p.set("q", q);
    for (const [k, v] of Object.entries(extra)) v ? p.set(k, v) : p.delete(k);
    const s = p.toString();
    return s ? `/admin/leads?${s}` : "/admin/leads";
  };
  const tab = (key: string, label: string) => (
    <Link
      href={qs({ owner: key })}
      className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.1em] ${
        (owner ?? "") === key ? "border-gold bg-gold text-ink-deep" : "border-line text-on-deep/65 hover:border-gold/50 hover:text-gold"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div>
      <PageHeader
        title="Leads & pipeline"
        subtitle="Every enquiry as a lead — move it through the pipeline, assign it, follow up and convert."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <form method="get" className="flex items-center gap-1.5">
              {owner ? <input type="hidden" name="owner" value={owner} /> : null}
              <input name="q" defaultValue={q ?? ""} placeholder="Search name / phone…" className="w-44 rounded-full border border-line bg-surface/40 px-4 py-1.5 text-xs text-on-deep placeholder:text-on-deep/35 outline-none focus:border-gold" />
              {q ? <Link href={qs({ q: "" })} className="text-xs text-on-deep/40 hover:text-gold">clear</Link> : null}
            </form>
            {tab("", "All")}{tab("mine", "Mine")}{tab("pool", "Unassigned")}
          </div>
        }
      />

      {manage && (
        <Card className="mb-7">
          <h3 className="mb-3 font-serif text-lg text-gold-soft">Add a lead</h3>
          <form action={addLead} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-4">
              <Field label="Name"><input name="name" required className={fieldCls} /></Field>
              <Field label="Phone"><input name="phone" className={fieldCls} /></Field>
              <Field label="Email"><input name="email" className={fieldCls} /></Field>
              <Field label="Est. value ₹"><input name="value" type="number" className={fieldCls} /></Field>
            </div>
            <Field label="Notes"><input name="message" className={fieldCls} /></Field>
            <SaveButton>Add lead</SaveButton>
          </form>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-5">
        {STAGES.map((st) => {
          const items = leads.filter((l) => l.stage === st.key);
          return (
            <div key={st.key} className="rounded-2xl border border-line bg-surface/20 p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="meta text-on-deep/60">{st.label}</span>
                <span className="mono text-[0.6rem] text-gold-soft">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((l) => {
                  const open = l.stage !== "won" && l.stage !== "lost";
                  const overdue = open && l.followUpAt ? new Date(l.followUpAt) < new Date() : false;
                  return (
                  <Link key={l.id} href={`/admin/leads/${l.id}`} className={`block rounded-xl border bg-ink-deep/40 p-3 transition-colors hover:border-gold/50 ${overdue ? "border-[#e0633b]/60" : "border-line"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-serif text-on-deep">{l.name}</p>
                      {l.score > 0 && <span className="mono shrink-0 rounded bg-gold/10 px-1.5 text-[0.55rem] text-gold-soft">{l.score}</span>}
                    </div>
                    {l.value ? <p className="mono text-[0.62rem] text-gold-soft">{formatINR(l.value)}</p> : null}
                    <p className="mono mt-1 text-[0.58rem] text-on-deep/35">
                      {l.ownerId ? nameOf(l.ownerId) : "Unassigned"}
                      {l.followUpAt ? ` · ${overdue ? "⚠" : "⏰"} ${new Date(l.followUpAt).toLocaleDateString("en-IN")}` : ""}
                    </p>
                  </Link>
                  );
                })}
                {items.length === 0 && <p className="text-[0.7rem] text-on-deep/25">—</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
