import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db/client";
import { getSite } from "@/lib/db/queries";
import { formatINR } from "@/data/catalog";
import { acceptQuotePublic, startPaymentPublic } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your quote", robots: { index: false } };

const STATUS: Record<string, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-black/5 text-ink-soft" },
  sent: { label: "Awaiting your response", cls: "bg-[#5b8def]/15 text-[#3d6fd0]" },
  accepted: { label: "Accepted", cls: "bg-gold/20 text-[#9a7b1f]" },
  declined: { label: "Declined", cls: "bg-[#e0633b]/15 text-[#c44f29]" },
  expired: { label: "Expired", cls: "bg-black/5 text-ink-mute" },
};

export default async function PublicQuote({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const q = await db.query.quotes.findFirst({
    where: (t, { eq }) => eq(t.token, token),
    with: { items: { orderBy: (t, { asc }) => asc(t.id) } },
  });
  if (!q) notFound();
  const site = await getSite();
  const st = STATUS[q.status] ?? STATUS.sent;
  const paid = q.paymentStatus === "paid";
  const expired = q.validUntil ? q.validUntil < new Date().toISOString().slice(0, 10) : false;

  return (
    <div className="ctx-light min-h-screen bg-sand px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-serif text-2xl text-ink">{site.name}</span>
          <span className={`rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.12em] ${st.cls}`}>{paid ? "Paid" : st.label}</span>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_30px_80px_-50px_rgba(22,32,30,0.35)] sm:p-9">
          <p className="eyebrow text-gold">Quote #{q.id}</p>
          <h1 className="font-serif mt-1 text-3xl text-ink">For {q.clientName}</h1>
          {q.validUntil && <p className="mt-1 text-sm text-ink-soft">Valid until {new Date(q.validUntil + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>}

          <table className="mt-7 w-full text-sm">
            <thead><tr className="border-b border-line text-left text-ink-mute"><th className="py-2 font-normal">Item</th><th className="py-2 text-center font-normal">Qty</th><th className="py-2 text-right font-normal">Amount</th></tr></thead>
            <tbody>
              {q.items.map((it) => (
                <tr key={it.id} className="border-b border-line/60">
                  <td className="py-2.5 text-ink">{it.name}</td>
                  <td className="py-2.5 text-center text-ink-soft">{it.qty}</td>
                  <td className="py-2.5 text-right text-ink">{formatINR(it.qty * it.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5 space-y-1.5 text-sm">
            <div className="flex justify-between text-ink-soft"><span>Subtotal</span><span>{formatINR(q.subtotal)}</span></div>
            {q.discount > 0 && <div className="flex justify-between text-ink-soft"><span>Discount{q.couponCode ? ` (${q.couponCode})` : ""}</span><span>− {formatINR(q.discount)}</span></div>}
            <div className="flex justify-between border-t border-line pt-2 text-lg text-ink"><span className="font-serif">Total</span><span className="font-serif text-gold">{formatINR(q.total)}</span></div>
          </div>

          {q.notes && <p className="mt-5 rounded-lg bg-black/[0.03] p-3 text-sm text-ink-soft">{q.notes}</p>}

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {!paid && !expired && q.status !== "declined" && (
              <>
                {q.status !== "accepted" && (
                  <form action={acceptQuotePublic} className="flex-1">
                    <input type="hidden" name="token" value={token} />
                    <button className="w-full rounded-full border border-ink/20 px-6 py-3.5 text-sm uppercase tracking-[0.14em] text-ink transition-colors hover:border-gold hover:text-gold">Accept quote</button>
                  </form>
                )}
                <form action={startPaymentPublic} className="flex-1">
                  <input type="hidden" name="token" value={token} />
                  <button className="w-full rounded-full bg-gold px-6 py-3.5 text-sm uppercase tracking-[0.14em] text-ink-deep transition-colors hover:bg-gold-soft">Pay {formatINR(q.total)} →</button>
                </form>
              </>
            )}
            {paid && <p className="flex-1 rounded-full bg-gold/15 px-6 py-3.5 text-center text-sm uppercase tracking-[0.14em] text-[#9a7b1f]">✓ Payment received — thank you!</p>}
            {expired && !paid && <p className="flex-1 rounded-full bg-black/5 px-6 py-3.5 text-center text-sm uppercase tracking-[0.14em] text-ink-mute">This quote has expired — please contact us.</p>}
          </div>
          <p className="mt-4 text-center text-xs text-ink-mute">Questions? WhatsApp us at {site.phones?.[0] ?? site.whatsapp}.</p>
        </div>
      </div>
    </div>
  );
}
