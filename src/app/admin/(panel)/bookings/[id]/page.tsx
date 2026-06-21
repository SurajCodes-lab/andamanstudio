import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { bookings, payments } from "@/lib/db/schema";
import { guardPage, can } from "@/lib/permissions";
import { formatINR } from "@/data/catalog";
import ActivityTimeline from "@/components/admin/ActivityTimeline";
import { updateBooking, deleteBooking, addPayment, deletePayment, updateDeliverables, assignBooking, claimBooking } from "../actions";
import { Card, Field, PageHeader, SaveButton, fieldCls } from "../../ui";

export const dynamic = "force-dynamic";

const STATUSES = ["enquiry", "confirmed", "completed", "cancelled"] as const;
const DELIVERY = ["pending", "shot", "editing", "delivered"] as const;
const METHODS = ["cash", "upi", "bank", "card", "other"] as const;

export default async function BookingDetail({ params }: { params: Promise<{ id: string }> }) {
  const sp = await guardPage("bookings");
  const manage = can(sp, "bookings", "manage");
  const id = Number((await params).id);
  const b = await db.query.bookings.findFirst({ where: eq(bookings.id, id) });
  if (!b) notFound();

  const pays = await db.query.payments.findMany({ where: eq(payments.bookingId, id), orderBy: (t, { desc }) => desc(t.id) });
  const acts = await db.query.activities.findMany({
    where: (t, { and, eq: e }) => and(e(t.entityType, "booking"), e(t.entityId, id)),
    orderBy: (t, { desc }) => desc(t.id),
  });
  const users = await db.query.users.findMany();
  const ownerName = users.find((u) => u.id === b.ownerId)?.name ?? (b.ownerId ? `#${b.ownerId}` : "Unassigned");
  const balance = b.amount - b.amountPaid;

  return (
    <div>
      <PageHeader
        title={b.clientName}
        subtitle={`Booking #${b.id} · ${b.status} · ${b.paymentStatus} · ${b.deliveryStatus}`}
        action={
          <div className="flex items-center gap-4">
            <Link href={`/admin/bookings/${b.id}/receipt`} target="_blank" className="text-xs text-gold hover:text-gold-soft">Receipt ↗</Link>
            <Link href="/admin/bookings" className="text-xs text-on-deep/40 hover:text-gold">← All</Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          {/* Payments */}
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg text-gold-soft">Payments</h3>
              <span className="mono text-xs text-on-deep/55">{formatINR(b.amountPaid)} / {formatINR(b.amount)} · balance {formatINR(balance)}</span>
            </div>
            <div className="space-y-2">
              {pays.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2 text-sm">
                  <span className="font-serif text-on-deep">{formatINR(p.amount)}</span>
                  <span className="mono text-[0.6rem] uppercase text-on-deep/45">{p.method}</span>
                  {p.paidAt && <span className="mono text-[0.6rem] text-on-deep/35">{p.paidAt}</span>}
                  {p.note && <span className="text-xs text-on-deep/50">{p.note}</span>}
                  {manage && <form action={deletePayment} className="ml-auto"><input type="hidden" name="id" value={p.id} /><button className="text-xs text-on-deep/30 hover:text-[#e0633b]">✕</button></form>}
                </div>
              ))}
              {pays.length === 0 && <p className="text-sm text-on-deep/40">No payments recorded.</p>}
            </div>
            {manage && (
              <form action={addPayment} className="mt-4 space-y-3">
                <input type="hidden" name="bookingId" value={b.id} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Amount ₹"><input name="amount" type="number" required className={fieldCls} /></Field>
                  <Field label="Method"><select name="method" className={`${fieldCls} capitalize`}>{METHODS.map((m) => <option key={m} value={m}>{m}</option>)}</select></Field>
                  <Field label="Date"><input name="paidAt" type="date" className={fieldCls} /></Field>
                </div>
                <Field label="Note"><input name="note" className={fieldCls} /></Field>
                <SaveButton>Add payment</SaveButton>
              </form>
            )}
          </Card>

          {/* Activity */}
          <Card>
            <h3 className="mb-3 font-serif text-lg text-gold-soft">Activity</h3>
            <ActivityTimeline items={acts} />
          </Card>
        </div>

        <div className="space-y-4">
          {manage ? (
            <>
              <Card>
                <h3 className="mb-3 font-serif text-lg text-gold-soft">Details</h3>
                <form action={updateBooking} className="space-y-3">
                  <input type="hidden" name="id" value={b.id} />
                  <Field label="Client name"><input name="clientName" defaultValue={b.clientName} className={fieldCls} /></Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Phone"><input name="phone" defaultValue={b.phone ?? ""} className={fieldCls} /></Field>
                    <Field label="Email"><input name="email" defaultValue={b.email ?? ""} className={fieldCls} /></Field>
                  </div>
                  <Field label="Shoot / package"><input name="shoot" defaultValue={b.shoot ?? ""} className={fieldCls} /></Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Shoot date"><input name="shootOn" type="date" defaultValue={b.shootOn ?? ""} className={fieldCls} /></Field>
                    <Field label="Amount ₹"><input name="amount" type="number" defaultValue={b.amount} className={fieldCls} /></Field>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Status"><select name="status" defaultValue={b.status} className={`${fieldCls} capitalize`}>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>
                    <Field label="Owner"><select name="ownerId" defaultValue={b.ownerId ?? ""} className={fieldCls}><option value="">— Pool —</option>{users.map((u) => <option key={u.id} value={u.id}>{u.name ?? u.email}</option>)}</select></Field>
                  </div>
                  <Field label="Notes"><input name="notes" defaultValue={b.notes ?? ""} className={fieldCls} /></Field>
                  <SaveButton />
                </form>
                <form action={claimBooking} className="mt-2"><input type="hidden" name="id" value={b.id} /><button className="text-xs uppercase tracking-[0.1em] text-gold hover:text-gold-soft">Claim ({ownerName}) →</button></form>
              </Card>

              <Card>
                <h3 className="mb-3 font-serif text-lg text-gold-soft">Deliverables</h3>
                <form action={updateDeliverables} className="space-y-3">
                  <input type="hidden" name="id" value={b.id} />
                  <Field label="Status"><select name="deliveryStatus" defaultValue={b.deliveryStatus} className={`${fieldCls} capitalize`}>{DELIVERY.map((d) => <option key={d} value={d}>{d}</option>)}</select></Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="RAW count"><input name="rawCount" type="number" defaultValue={b.rawCount ?? ""} className={fieldCls} /></Field>
                    <Field label="Edited count"><input name="editedCount" type="number" defaultValue={b.editedCount ?? ""} className={fieldCls} /></Field>
                  </div>
                  <Field label="Delivered on"><input name="deliveredAt" type="date" defaultValue={b.deliveredAt ?? ""} className={fieldCls} /></Field>
                  <SaveButton />
                </form>
              </Card>

              <form action={deleteBooking}><input type="hidden" name="id" value={b.id} /><button className="text-xs uppercase tracking-[0.1em] text-on-deep/40 hover:text-[#e0633b]">Delete booking</button></form>
            </>
          ) : (
            <Card>
              <p className="text-sm text-on-deep/70">{b.shoot}</p>
              <p className="mt-1 text-sm text-on-deep/55">{b.shootDate}</p>
              <p className="mt-2 mono text-xs text-on-deep/55">Owner: {ownerName} · Delivery: {b.deliveryStatus}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
