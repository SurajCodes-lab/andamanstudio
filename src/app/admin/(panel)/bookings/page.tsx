import Link from "next/link";
import { db } from "@/lib/db/client";
import { guardPage, can } from "@/lib/permissions";
import { formatINR } from "@/data/catalog";
import { addBooking } from "./actions";
import { Card, Field, PageHeader, SaveButton, fieldCls } from "../ui";

export const dynamic = "force-dynamic";

const STATUSES = ["enquiry", "confirmed", "completed", "cancelled"] as const;
const payBadge: Record<string, string> = {
  paid: "bg-[#5aa85f]/20 text-[#7cc781]",
  partial: "bg-gold/20 text-gold",
  unpaid: "bg-[#e0633b]/20 text-[#e88b6c]",
};

const PER_PAGE = 20;

export default async function AdminBookings({ searchParams }: { searchParams: Promise<{ owner?: string; q?: string; page?: string }> }) {
  const sp = await guardPage("bookings");
  const manage = can(sp, "bookings", "manage");
  const { owner, q, page: pageParam } = await searchParams;
  const needle = (q ?? "").trim().toLowerCase();
  const page = Math.max(1, Number(pageParam) || 1);

  const rows = await db.query.bookings.findMany({ orderBy: (t, { desc }) => desc(t.id) });
  const users = await db.query.users.findMany();
  const nameOf = (id: number | null) => users.find((u) => u.id === id)?.name ?? users.find((u) => u.id === id)?.email ?? "Unassigned";
  const filtered = rows.filter(
    (b) =>
      (owner === "mine" ? b.ownerId === sp.userId : owner === "pool" ? !b.ownerId : true) &&
      (!needle || [b.clientName, b.phone, b.email, b.shoot].some((v) => (v ?? "").toLowerCase().includes(needle)))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const items = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalBilled = rows.reduce((n, b) => n + b.amount, 0);
  const totalPaid = rows.reduce((n, b) => n + b.amountPaid, 0);

  const qs = (extra: Record<string, string>) => {
    const p = new URLSearchParams();
    if (owner) p.set("owner", owner);
    if (q) p.set("q", q);
    if (page > 1) p.set("page", String(page));
    for (const [k, v] of Object.entries(extra)) v ? p.set(k, v) : p.delete(k);
    const s = p.toString();
    return s ? `/admin/bookings?${s}` : "/admin/bookings";
  };
  const tab = (key: string, label: string) => (
    <Link href={qs({ owner: key })} className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.1em] ${(owner ?? "") === key ? "border-gold bg-gold text-ink-deep" : "border-line text-on-deep/65 hover:border-gold/50 hover:text-gold"}`}>{label}</Link>
  );

  return (
    <div>
      <PageHeader
        title="Bookings & payments"
        subtitle="Shoots, payments and delivery — click a booking to manage it."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <form method="get" className="flex items-center gap-1.5">
              {owner ? <input type="hidden" name="owner" value={owner} /> : null}
              <input name="q" defaultValue={q ?? ""} placeholder="Search client / phone…" className="w-44 rounded-full border border-line bg-surface/40 px-4 py-1.5 text-xs text-on-deep placeholder:text-on-deep/35 outline-none focus:border-gold" />
              {q ? <Link href={qs({ q: "" })} className="text-xs text-on-deep/40 hover:text-gold">clear</Link> : null}
            </form>
            {tab("", "All")}{tab("mine", "Mine")}{tab("pool", "Unassigned")}
          </div>
        }
      />

      <div className="mb-7 grid grid-cols-3 gap-3">
        {[
          { label: "Total billed", value: formatINR(totalBilled) },
          { label: "Collected", value: formatINR(totalPaid) },
          { label: "Outstanding", value: formatINR(totalBilled - totalPaid) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface/30 p-5">
            <p className="font-serif text-2xl text-gold-soft sm:text-3xl">{s.value}</p>
            <p className="meta mt-1 text-on-deep/55">{s.label}</p>
          </div>
        ))}
      </div>

      {manage && (
        <Card className="mb-7">
          <h3 className="mb-3 font-serif text-lg text-gold-soft">Add a booking</h3>
          <form action={addBooking} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Client name"><input name="clientName" required className={fieldCls} /></Field>
              <Field label="Phone"><input name="phone" className={fieldCls} /></Field>
              <Field label="Email"><input name="email" className={fieldCls} /></Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <Field label="Shoot / package"><input name="shoot" className={fieldCls} /></Field>
              <Field label="Shoot date"><input name="shootOn" type="date" className={fieldCls} /></Field>
              <Field label="Amount ₹"><input name="amount" type="number" defaultValue={0} className={fieldCls} /></Field>
              <Field label="Status"><select name="status" defaultValue="confirmed" className={`${fieldCls} capitalize`}>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>
            </div>
            <SaveButton>Add booking</SaveButton>
          </form>
        </Card>
      )}

      <div className="space-y-2">
        {filtered.length === 0 && <p className="text-sm text-on-deep/45">{q ? "No bookings match your search." : "No bookings yet."}</p>}
        {items.map((b) => (
          <Link key={b.id} href={`/admin/bookings/${b.id}`} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface/30 p-4 transition-colors hover:border-gold/50">
            <span className="font-serif text-on-deep">{b.clientName}</span>
            {b.shoot && <span className="text-sm text-on-deep/55">{b.shoot}</span>}
            {b.shootDate && <span className="mono text-[0.6rem] text-on-deep/40">📅 {b.shootDate}</span>}
            <span className={`rounded-full px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] ${payBadge[b.paymentStatus]}`}>{b.paymentStatus}</span>
            <span className="mono text-[0.6rem] text-on-deep/35 capitalize">{b.deliveryStatus}</span>
            <span className="mono ml-auto text-xs text-on-deep/55">{formatINR(b.amountPaid)} / {formatINR(b.amount)} · {nameOf(b.ownerId)}</span>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-5 text-xs">
          {page > 1 ? <Link href={qs({ page: String(page - 1) })} className="rounded-full border border-line px-4 py-1.5 uppercase tracking-[0.1em] text-on-deep/70 hover:border-gold hover:text-gold">← Prev</Link> : <span className="rounded-full border border-line px-4 py-1.5 uppercase tracking-[0.1em] text-on-deep/20">← Prev</span>}
          <span className="text-on-deep/50">Page {page} of {totalPages}</span>
          {page < totalPages ? <Link href={qs({ page: String(page + 1) })} className="rounded-full border border-line px-4 py-1.5 uppercase tracking-[0.1em] text-on-deep/70 hover:border-gold hover:text-gold">Next →</Link> : <span className="rounded-full border border-line px-4 py-1.5 uppercase tracking-[0.1em] text-on-deep/20">Next →</span>}
        </div>
      )}
    </div>
  );
}
