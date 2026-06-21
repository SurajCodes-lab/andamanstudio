"use client";

import { motion } from "motion/react";

// A whisper-thin editorial seam: a gold hairline that draws itself in on
// scroll, with a small centred diamond. Gives rhythm where adjacent bands
// share a background, so the page never reads as one flat block.
export default function GoldSeam({ className = "" }: { className?: string }) {
  return (
    <div className={`relative bg-ink-deep ${className}`} aria-hidden>
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-5 py-1 sm:px-8">
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="h-px flex-1 origin-left bg-gradient-to-r from-transparent via-gold/45 to-transparent"
        />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold/60" />
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="h-px flex-1 origin-right bg-gradient-to-r from-transparent via-gold/45 to-transparent"
        />
      </div>
    </div>
  );
}
