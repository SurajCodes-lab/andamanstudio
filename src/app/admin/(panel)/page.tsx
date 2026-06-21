import Link from "next/link";
import { db } from "@/lib/db/client";
import { getSessionPerms, can } from "@/lib/permissions";
import { formatINR } from "@/data/catalog";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const sp = await getSessionPerms();
  const [leads, allBookings, allPayments, allTasks, allQuotes] = await Promise.all([
    db.query.enquiries.findMany(),
    db.query.bookings.findMany(),
    db.query.payments.findMany(),
    db.query.tasks.findMany(),
    db.query.quotes.findMany(),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);
  const openLeads = leads.filter((l) => l.stage !== "won" && l.stage !== "lost");
  const pipelineValue = openLeads.reduce((n, l) => n + (l.value ?? 0), 0);
  const won = leads.filter((l) => l.stage === "won").length;
  const conversion = leads.length ? Math.round((won / leads.length) * 100) : 0;
  const revenueMonth = allPayments.filter((p) => (p.paidAt ?? "").startsWith(month)).reduce((n, p) => n + p.amount, 0);
  const outstanding = allBookings.reduce((n, b) => n + (b.amount - b.amountPaid), 0);
  const myTasks = allTasks.filter((t) => !t.done && t.ownerId === sp?.userId);
  const followUpsDue = openLeads.filter((l) => l.followUpAt && new Date(l.followUpAt).toISOString().slice(0, 10) <= today);

  // Funnel + source analytics
  const STAGES = ["new", "contacted", "quoted", "won", "lost"] as const;
  const funnel = STAGES.map((s) => ({ stage: s, count: leads.filter((l) => l.stage === s).length }));
  const maxStage = Math.max(1, ...funnel.map((f) => f.count));
  const sources = Object.entries(
    leads.reduce<Record<string, number>>((acc, l) => ((acc[l.source] = (acc[l.source] ?? 0) + 1), acc), {})
  ).sort((a, b) => b[1] - a[1]);
  const quotesSent = allQuotes.filter((q) => q.status === "sent").reduce((n, q) => n + q.total, 0);
  const upcoming = allBookings
    .filter((b) => b.shootOn && b.shootOn >= today)
    .sort((a, b) => (a.shootOn ?? "").localeCompare(b.shootOn ?? ""))
    .slice(0, 6);

  const stats = [
    { label: "New leads", value: leads.filter((l) => l.stage === "new").length, href: "/admin/leads" },
    { label: "Pipeline value", value: formatINR(pipelineValue), href: "/admin/leads" },
    { label: "Conversion", value: `${conversion}%`, href: "/admin/leads" },
    { label: "Revenue (month)", value: formatINR(revenueMonth), href: "/admin/bookings" },
    { label: "Outstanding", value: formatINR(outstanding), href: "/admin/bookings" },
    { label: "Quotes out", value: formatINR(quotesSent), href: "/admin/quotes" },
  ];

  return (
    <div>
      <p className="meta text-gold">Welcome back{sp?.name ? `, ${sp.name.split(" ")[0]}` : ""}</p>
      <h1 className="font-serif mt-1 text-4xl text-on-deep">Your studio, at a glance.</h1>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl border border-line bg-surface/30 p-5 transition-colors hover:border-gold/50">
            <p className="font-serif text-2xl text-gold-soft sm:text-3xl">{s.value}</p>
            <p className="meta mt-1 text-on-deep/55">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface/20 p-5 lg:col-span-2">
          <h2 className="meta mb-4 text-on-deep/45">Pipeline funnel</h2>
          <div className="space-y-2.5">
            {funnel.map((f) => (
              <Link key={f.stage} href="/admin/leads" className="flex items-center gap-3 text-sm hover:text-gold">
                <span className="w-20 capitalize text-on-deep/60">{f.stage}</span>
                <span className="h-2.5 rounded-full bg-gold/70" style={{ width: `${(f.count / maxStage) * 100}%`, minWidth: f.count ? "0.6rem" : 0 }} />
                <span className="mono text-[0.65rem] text-on-deep/45">{f.count}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface/20 p-5">
          <h2 className="meta mb-3 text-on-deep/45">Lead sources</h2>
          {sources.length === 0 && <p className="text-sm text-on-deep/40">No leads yet.</p>}
          {sources.slice(0, 6).map(([src, n]) => (
            <div key={src} className="flex justify-between border-b border-line py-2 text-sm">
              <span className="capitalize text-on-deep/75">{src}</span>
              <span className="mono text-[0.65rem] text-on-deep/45">{n}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface/20 p-5">
          <h2 className="meta mb-3 text-on-deep/45">Upcoming shoots</h2>
          {upcoming.length === 0 && <p className="text-sm text-on-deep/40">None scheduled.</p>}
          {upcoming.map((b) => (
            <Link key={b.id} href={`/admin/bookings/${b.id}`} className="flex justify-between border-b border-line py-2 text-sm hover:text-gold">
              <span className="text-on-deep/80">{b.clientName}</span>
              <span className="mono text-[0.6rem] text-gold-soft">{b.shootOn}</span>
            </Link>
          ))}
        </div>
        <div className="rounded-2xl border border-line bg-surface/20 p-5">
          <h2 className="meta mb-3 text-on-deep/45">Follow-ups due</h2>
          {followUpsDue.length === 0 && <p className="text-sm text-on-deep/40">Nothing due — nice.</p>}
          {followUpsDue.slice(0, 6).map((l) => (
            <Link key={l.id} href={`/admin/leads/${l.id}`} className="flex justify-between border-b border-line py-2 text-sm hover:text-gold">
              <span className="text-on-deep/80">{l.name}</span>
              <span className="mono text-[0.6rem] text-on-deep/40">{new Date(l.followUpAt!).toLocaleDateString("en-IN")}</span>
            </Link>
          ))}
        </div>
        <div className="rounded-2xl border border-line bg-surface/20 p-5">
          <h2 className="meta mb-3 text-on-deep/45">My open tasks</h2>
          {myTasks.length === 0 && <p className="text-sm text-on-deep/40">No tasks assigned to you.</p>}
          {myTasks.slice(0, 6).map((t) => (
            <Link key={t.id} href="/admin/tasks" className="flex justify-between border-b border-line py-2 text-sm hover:text-gold">
              <span className="text-on-deep/80">{t.title}</span>
              {t.dueAt && <span className={`mono text-[0.6rem] ${t.dueAt < today ? "text-[#e0633b]" : "text-on-deep/40"}`}>{t.dueAt}</span>}
            </Link>
          ))}
        </div>
      </div>

      {sp && (can(sp, "leads") || can(sp, "bookings")) && (
        <div className="mt-8">
          <h2 className="meta mb-2 text-on-deep/45">Export (CSV)</h2>
          <div className="flex flex-wrap gap-2">
            {can(sp, "leads") && <a href="/api/admin/export/leads" className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.1em] text-on-deep/70 hover:border-gold hover:text-gold">Leads</a>}
            {can(sp, "bookings") && <a href="/api/admin/export/bookings" className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.1em] text-on-deep/70 hover:border-gold hover:text-gold">Bookings</a>}
            {can(sp, "bookings") && <a href="/api/admin/export/payments" className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.1em] text-on-deep/70 hover:border-gold hover:text-gold">Payments</a>}
          </div>
        </div>
      )}
    </div>
  );
}
