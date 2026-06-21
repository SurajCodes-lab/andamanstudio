"use client";

import { useMemo, useState } from "react";
import { priceForDate, tierRange, type Tier } from "@/lib/pricing";
import { formatINR } from "@/data/catalog";
import { submitBooking } from "@/app/book/actions";

type P = { id: number; name: string; price: number; tiers: Tier[]; blackouts: string[] };
type Cat = { slug: string; title: string; products: P[] };

export default function BookingWidget({
  catalog,
  blackout,
  whatsapp,
  initialPkg = "",
}: {
  catalog: Cat[];
  blackout: string[];
  whatsapp: string;
  initialPkg?: string;
}) {
  const products = useMemo(() => catalog.flatMap((c) => c.products), [catalog]);
  const today = new Date().toISOString().slice(0, 10);
  const blocked = useMemo(() => new Set(blackout), [blackout]);

  const [pkg, setPkg] = useState(products.some((p) => p.name === initialPkg) ? initialPkg : "");
  const [date, setDate] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const selected = products.find((p) => p.name === pkg) || null;
  // Blocked if the day is globally blocked OR blocked for the chosen package (slots full).
  const isBlocked = !!date && (blocked.has(date) || (!!selected && selected.blackouts.includes(date)));
  const resolved = selected && date && !isBlocked ? priceForDate(selected.price, selected.tiers, date) : null;
  const canSubmit = !!pkg && !!date && !!form.name.trim() && !isBlocked && !busy;

  const waText = [
    "Hi Andaman Studio!",
    form.name && `I'm ${form.name}.`,
    pkg && `I'd like to book: ${pkg}.`,
    date && `Date: ${date}.`,
    resolved && `Price: ${formatINR(resolved.price)}.`,
    form.message && `\n${form.message}`,
  ]
    .filter(Boolean)
    .join(" ");
  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(waText)}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setErr(null);
    const res = await submitBooking({
      name: form.name,
      phone: form.phone,
      email: form.email,
      pkg,
      productId: selected?.id,
      date,
      price: resolved?.price,
      message: form.message,
    }).catch(() => ({ ok: false, error: "Something went wrong." }));
    setBusy(false);
    if (res.ok) {
      window.open(waHref, "_blank", "noopener,noreferrer");
      setSent(true);
    } else {
      setErr(res.error || "Could not submit.");
    }
  }

  const field =
    "w-full min-w-0 rounded-lg border border-line bg-ink-deep/60 px-3.5 py-3 text-sm text-on-deep outline-none transition-colors placeholder:text-on-deep/30 focus:border-gold";
  const lbl = "meta mb-1.5 block text-on-deep/55";

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-4 py-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-xl text-ink-deep">✓</span>
        <h4 className="font-serif text-2xl text-on-deep">Request received{form.name ? `, ${form.name.split(" ")[0]}` : ""}!</h4>
        <p className="max-w-sm text-sm leading-relaxed text-on-deep/70">
          We&apos;ve logged your booking for <span className="text-gold">{pkg}</span> on{" "}
          <span className="text-gold">{date}</span>{resolved ? ` at ${formatINR(resolved.price)}` : ""} and opened WhatsApp to confirm.
        </p>
        <a href={waHref} target="_blank" rel="noopener noreferrer" className="rounded-full bg-gold px-7 py-3 text-sm uppercase tracking-[0.16em] text-ink-deep transition-colors hover:bg-gold-soft">
          Open WhatsApp →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label className={lbl}>Package</label>
        <select className={`${field} appearance-none`} value={pkg} onChange={(e) => setPkg(e.target.value)}>
          <option value="">Select a package…</option>
          {catalog.map((c) => (
            <optgroup key={c.slug} label={c.title}>
              {c.products.map((p) => <option key={p.id} value={p.name}>{p.name} — from {formatINR(p.price)}</option>)}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <label className={lbl}>Shoot date</label>
        <input type="date" min={today} className={field} value={date} onChange={(e) => setDate(e.target.value)} />
        {isBlocked && <p className="mt-2 text-sm text-[#f08a66]">⚠ That date is unavailable — please choose another.</p>}
      </div>

      {/* Live price for the chosen date */}
      {selected && date && !isBlocked && resolved && (
        <div className="rounded-xl border border-gold/40 bg-gold/5 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="meta text-on-deep/50">Price for {new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
              {resolved.tier && <p className="mono mt-0.5 text-[0.65rem] text-gold-soft">{resolved.tier.label} · {tierRange(resolved.tier)}</p>}
            </div>
            <p className="font-serif text-3xl text-gold">{formatINR(resolved.price)}</p>
          </div>
          {selected.tiers.length > 0 && (
            <details className="mt-3 text-xs text-on-deep/55">
              <summary className="cursor-pointer text-on-deep/45">Seasonal pricing</summary>
              <ul className="mt-2 space-y-1">
                <li className="flex justify-between"><span>Regular</span><span className="mono">{formatINR(selected.price)}</span></li>
                {selected.tiers.map((t, i) => (
                  <li key={i} className="flex justify-between"><span>{t.label} · {tierRange(t)}</span><span className="mono">{formatINR(t.price)}</span></li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={lbl}>Your name</label><input className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane & John" /></div>
        <div><label className={lbl}>Phone</label><input className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div><label className={lbl}>Email</label><input className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
      </div>
      <div><label className={lbl}>Notes</label><textarea rows={3} className={`${field} resize-none`} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Locations, occasion, number of people…" /></div>

      {err && <p className="text-sm text-[#f08a66]">{err}</p>}
      <button type="submit" disabled={!canSubmit} className="w-full rounded-full bg-gold px-7 py-4 text-sm uppercase tracking-[0.16em] text-ink-deep transition-colors duration-300 hover:bg-gold-soft disabled:opacity-40 sm:w-auto">
        {busy ? "Submitting…" : "Request this date →"}
      </button>
      <p className="text-xs text-on-deep/40">We&apos;ll confirm availability on WhatsApp. Unavailable dates are blocked automatically.</p>
    </form>
  );
}
