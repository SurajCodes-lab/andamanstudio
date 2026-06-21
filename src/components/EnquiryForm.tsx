"use client";

import { useState } from "react";
import { saveEnquiry } from "@/app/contact/actions";

// Reusable, page-level enquiry form. Saves to the DB (admin → Enquiries).
export default function EnquiryForm({ source = "enquiry" }: { source?: string }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setState("busy");
    try {
      const r = await saveEnquiry({ ...form, source });
      setState(r?.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  const field =
    "w-full min-w-0 rounded-lg border border-line bg-ink-deep/50 px-4 py-3 text-on-deep placeholder:text-on-deep/35 outline-none transition-colors focus:border-gold";

  if (state === "done") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-gold/30 bg-ink-deep/40 p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-xl text-ink-deep">✓</span>
        <h4 className="font-serif text-2xl text-on-deep">Thank you{form.name ? `, ${form.name.split(" ")[0]}` : ""}!</h4>
        <p className="max-w-sm text-sm leading-relaxed text-on-deep/65">
          Your enquiry has reached us — we&apos;ll get back to you shortly. For a faster reply, message us on WhatsApp.
        </p>
        <button onClick={() => { setForm({ name: "", phone: "", email: "", message: "" }); setState("idle"); }} className="link-underline text-xs uppercase tracking-[0.16em] text-on-deep/60">
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input className={field} placeholder="Your name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className={field} placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      <input className={field} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <textarea className={`${field} resize-none`} rows={4} placeholder="Tell us about your shoot — dates, locations, what you have in mind…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      {state === "error" && <p className="text-sm text-[#e0633b]">Something went wrong — please try WhatsApp or call us.</p>}
      <button
        type="submit"
        disabled={state === "busy"}
        className="font-syne w-full rounded-full bg-gold px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-ink-deep transition-colors duration-300 hover:bg-gold-soft disabled:opacity-60 sm:w-auto"
      >
        {state === "busy" ? "Sending…" : "Send enquiry →"}
      </button>
    </form>
  );
}
