import Link from "next/link";
import { db } from "@/lib/db/client";
import { guardPage, can } from "@/lib/permissions";
import { formatINR } from "@/data/catalog";
import { createQuote } from "./actions";
import { Card, Field, PageHeader, SaveButton, fieldCls } from "../ui";

export const dynamic = "force-dynamic";

const BADGE: Record<string, string> = {
  draft: "bg-on-deep/10 text-on-deep/55",
  sent: "bg-[#5b8def]/15 text-[#8ab0ff]",
  accepted: "bg-gold/15 text-gold",
  declined: "bg-[#e0633b]/15 text-[#f08a66]",
  expired: "bg-on-deep/10 text-on-deep/40",
};

const PER_PAGE = 20;

export default async function QuotesPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await guardPage("quotes");
  const manage = can(sp, "quotes", "manage");
  const { q, page: pageParam } = await searchParams;
  const needle = (q ?? "").trim().toLowerCase();
  const page = Math.max(1, Number(pageParam) || 1);
  const rows = await db.query.quotes.findMany({ orderBy: (t, { desc }) => desc(t.id) });
  const leads = await db.query.enquiries.findMany({ orderBy: (t, { desc }) => desc(t.id), limit: 100 });

  const filtered = rows.filter((r) => !needle || [r.clientName, r.phone, r.email].some((v) => (v ?? "").toLowerCase().includes(needle)));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const list = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const qs = (n: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (n > 1) p.set("page", String(n));
    const s = p.toString();
    return s ? `/admin/quotes?${s}` : "/admin/quotes";
  };
  const outstanding = rows.filter((qt) => qt.status === "sent").reduce((s, qt) => s + qt.total, 0);
  const won = rows.filter((qt) => qt.status === "accepted").reduce((s, qt) => s + qt.total, 0);

  return (
    <div>
      <PageHeader
        title="Quotes & proposals"
        subtitle="Build a quote from your packages, apply a coupon, send it, and convert it to a booking on acceptance."
        action={
          <div className="flex flex-wrap items-center gap-5">
            <form method="get" className="flex items-center gap-1.5">
              <input name="q" defaultValue={q ?? ""} placeholder="Search client / phone…" className="w-44 rounded-full border border-line bg-surface/40 px-4 py-1.5 text-xs text-on-deep placeholder:text-on-deep/35 outline-none focus:border-gold" />
              {q ? <Link href="/admin/quotes" className="text-xs text-on-deep/40 hover:text-gold">clear</Link> : null}
            </form>
            <div className="text-right"><p className="font-serif text-2xl text-[#8ab0ff]">{formatINR(outstanding)}</p><p className="meta text-on-deep/45">Sent / open</p></div>
            <div className="text-right"><p className="font-serif text-2xl text-gold">{formatINR(won)}</p><p className="meta text-on-deep/45">Accepted</p></div>
          </div>
        }
      />

      {manage && (
        <Card className="mb-7">
          <h3 className="mb-3 font-serif text-lg text-gold-soft">New quote</h3>
          <form action={createQuote} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-4">
              <Field label="Client name"><input name="clientName" required className={fieldCls} /></Field>
              <Field label="Phone"><input name="phone" className={fieldCls} /></Field>
              <Field label="Email"><input name="email" className={fieldCls} /></Field>
              <Field label="Valid until"><input name="validUntil" type="date" className={fieldCls} /></Field>
            </div>
            <Field label="Link to lead" hint="optional">
              <select name="leadId" className={fieldCls}>
                <option value="">— none —</option>
                {leads.map((l) => <option key={l.id} value={l.id}>#{l.id} · {l.name}</option>)}
              </select>
            </Field>
            <SaveButton>Create & add items</SaveButton>
          </form>
        </Card>
      )}

      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface/40 text-left text-on-deep/45">
            <tr className="[&>th]:px-4 [&>th]:py-2.5 [&>th]:font-normal [&>th]:meta">
              <th>#</th><th>Client</th><th>Status</th><th className="text-right">Total</th><th>Valid</th>
            </tr>
          </thead>
          <tbody>
            {list.map((q) => (
              <tr key={q.id} className="cursor-pointer border-t border-line hover:bg-surface/20">
                <td className="px-4 py-3"><Link href={`/admin/quotes/${q.id}`} className="text-gold hover:underline">#{q.id}</Link></td>
                <td className="px-4 py-3 text-on-deep/85"><Link href={`/admin/quotes/${q.id}`} className="block hover:text-gold">{q.clientName}</Link></td>
                <td className="px-4 py-3"><Link href={`/admin/quotes/${q.id}`} className="block"><span className={`rounded-full px-2.5 py-0.5 text-[0.62rem] uppercase tracking-[0.1em] ${BADGE[q.status]}`}>{q.status}</span></Link></td>
                <td className="px-4 py-3 text-right font-mono text-on-deep/85"><Link href={`/admin/quotes/${q.id}`} className="block">{formatINR(q.total)}</Link></td>
                <td className="px-4 py-3 text-on-deep/45"><Link href={`/admin/quotes/${q.id}`} className="block">{q.validUntil ?? "—"}</Link></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-on-deep/40">{q ? "No quotes match your search." : "No quotes yet."}</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-5 text-xs">
          {page > 1 ? <Link href={qs(page - 1)} className="rounded-full border border-line px-4 py-1.5 uppercase tracking-[0.1em] text-on-deep/70 hover:border-gold hover:text-gold">← Prev</Link> : <span className="rounded-full border border-line px-4 py-1.5 uppercase tracking-[0.1em] text-on-deep/20">← Prev</span>}
          <span className="text-on-deep/50">Page {page} of {totalPages}</span>
          {page < totalPages ? <Link href={qs(page + 1)} className="rounded-full border border-line px-4 py-1.5 uppercase tracking-[0.1em] text-on-deep/70 hover:border-gold hover:text-gold">Next →</Link> : <span className="rounded-full border border-line px-4 py-1.5 uppercase tracking-[0.1em] text-on-deep/20">Next →</span>}
        </div>
      )}
    </div>
  );
}
