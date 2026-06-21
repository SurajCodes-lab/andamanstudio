"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Service } from "@/data/services";
import ServiceCard from "./ServiceCard";

// 12-col bento — a tall 2-row anchor + gap-free rows of 3.
const BENTO = [
  "lg:col-span-6 lg:row-span-2", "lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-4", "lg:col-span-4", "lg:col-span-4",
  "lg:col-span-4", "lg:col-span-4", "lg:col-span-4",
  "lg:col-span-4", "lg:col-span-4", "lg:col-span-4",
];

const LABEL: Record<string, string> = {
  photoshoot: "Photoshoot",
  "pre-post-wedding": "Weddings",
  "candle-light-dinner": "Candle-Light",
  kalapathar: "Kalapathar",
  drone: "Drone",
  property: "Property",
};

export default function ServicesWall({
  services,
  categories,
}: {
  services: Service[];
  categories: { id: string; title: string }[];
}) {
  const [filter, setFilter] = useState("all");
  const filters = useMemo(
    () => [{ id: "all", label: "All work" }, ...categories.map((c) => ({ id: c.id, label: LABEL[c.id] ?? c.title }))],
    [categories]
  );
  const shown = filter === "all" ? services : services.filter((s) => s.relatedCategoryId === filter);

  return (
    <div>
      {/* Filter chips — sticky on sm+, scrollable on mobile */}
      <div className="sticky-services mb-8 flex flex-wrap gap-2.5">
        {filters.map((f) => {
          const on = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={on}
              className={`font-syne rounded-full border px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.1em] transition-colors duration-300 ${
                on ? "border-gold bg-gold text-ink-deep" : "border-line text-on-deep/70 hover:border-gold/50 hover:text-gold"
              }`}
            >
              {f.label}
            </button>
          );
        })}
        <span className="mono ml-auto hidden items-center text-[0.66rem] text-on-deep/45 sm:flex">
          {shown.length} {shown.length === 1 ? "session" : "sessions"}
        </span>
      </div>

      <motion.div layout className="grid auto-rows-[14rem] grid-cols-2 gap-3 sm:auto-rows-[15rem] sm:grid-cols-3 lg:grid-cols-12 lg:gap-4">
        <AnimatePresence mode="popLayout">
          {shown.map((s, i) => (
            <motion.div
              key={s.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={filter === "all" ? BENTO[i % BENTO.length] : "lg:col-span-4"}
            >
              <ServiceCard service={s} index={i} big={filter === "all" && i === 0} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
