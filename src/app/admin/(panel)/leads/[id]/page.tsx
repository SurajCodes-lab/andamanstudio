import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { enquiries, activities } from "@/lib/db/schema";
import { guardPage, can } from "@/lib/permissions";
import { formatINR } from "@/data/catalog";
import ActivityTimeline from "@/components/admin/ActivityTimeline";
import { setStage, assignLead, claimLead, setFollowUp, addNote, convertToBooking, deleteLead, updateLeadFields, quoteFromLead } from "../actions";
import { Card, Field, PageHeader, SaveButton, fieldCls } from "../../ui";

export const dynamic = "force-dynamic";

const STAGES = ["new", "contacted", "quoted", "won", "lost"] as const;

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const sp = await guardPage("leads");
  const manage = can(sp, "leads", "manage");
  const id = Number((await params).id);
  const lead = await db.query.enquiries.findFirst({ where: eq(enquiries.id, id) });
  if (!lead) notFound();

  const acts = await db.query.activities.findMany({
    where: (t, { and, eq: e }) => and(e(t.entityType, "lead"), e(t.entityId, id)),
    orderBy: (t, { desc }) => desc(t.id),
  });
  const users = await db.query.users.findMany();
  const ownerName = users.find((u) => u.id === lead.ownerId)?.name ?? (lead.ownerId ? `#${lead.ownerId}` : "Unassigned");
  const wa = lead.phone ? `https://wa.me/${lead.phone.replace(/\D/g, "")}` : null;
  const open = lead.stage !== "won" && lead.stage !== "lost";
  const overdue = open && lead.followUpAt ? new Date(lead.followUpAt) < new Date() : false;

  return (
    <div>
      <PageHeader
        title={lead.name}
        subtitle={`Lead · ${lead.stage}${lead.bookingId ? ` · converted → booking #${lead.bookingId}` : ""}`}
        action={
          <div className="flex items-center gap-3">
            {overdue && <span className="rounded-full bg-[#e0633b]/15 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.1em] text-[#f08a66]">⚠ Follow-up overdue</span>}
            <Link href="/admin/leads" className="text-xs text-on-deep/40 hover:text-gold">← Pipeline</Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {lead.phone && <a href={`tel:${lead.phone}`} className="text-on-deep/80 hover:text-gold">📞 {lead.phone}</a>}
              {lead.email && <a href={`mailto:${lead.email}`} className="text-on-deep/80 hover:text-gold">✉ {lead.email}</a>}
              {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline">💬 WhatsApp</a>}
              <span className="mono ml-auto text-[0.6rem] text-on-deep/35">{lead.source}</span>
            </div>
            <p className="mt-3 text-sm text-on-deep/75">{lead.message}</p>
            {lead.value ? <p className="mt-2 font-serif text-xl text-gold-soft">{formatINR(lead.value)}</p> : null}
          </Card>

          <Card>
            <h3 className="mb-3 font-serif text-lg text-gold-soft">Activity</h3>
            {manage && (
              <form action={addNote} className="mb-5 space-y-2">
                <input type="hidden" name="id" value={lead.id} />
                <textarea name="body" rows={2} placeholder="Add a note / log a call…" className={`${fieldCls} resize-y`} />
                <div className="flex items-center gap-2">
                  <select name="kind" className={`${fieldCls} w-32`}>
                    <option value="note">Note</option>
                    <option value="call">Call</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                  </select>
                  <SaveButton>Log</SaveButton>
                </div>
              </form>
            )}
            <ActivityTimeline items={acts} />
          </Card>
        </div>

        {/* sidebar controls */}
        {manage ? (
          <div className="space-y-4">
            <Card>
              <form action={setStage} className="flex items-end gap-2">
                <input type="hidden" name="id" value={lead.id} />
                <Field label="Stage"><select name="stage" defaultValue={lead.stage} className={`${fieldCls} capitalize`}>{STAGES.map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>
                <SaveButton>Set</SaveButton>
              </form>
            </Card>
            <Card>
              <form action={assignLead} className="flex items-end gap-2">
                <input type="hidden" name="id" value={lead.id} />
                <Field label={`Owner · ${ownerName}`}>
                  <select name="ownerId" defaultValue={lead.ownerId ?? ""} className={fieldCls}>
                    <option value="">— Unassigned (pool) —</option>
                    {users.map((u) => <option key={u.id} value={u.id}>{u.name ?? u.email}</option>)}
                  </select>
                </Field>
                <SaveButton>Set</SaveButton>
              </form>
              <form action={claimLead} className="mt-2"><input type="hidden" name="id" value={lead.id} /><button className="text-xs uppercase tracking-[0.1em] text-gold hover:text-gold-soft">Claim this lead →</button></form>
            </Card>
            <Card>
              <form action={setFollowUp} className="flex items-end gap-2">
                <input type="hidden" name="id" value={lead.id} />
                <Field label="Follow-up"><input type="datetime-local" name="followUpAt" defaultValue={lead.followUpAt ? new Date(lead.followUpAt).toISOString().slice(0, 16) : ""} className={fieldCls} /></Field>
                <SaveButton>Set</SaveButton>
              </form>
            </Card>
            <Card>
              <h3 className="mb-3 font-serif text-base text-gold-soft">Qualify</h3>
              <form action={updateLeadFields} className="space-y-3">
                <input type="hidden" name="id" value={lead.id} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Est. value ₹"><input name="value" type="number" defaultValue={lead.value ?? ""} className={fieldCls} /></Field>
                  <Field label={`Score · ${lead.score}`}><input name="score" type="number" min={0} max={100} defaultValue={lead.score} className={fieldCls} /></Field>
                </div>
                <Field label="Source"><input name="source" defaultValue={lead.source} className={fieldCls} /></Field>
                {lead.stage === "lost" && <Field label="Lost reason"><input name="lostReason" defaultValue={lead.lostReason ?? ""} className={fieldCls} /></Field>}
                <SaveButton>Save</SaveButton>
              </form>
            </Card>
            {!lead.bookingId && (
              <Card className="space-y-2">
                <form action={quoteFromLead}>
                  <input type="hidden" name="id" value={lead.id} />
                  <button className="font-syne w-full rounded-full border border-gold/60 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-gold hover:bg-gold hover:text-ink-deep">❡ Build a quote →</button>
                </form>
                <form action={convertToBooking}>
                  <input type="hidden" name="id" value={lead.id} />
                  <button className="font-syne w-full rounded-full bg-gold py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-deep hover:bg-gold-soft">Convert to booking →</button>
                </form>
              </Card>
            )}
            <form action={deleteLead}><input type="hidden" name="id" value={lead.id} /><button className="text-xs uppercase tracking-[0.1em] text-on-deep/40 hover:text-[#e0633b]">Delete lead</button></form>
          </div>
        ) : (
          <Card><p className="text-sm text-on-deep/55">View-only access. Owner: {ownerName}. Stage: {lead.stage}.</p></Card>
        )}
      </div>
    </div>
  );
}
