"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Container from "./Container";

type Testimonial = { quote: string; name: string; role: string };

export default function Testimonials({ items }: { items: Testimonial[] }) {
  const testimonials = items;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || testimonials.length <= 1) return;
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, [paused, testimonials.length]);

  if (!testimonials.length) return null;
  const t = testimonials[i];

  return (
    <section
      className="bg-ink-deep text-on-deep relative overflow-hidden py-24 sm:py-32"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 50% at 50% 50%, rgba(231,177,76,0.10), transparent 70%)" }}
      />
      <Container size="narrow" className="relative text-center">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex gap-1 text-gold-soft" role="img" aria-label="Five star rated">
            {Array.from({ length: 5 }).map((_, s) => (
              <span key={s} aria-hidden className="text-lg">★</span>
            ))}
          </div>
          <p className="text-[0.72rem] uppercase tracking-[0.26em] text-on-deep/70">
            Highest rated at Havelock · 10k+ travellers
          </p>
        </div>
        <span aria-hidden className="font-serif text-gold-soft block text-6xl leading-none">“</span>
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-serif text-2xl leading-snug sm:text-3xl lg:text-4xl">
              {t.quote}
            </p>
            <footer className="mt-8">
              <p className="text-gold-soft text-lg">{t.name}</p>
              <p className="text-sm uppercase tracking-[0.2em] text-on-deep/60">{t.role}</p>
            </footer>
          </motion.blockquote>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-center gap-3">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to testimonial ${idx + 1} of ${testimonials.length}`}
              aria-current={idx === i}
              onClick={() => setI(idx)}
              className="flex h-7 items-center px-1"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-500 ${
                  idx === i ? "w-10 bg-gold-soft" : "w-4 bg-on-deep/30"
                }`}
              />
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
