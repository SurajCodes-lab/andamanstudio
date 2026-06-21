"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// A brief, branded intro curtain — the single biggest "expensive" tell.
// Shows once per session, counts to 100, then slides up to reveal the hero.
// Fully skipped for repeat sessions and reduced-motion users.
export default function Preloader() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const seen = sessionStorage.getItem("as_intro");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setDone(true);
      return;
    }
    document.documentElement.classList.add("intro-lock");
    const start = performance.now();
    const dur = 1300;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 2);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("as_intro", "1");
        setTimeout(() => setDone(true), 220);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (done) document.documentElement.classList.remove("intro-lock");
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10001] flex flex-col items-center justify-center bg-ink-deep"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="glow glow-gold left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 opacity-20" />
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="display relative text-4xl text-on-deep sm:text-6xl"
          >
            Andaman <span className="text-gradient">Studio</span>
          </motion.span>
          <span className="meta mt-5 text-on-deep/55">The Best at Havelock</span>
          <div className="mt-8 h-px w-52 overflow-hidden bg-white/10 sm:w-64">
            <div className="h-full bg-gold transition-[width] duration-75 ease-out" style={{ width: `${count}%` }} />
          </div>
          <span className="mono mt-3 text-xs text-gold-soft">{String(count).padStart(3, "0")}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
