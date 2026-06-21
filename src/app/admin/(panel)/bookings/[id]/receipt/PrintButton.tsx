"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="font-syne rounded-full bg-gold px-5 py-2 text-xs font-bold uppercase tracking-[0.08em] text-ink-deep transition-colors hover:bg-gold-soft print:hidden"
    >
      Print / Save PDF
    </button>
  );
}
