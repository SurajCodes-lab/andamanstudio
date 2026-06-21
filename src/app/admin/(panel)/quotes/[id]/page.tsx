import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db/client";
import { guardPage, can } from "@/lib/permissions";
import { getSite } from "@/lib/db/queries";
import { formatINR } from "@/data/catalog";
import { Card, Field, PageHeader, SaveButton, fieldCls } from "../../ui";
import {
  addQuoteItem, deleteQuoteItem, applyQuoteCoupon, setQuoteStatus, updateQuoteMeta, acceptQuote, deleteQuote,
  ensureQuoteToken, markQuotePaid,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function QuoteBuilder({ params }: { params: Promise<{ id: string }> }) {
  const sp = await guardPage("quotes");
  const manage = can(sp, "quotes", "manage");
  const { id } = await params;
  const q = await db.query.quotes.findFirst({
    where: (t, { eq }) => eq(t.id, Number(id)),
    with: { items: { orderBy: (t, { asc }) => asc(t.id) } },
  });
  if (!q) notFound();

  const cats = await db.query.categories.findMany({ with: { products: true }, orderBy: (t, { asc }) => asc(t.order) });
  const products = cats.flatMap((c) => c.products.map((p) => ({ ...p, cat: c.title })));
  const site = await getSite();
  const shareUrl = q.token ? `${(site.url || "").replace(/\/$/, "")}/q/${q.token}` : null;

  return (
    <div>
      <PageHeader
        title={`Quote #${q.id}`}
        subtitle={`${q.clientName} · ${q.status}${q.bookingId ? ` · booking #${q.bookingId}` : ""}`}
        action={<Link href="/admin/quotes" className="text-xs text-on-deep/40 hover:text-gold">← All quotes</Link>}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Line items */}
          <Card>
            <h3 className="mb-3 font-serif text-lg text-gold-soft">Line items</h3>
            <div className="space-y-2">
              {q.items.map((it) => (
                <div key={it.id} className="flex items-center gap-3 rounded-lg border border-line bg-ink-deep/40 px-3 py-2 text-sm">
                  <span className="flex-1 text-on-deep/85">{it.name}</span>
                  <span className="mono text-on-deep/50">{it.qty} × {formatINR(it.unitPrice)}</span>
                  <span className="mono w-24 text-right text-on-deep/85">{formatINR(it.qty * it.unitPrice)}</span>
                  {manage && (
                    <form action={deleteQuoteItem}>
                      <input type="hidden" name="id" value={it.id} />
                      <input type="hidden" name="quoteId" value={q.id} />
                      <button className="text-on-deep/30 hover:text-[#e0633b]">✕</button>
                    </form>
                  )}
                </div>
              ))}
              {q.items.length === 0 && <p className="text-sm text-on-deep/40">No items yet — add from a package or a custom line below.</p>}
            </div>

            {manage && (
              <form action={addQuoteItem} className="mt-4 grid items-end gap-2 sm:grid-cols-[2fr_auto_auto_auto]">
                <input type="hidden" name="quoteId" value={q.id} />
                <Field label="Item"><input name="name" list="pkg-list" required placeholder="Package or custom…" className={fieldCls} /></Field>
                <Field label="Qty"><input name="qty" type="number" defaultValue={1} min={1} className={`${fieldCls} w-20`} /></Field>
                <Field label="Unit ₹"><input name="unitPrice" type="number" required className={`${fieldCls} w-28`} /></Field>
                <SaveButton>+ Add</SaveButton>
                <datalist id="pkg-list">
                  {products.map((p) => <option key={p.id} value={p.name}>{p.cat} · {formatINR(p.price)}</option>)}
                </datalist>
              </form>
            )}
            <p className="mt-2 text-[0.7rem] text-on-deep/35">Tip: pick a package name to autofill, then type its price in Unit ₹.</p>
          </Card>

          {/* Quote meta */}
          {manage && (
            <Card>
              <h3 className="mb-3 font-serif text-lg text-gold-soft">Client & validity</h3>
              <form action={updateQuoteMeta} className="space-y-3">
                <input type="hidden" name="quoteId" value={q.id} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Client name"><input name="clientName" defaultValue={q.clientName} className={fieldCls} /></Field>
                  <Field label="Phone"><input name="phone" defaultValue={q.phone ?? ""} className={fieldCls} /></Field>
                  <Field label="Email"><input name="email" defaultValue={q.email ?? ""} className={fieldCls} /></Field>
                  <Field label="Valid until"><input name="validUntil" type="date" defaultValue={q.validUntil ?? ""} className={fieldCls} /></Field>
                </div>
                <Field label="Notes"><textarea name="notes" defaultValue={q.notes ?? ""} rows={2} className={`${fieldCls} resize-y`} /></Field>
                <SaveButton />
              </form>
            </Card>
          )}
        </div>

        {/* Summary / coupon / accept */}
        <div className="space-y-6">
          <Card>
            <h3 className="mb-3 font-serif text-lg text-gold-soft">Summary</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-on-deep/55">Subtotal</span><span className="mono">{formatINR(q.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-on-deep/55">Discount{q.couponCode ? ` (${q.couponCode})` : ""}</span><span className="mono text-[#f08a66]">− {formatINR(q.discount)}</span></div>
              <div className="mt-2 flex justify-between border-t border-line pt-2 text-base"><span className="text-on-deep">Total</span><span className="mono text-gold">{formatINR(q.total)}</span></div>
            </div>

            {manage && (
              <form action={applyQuoteCoupon} className="mt-4 flex items-end gap-2">
                <input type="hidden" name="quoteId" value={q.id} />
                <Field label="Coupon code"><input name="couponCode" defaultValue={q.couponCode ?? ""} placeholder="MONSOON20" className={`${fieldCls} uppercase`} /></Field>
                <SaveButton>Apply</SaveButton>
              </form>
            )}
          </Card>

          {manage && (
            <Card>
              <h3 className="mb-3 font-serif text-lg text-gold-soft">Status</h3>
              <form action={setQuoteStatus} className="flex items-end gap-2">
                <input type="hidden" name="quoteId" value={q.id} />
                <Field label="Set status">
                  <select name="status" defaultValue={q.status} className={fieldCls}>
                    {["draft", "sent", "accepted", "declined", "expired"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <SaveButton>Update</SaveButton>
              </form>

              {q.bookingId ? (
                <Link href={`/admin/bookings/${q.bookingId}`} className="mt-4 block rounded-full bg-gold px-5 py-2.5 text-center text-xs font-bold uppercase tracking-[0.08em] text-ink-deep hover:bg-gold-soft">
                  View booking #{q.bookingId} →
                </Link>
              ) : (
                <form action={acceptQuote} className="mt-4">
                  <input type="hidden" name="quoteId" value={q.id} />
                  <button disabled={q.items.length === 0} className="w-full rounded-full bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-deep transition-colors hover:bg-gold-soft disabled:opacity-40">
                    ✓ Accept → create booking
                  </button>
                </form>
              )}
              <form action={deleteQuote} className="mt-3 text-center">
                <input type="hidden" name="id" value={q.id} />
                <button className="text-xs uppercase tracking-[0.12em] text-on-deep/35 hover:text-[#e0633b]">Delete quote</button>
              </form>
            </Card>
          )}

          {manage && (
            <Card>
              <h3 className="mb-3 font-serif text-lg text-gold-soft">Share & payment</h3>
              <p className="mb-3 text-xs text-on-deep/45">
                Send this link on WhatsApp — the client sees the quote and can pay.
                Payment status: <span className="text-gold-soft">{q.paymentStatus}</span>.
              </p>
              {shareUrl ? (
                <div className="space-y-2">
                  <input readOnly value={shareUrl} className={`${fieldCls} text-xs`} />
                  <div className="flex gap-2">
                    <a href={`/q/${q.token}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-4 py-1.5 text-xs uppercase tracking-[0.1em] text-on-deep/70 hover:border-gold hover:text-gold">Open ↗</a>
                    <a href={`https://wa.me/?text=${encodeURIComponent(`Your quote from Andaman Studio: ${shareUrl}`)}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-4 py-1.5 text-xs uppercase tracking-[0.1em] text-[#25D366] hover:border-[#25D366]">Send on WhatsApp</a>
                  </div>
                </div>
              ) : (
                <form action={ensureQuoteToken}>
                  <input type="hidden" name="quoteId" value={q.id} />
                  <SaveButton>Generate share link</SaveButton>
                </form>
              )}
              {q.paymentStatus !== "paid" && (
                <form action={markQuotePaid} className="mt-4 border-t border-line pt-4">
                  <input type="hidden" name="quoteId" value={q.id} />
                  <button className="text-xs uppercase tracking-[0.1em] text-gold hover:text-gold-soft">✓ Mark as paid (offline)</button>
                </form>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
