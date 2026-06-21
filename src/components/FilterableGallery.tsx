"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import GalleryGrid from "./GalleryGrid";

type GalleryCategory = { id: string; label: string; images: string[] };

export default function FilterableGallery({
  galleryCategories,
  allGalleryImages,
}: {
  galleryCategories: GalleryCategory[];
  allGalleryImages: string[];
}) {
  const [active, setActive] = useState("all");

  const tabs = useMemo(
    () => [
      { id: "all", label: "All", count: allGalleryImages.length },
      ...galleryCategories.map((c) => ({ id: c.id, label: c.label, count: c.images.length })),
    ],
    []
  );

  const images =
    active === "all"
      ? allGalleryImages
      : galleryCategories.find((c) => c.id === active)?.images ?? [];

  return (
    <div>
      {/* Filter tabs — sticky on sm+, horizontally scrollable on mobile */}
      <div className="sticky-services -mx-5 mb-8 flex items-center gap-2.5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {tabs.map((t) => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              aria-pressed={on}
              className={`group relative shrink-0 rounded-full border px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] transition-all duration-300 sm:px-5 sm:py-2.5 ${
                on
                  ? "border-gold bg-gold text-ink-deep"
                  : "border-line bg-surface text-ink-soft hover:border-gold/50 hover:text-gold"
              }`}
            >
              {t.label}
              <span className={`ml-2 text-[0.66rem] ${on ? "text-ink-deep/60" : "text-ink-mute"}`}>{t.count}</span>
            </button>
          );
        })}
        <span className="mono ml-auto hidden shrink-0 items-center pl-4 text-[0.66rem] text-ink-mute xl:flex">
          {images.length} frames · tap to enlarge
        </span>
      </div>

      {/* Animated grid swap */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <GalleryGrid images={images} columns={4} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
