import { NextResponse } from "next/server";
import { requirePermission, type ModuleKey } from "@/lib/permissions";
import { db } from "@/lib/db/client";

export const runtime = "nodejs";

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

const PERM: Record<string, ModuleKey> = { leads: "leads", bookings: "bookings", payments: "bookings" };

export async function GET(_req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const mod = PERM[type];
  if (!mod) return NextResponse.json({ error: "Unknown export" }, { status: 404 });
  try {
    await requirePermission(mod);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let rows: Record<string, unknown>[] = [];
  if (type === "leads") {
    rows = await db.query.enquiries.findMany({ orderBy: (t, { desc }) => desc(t.id) });
  } else if (type === "bookings") {
    rows = await db.query.bookings.findMany({ orderBy: (t, { desc }) => desc(t.id) });
  } else if (type === "payments") {
    rows = await db.query.payments.findMany({ orderBy: (t, { desc }) => desc(t.id) });
  }

  return new NextResponse(toCsv(rows), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="andaman-${type}.csv"`,
    },
  });
}
