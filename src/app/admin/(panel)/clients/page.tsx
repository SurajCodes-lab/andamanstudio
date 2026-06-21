import { db } from "@/lib/db/client";
import { guardPage } from "@/lib/permissions";
import { formatINR } from "@/data/catalog";
import { PageHeader } from "../ui";

export const dynamic = "force-dynamic";

type Client = { name: string; phone: string | null; email: string | null; count: number; billed: number; paid: number };

export default async function Clients() {
  await guardPage("bookings");
  const bks = await db.query.bookings.findMany({ orderBy: (t, { desc }) => desc(t.id) });

  const map = new Map<string, Client>();
  for (const b of bks) {
    const key = (b.phone || b.clientName).trim().toLowerCase();
    const c = map.get(key) ?? { name: b.clientName, phone: b.phone, email: b.email, count: 0, billed: 0, paid: 0 };
    c.count++;
    c.billed += b.amount;
    c.paid += b.amountPaid;
    if (!c.email && b.email) c.email = b.email;
    map.set(key, c);
  }
  const clients = [...map.values()].sort((a, b) => b.billed - a.billed);

  return (
    <div>
      <PageHeader title="Clients" subtitle={`${clients.length} clients · grouped from bookings`} />
      <div className="space-y-2">
        {clients.map((c, i) => (
          <div key={i} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface/30 p-4">
            <span className="font-serif text-on-deep">{c.name}</span>
            {c.phone && <a href={`tel:${c.phone}`} className="text-sm text-on-deep/55 hover:text-gold">{c.phone}</a>}
            {c.email && <span className="text-sm text-on-deep/45">{c.email}</span>}
            <span className="mono ml-auto text-xs text-on-deep/55">{c.count} booking{c.count > 1 ? "s" : ""} · {formatINR(c.paid)} / {formatINR(c.billed)}</span>
          </div>
        ))}
        {clients.length === 0 && <p className="text-sm text-on-deep/40">No clients yet.</p>}
      </div>
    </div>
  );
}
