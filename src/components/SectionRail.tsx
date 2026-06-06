"use client";

import { useEffect, useState } from "react";

// Sticky editorial index — vertical ticks that track the active section and
// let you jump. Desktop only; decorative + navigational.
export default function SectionRail({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Sections"
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3.5 lg:flex"
    >
      {items.map((it, i) => {
        const on = active === it.id;
        return (
          <button
            key={it.id}
            onClick={() => document.getElementById(it.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            aria-label={`Go to ${it.label}`}
            aria-current={on}
            className="group flex items-center gap-3 py-1.5"
          >
            <span
              className={`mono text-[0.6rem] tracking-widest transition-all duration-300 ${
                on ? "text-gold opacity-100" : "text-ink-mute opacity-0 group-hover:opacity-100"
              }`}
            >
              {String(i + 1).padStart(2, "0")} {it.label}
            </span>
            <span
              className={`h-px transition-all duration-300 ${
                on ? "w-8 bg-gold" : "w-4 bg-ink/30 group-hover:w-6 group-hover:bg-ink/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
