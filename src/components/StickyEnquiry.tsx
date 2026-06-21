"use client";

import { useState } from "react";
import EnquiryForm from "./EnquiryForm";

// Always-available enquiry: a floating button (bottom-left) that opens a quick
// enquiry modal. Submissions go through EnquiryForm → saveEnquiry → admin Leads.
// Mounted at the layout level (outside the page transition wrapper) so the modal
// always positions against the viewport.
export default function StickyEnquiry() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Quick enquiry"
        className="fixed bottom-5 left-5 z-[60] hidden items-center gap-2 rounded-full border border-gold/50 bg-ink-deep/90 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-gold shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors hover:bg-gold hover:text-ink-deep sm:inline-flex sm:left-5 print:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" />
        </svg>
        Enquire
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-sm print:hidden" onClick={() => setOpen(false)}>
          <div
            className="max-h-[90vh] w-full max-w-md overflow-auto rounded-2xl border border-line bg-ink-deep p-6 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.9)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="eyebrow text-gold">Quick enquiry</span>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-sm text-on-deep/60 hover:text-gold">Close ✕</button>
            </div>
            <h3 className="font-serif mb-5 text-2xl text-on-deep">Tell us about your shoot</h3>
            <EnquiryForm source="sticky" />
          </div>
        </div>
      )}
    </>
  );
}
