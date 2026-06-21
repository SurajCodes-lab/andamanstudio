import Link from "next/link";
import { db } from "@/lib/db/client";
import { guardPage } from "@/lib/permissions";
import { PageHeader } from "../ui";

export const dynamic = "force-dynamic";

const ym = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function Calendar({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  await guardPage("calendar");
  const { m } = await searchParams;
  const now = new Date();
  const [Y, M] = (m ?? ym(now)).split("-").map(Number); // M = 1..12
  const first = new Date(Y, M - 1, 1);
  const daysInMonth = new Date(Y, M, 0).getDate();
  const startWeekday = first.getDay();
  const monthStr = `${Y}-${String(M).padStart(2, "0")}`;
  const today = now.toISOString().slice(0, 10);

  const rows = await db.query.bookings.findMany();
  const byDay: Record<number, typeof rows> = {};
  for (const b of rows) if (b.shootOn?.startsWith(monthStr)) (byDay[Number(b.shootOn.slice(8, 10))] ??= []).push(b);

  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const upcoming = rows
    .filter((b) => b.shootOn && b.shootOn >= today)
    .sort((a, b) => (a.shootOn ?? "").localeCompare(b.shootOn ?? ""))
    .slice(0, 8);

  const prev = ym(new Date(Y, M - 2, 1));
  const next = ym(new Date(Y, M, 1));

  return (
    <div>
      <PageHeader
        title="Calendar & scheduling"
        subtitle="Shoots by date — a red cell means more than one shoot that day."
        action={
          <div className="flex items-center gap-3 text-sm">
            <Link href={`/admin/calendar?m=${prev}`} className="text-on-deep/60 hover:text-gold">←</Link>
            <span className="font-serif text-gold-soft">{first.toLocaleString("en-IN", { month: "long", year: "numeric" })}</span>
            <Link href={`/admin/calendar?m=${next}`} className="text-on-deep/60 hover:text-gold">→</Link>
          </div>
        }
      />

      <div className="grid grid-cols-7 gap-1">
        {DOW.map((d) => <div key={d} className="meta py-1 text-center text-on-deep/40">{d}</div>)}
        {cells.map((d, i) =>
          d === null ? (
            <div key={i} />
          ) : (
            <div key={i} className={`min-h-[5rem] rounded-lg border p-1.5 ${byDay[d]?.length > 1 ? "border-[#e0633b]/60 bg-[#e0633b]/5" : "border-line bg-surface/20"}`}>
              <span className="mono text-[0.6rem] text-on-deep/40">{d}</span>
              {(byDay[d] ?? []).map((b) => (
                <Link key={b.id} href={`/admin/bookings/${b.id}`} className="mt-0.5 block truncate rounded bg-gold/15 px-1 text-[0.6rem] text-gold hover:bg-gold/25">{b.clientName}</Link>
              ))}
            </div>
          )
        )}
      </div>

      <h2 className="meta mb-2 mt-8 text-on-deep/45">Upcoming shoots</h2>
      <div className="space-y-2">
        {upcoming.map((b) => (
          <Link key={b.id} href={`/admin/bookings/${b.id}`} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface/30 p-3 hover:border-gold/50">
            <span className="mono text-xs text-gold-soft">{b.shootOn}</span>
            <span className="font-serif text-on-deep">{b.clientName}</span>
            <span className="text-sm text-on-deep/55">{b.shoot}</span>
          </Link>
        ))}
        {upcoming.length === 0 && <p className="text-sm text-on-deep/40">No upcoming shoots scheduled.</p>}
      </div>
    </div>
  );
}
