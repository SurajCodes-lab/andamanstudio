"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { catalog } from "@/data/catalog";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", date: "", pkg: "", message: "" });
  const [sent, setSent] = useState(false);

  const whatsappText = [
    "Hi Andaman Studio!",
    form.name && `I'm ${form.name}.`,
    form.pkg && `I'm interested in: ${form.pkg}.`,
    form.date && `Preferred date: ${form.date}.`,
    form.message && `\n${form.message}`,
  ]
    .filter(Boolean)
    .join(" ");
  const whatsappHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(whatsappText)}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const field =
    "w-full min-w-0 border-b border-line bg-transparent py-3 text-ink placeholder:text-ink-mute focus:border-gold focus:outline-none transition-colors";

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-4 py-6">
        <span className="bg-gold text-ink-deep flex h-12 w-12 items-center justify-center rounded-full text-xl">✓</span>
        <h4 className="font-serif text-ink text-2xl">
          Almost there{form.name ? `, ${form.name.split(" ")[0]}` : ""}!
        </h4>
        <p className="text-ink-soft max-w-sm text-sm leading-relaxed">
          We&apos;ve opened WhatsApp with your details ready to send. Didn&apos;t open?
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gold text-ink-deep hover:bg-gold-soft rounded-full px-7 py-3 text-sm uppercase tracking-[0.16em] transition-colors"
        >
          Open WhatsApp →
        </a>
        <button onClick={() => setSent(false)} className="link-underline text-ink-mute text-xs uppercase tracking-[0.16em]">
          ← Edit details
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label className="eyebrow mb-2 block" htmlFor="cf-name">Your name</label>
          <input id="cf-name" className={field} placeholder="Jane & John" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="eyebrow mb-2 block" htmlFor="cf-date">Preferred date</label>
          <input id="cf-date" type="date" min={new Date().toISOString().slice(0, 10)} className={field} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <p className="text-ink-mute mt-1.5 text-[0.7rem]">We recommend booking 10+ days ahead.</p>
        </div>
      </div>

      <div>
        <label className="eyebrow mb-2 block" htmlFor="cf-pkg">Package of interest</label>
        <select id="cf-pkg" className={`${field} appearance-none`} value={form.pkg} onChange={(e) => setForm({ ...form, pkg: e.target.value })}>
          <option value="">Select a category…</option>
          {catalog.map((c) => (
            <option key={c.id} value={c.title}>{c.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="eyebrow mb-2 block" htmlFor="cf-msg">Tell us about your shoot</label>
        <textarea id="cf-msg" rows={4} className={`${field} resize-none`} placeholder="Locations, occasion, number of people…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>

      <button
        type="submit"
        className="bg-gold text-ink-deep hover:bg-gold-soft w-full rounded-full px-7 py-4 text-sm uppercase tracking-[0.16em] transition-colors duration-300 sm:w-auto"
      >
        Send via WhatsApp →
      </button>
      <p className="text-ink-mute text-xs">Opens WhatsApp with your details pre-filled — no account needed.</p>
    </form>
  );
}
