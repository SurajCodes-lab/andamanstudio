import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { bookings, payments } from "@/lib/db/schema";
import { guardPage } from "@/lib/permissions";
import { getSite } from "@/lib/db/queries";
import { formatINR } from "@/data/catalog";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

// Colours via border + text (not background) so the stamp prints even when the
// browser's "Background graphics" option is off.
const STAMP: Record<string, { label: string; fg: string }> = {
  paid: { label: "PAID IN FULL", fg: "#1b7a3d" },
  partial: { label: "PART-PAID", fg: "#9a6a00" },
  unpaid: { label: "BALANCE DUE", fg: "#c0392b" },
};

export default async function Receipt({ params }: { params: Promise<{ id: string }> }) {
  await guardPage("bookings");
  const id = Number((await params).id);
  const b = await db.query.bookings.findFirst({ where: eq(bookings.id, id) });
  if (!b) notFound();
  const pays = await db.query.payments.findMany({ where: eq(payments.bookingId, id), orderBy: (t, { asc }) => asc(t.id) });
  const site = await getSite();
  const balance = b.amount - b.amountPaid;
  const issued = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const stamp = STAMP[b.paymentStatus] ?? STAMP.unpaid;
  const no = `AS-${String(b.id).padStart(5, "0")}`;

  return (
    <div
      className="receipt-page mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white text-[#1a1a1a] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.4)] print:rounded-none print:shadow-none"
      style={{ borderTop: "6px solid #d8a82f" }}
    >
      <div className="p-10 print:p-[16mm]">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="font-serif text-3xl leading-none text-[#14110b]">{site.name}</h1>
            {site.tagline && <p className="mt-1 text-[0.62rem] uppercase tracking-[0.22em] text-[#b8860b]">{site.tagline}</p>}
            <p className="mt-3 text-xs leading-relaxed text-neutral-500">
              {site.address.line1}{site.address.line2 ? `, ${site.address.line2}` : ""}{site.address.line3 ? `, ${site.address.line3}` : ""}
            </p>
            <p className="text-xs text-neutral-500">{site.phones.join(" · ")}</p>
            <p className="text-xs text-neutral-500">{site.email}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-serif text-2xl tracking-tight text-[#d8a82f]">Receipt</p>
            <p className="mt-1 text-xs text-neutral-500">No. <span className="font-medium text-neutral-700">{no}</span></p>
            <p className="text-xs text-neutral-500">Date: {issued}</p>
            <span className="mt-3 inline-block rounded-full border px-3 py-1 text-[0.62rem] font-bold tracking-[0.12em]" style={{ borderColor: stamp.fg, color: stamp.fg }}>
              {stamp.label}
            </span>
          </div>
        </div>

        {/* Billed-to + shoot meta */}
        <div className="mt-8 grid grid-cols-2 gap-6 rounded-xl border border-neutral-200 p-5">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.18em] text-neutral-400">Billed to</p>
            <p className="mt-1 font-medium text-neutral-800">{b.clientName}</p>
            {b.phone && <p className="text-sm text-neutral-600">{b.phone}</p>}
            {b.email && <p className="text-sm text-neutral-600">{b.email}</p>}
          </div>
          <div className="text-right">
            <p className="text-[0.6rem] uppercase tracking-[0.18em] text-neutral-400">Shoot</p>
            <p className="mt-1 font-medium text-neutral-800">{b.shoot ?? "Photography session"}</p>
            {(b.shootOn || b.shootDate) && <p className="text-sm text-neutral-600">{b.shootOn ?? b.shootDate}</p>}
            <p className="text-sm capitalize text-neutral-500">{b.status} · {b.deliveryStatus}</p>
          </div>
        </div>

        {/* Line items */}
        <table className="mt-7 w-full text-sm">
          <thead>
            <tr className="border-b-2 border-neutral-800 text-left text-[0.62rem] uppercase tracking-[0.12em] text-neutral-500">
              <th className="pb-2 font-semibold">Description</th>
              <th className="pb-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-100">
              <td className="py-3 text-neutral-700">{b.shoot ?? "Photography session"}{b.shootOn ? ` — ${b.shootOn}` : ""}</td>
              <td className="py-3 text-right text-neutral-800">{formatINR(b.amount)}</td>
            </tr>
            {b.discount > 0 && (
              <tr className="border-b border-neutral-100">
                <td className="py-3 text-neutral-700">Discount{b.couponCode ? ` (${b.couponCode})` : ""}</td>
                <td className="py-3 text-right text-[#c0392b]">− {formatINR(b.discount)}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-5 flex justify-end">
          <div className="w-64 space-y-1.5 text-sm">
            <div className="flex justify-between text-neutral-500"><span>Subtotal</span><span>{formatINR(b.amount + b.discount)}</span></div>
            {b.discount > 0 && <div className="flex justify-between text-neutral-500"><span>Discount</span><span>− {formatINR(b.discount)}</span></div>}
            <div className="flex justify-between border-t border-neutral-200 pt-1.5 font-medium text-neutral-800"><span>Total</span><span>{formatINR(b.amount)}</span></div>
            <div className="flex justify-between text-neutral-600"><span>Paid</span><span>{formatINR(b.amountPaid)}</span></div>
            <div className="mt-1 flex justify-between rounded-md border-2 border-[#14110b] px-3 py-2 font-bold text-[#14110b]"><span>Balance due</span><span>{formatINR(balance)}</span></div>
          </div>
        </div>

        {/* Payments received */}
        {pays.length > 0 && (
          <div className="mt-7">
            <p className="mb-2 text-[0.6rem] uppercase tracking-[0.18em] text-neutral-400">Payments received</p>
            <div className="overflow-hidden rounded-lg border border-neutral-200">
              {pays.map((p) => (
                <div key={p.id} className="flex justify-between border-b border-neutral-100 px-3 py-2 text-sm last:border-0">
                  <span className="text-neutral-600">{p.paidAt ?? "—"} · <span className="capitalize">{p.method}</span>{p.note ? ` · ${p.note}` : ""}</span>
                  <span className="text-neutral-800">{formatINR(p.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-9 border-t border-neutral-200 pt-5">
          <p className="font-serif text-lg text-[#14110b]">Thank you for choosing {site.name}.</p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500">
            Payments are non-refundable once the shoot is confirmed. For any queries about this receipt, reach us on WhatsApp at {site.phones?.[0] ?? site.whatsapp}.
            This is a computer-generated receipt and does not require a signature.
          </p>
          <div className="mt-5 print:hidden">
            <PrintButton />
            <p className="mt-2 text-[0.65rem] text-neutral-400">Tip: in the print dialog, set <b>More settings → Headers and footers → Off</b> for a clean PDF (no date/URL).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
