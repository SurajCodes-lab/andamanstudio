import { db } from "@/lib/db/client";
import { guardPage, can } from "@/lib/permissions";
import { formatINR } from "@/data/catalog";
import { addCoupon, updateCoupon, deleteCoupon, toggleCoupon } from "./actions";
import { Card, Field, PageHeader, SaveButton, fieldCls } from "../ui";

export const dynamic = "force-dynamic";

const today = () => new Date().toISOString().slice(0, 10);

function status(c: { active: boolean; startsAt: string | null; expiresAt: string | null; timesUsed: number; maxRedemptions: number | null }) {
  const t = today();
  if (!c.active) return { label: "Inactive", cls: "bg-on-deep/10 text-on-deep/50" };
  if (c.startsAt && t < c.startsAt) return { label: "Scheduled", cls: "bg-[#5b8def]/15 text-[#8ab0ff]" };
  if (c.expiresAt && t > c.expiresAt) return { label: "Expired", cls: "bg-[#e0633b]/15 text-[#f08a66]" };
  if (c.maxRedemptions != null && c.timesUsed >= c.maxRedemptions) return { label: "Used up", cls: "bg-[#e0633b]/15 text-[#f08a66]" };
  return { label: "Live", cls: "bg-gold/15 text-gold" };
}

export default async function CouponsPage() {
  const sp = await guardPage("coupons");
  const manage = can(sp, "coupons", "manage");
  const rows = await db.query.coupons.findMany({ orderBy: (t, { desc }) => desc(t.id) });

  const live = rows.filter((c) => status(c).label === "Live").length;
  const redemptions = rows.reduce((s, c) => s + c.timesUsed, 0);

  return (
    <div>
      <PageHeader
        title="Coupons & offers"
        subtitle="Create discount codes for quotes and bookings — percentage or flat, with validity windows and usage limits."
        action={
          <div className="flex gap-6 text-right">
            <div><p className="font-serif text-2xl text-gold">{live}</p><p className="meta text-on-deep/45">Live</p></div>
            <div><p className="font-serif text-2xl text-on-deep">{redemptions}</p><p className="meta text-on-deep/45">Redemptions</p></div>
          </div>
        }
      />

      {manage && (
        <Card className="mb-7">
          <h3 className="mb-3 font-serif text-lg text-gold-soft">New coupon</h3>
          <form action={addCoupon} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-4">
              <Field label="Code" hint="UPPERCASE"><input name="code" required placeholder="MONSOON20" className={`${fieldCls} uppercase`} /></Field>
              <Field label="Type"><select name="type" className={fieldCls}><option value="percent">% Percent</option><option value="flat">₹ Flat</option></select></Field>
              <Field label="Value" hint="% or ₹"><input name="value" type="number" required className={fieldCls} /></Field>
              <Field label="Min order ₹" hint="optional"><input name="minAmount" type="number" className={fieldCls} /></Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <Field label="Max uses" hint="blank = ∞"><input name="maxRedemptions" type="number" className={fieldCls} /></Field>
              <Field label="Starts"><input name="startsAt" type="date" className={fieldCls} /></Field>
              <Field label="Expires"><input name="expiresAt" type="date" className={fieldCls} /></Field>
              <Field label="Label" hint="internal note"><input name="description" className={fieldCls} /></Field>
            </div>
            <SaveButton>Create coupon</SaveButton>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {rows.length === 0 && <p className="text-sm text-on-deep/40">No coupons yet.</p>}
        {rows.map((c) => {
          const st = status(c);
          return (
            <Card key={c.id}>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="font-mono text-lg font-bold tracking-[0.1em] text-gold">{c.code}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[0.62rem] uppercase tracking-[0.1em] ${st.cls}`}>{st.label}</span>
                <span className="text-sm text-on-deep/70">{c.type === "percent" ? `${c.value}% off` : `${formatINR(c.value)} off`}</span>
                {c.minAmount != null && <span className="meta text-on-deep/40">min {formatINR(c.minAmount)}</span>}
                <span className="meta ml-auto text-on-deep/40">
                  used {c.timesUsed}{c.maxRedemptions != null ? ` / ${c.maxRedemptions}` : ""}
                </span>
              </div>
              {manage ? (
                <form action={updateCoupon} className="space-y-3">
                  <input type="hidden" name="id" value={c.id} />
                  <div className="grid gap-3 sm:grid-cols-4">
                    <Field label="Type"><select name="type" defaultValue={c.type} className={fieldCls}><option value="percent">% Percent</option><option value="flat">₹ Flat</option></select></Field>
                    <Field label="Value"><input name="value" type="number" defaultValue={c.value} className={fieldCls} /></Field>
                    <Field label="Min order ₹"><input name="minAmount" type="number" defaultValue={c.minAmount ?? ""} className={fieldCls} /></Field>
                    <Field label="Max uses"><input name="maxRedemptions" type="number" defaultValue={c.maxRedemptions ?? ""} className={fieldCls} /></Field>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-4">
                    <Field label="Starts"><input name="startsAt" type="date" defaultValue={c.startsAt ?? ""} className={fieldCls} /></Field>
                    <Field label="Expires"><input name="expiresAt" type="date" defaultValue={c.expiresAt ?? ""} className={fieldCls} /></Field>
                    <Field label="Label"><input name="description" defaultValue={c.description ?? ""} className={fieldCls} /></Field>
                    <Field label="Active"><select name="active" defaultValue={c.active ? "1" : "0"} className={fieldCls}><option value="1">Yes</option><option value="0">No</option></select></Field>
                  </div>
                  <div className="flex items-center gap-3">
                    <SaveButton />
                    <button formAction={deleteCoupon} className="ml-auto text-xs uppercase tracking-[0.12em] text-on-deep/40 hover:text-[#e0633b]">Delete</button>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-on-deep/50">{c.description}</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
