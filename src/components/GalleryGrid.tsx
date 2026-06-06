"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BLUR } from "@/lib/blur";
import { altFromSrc } from "@/lib/alt";

export default function GalleryGrid({
  images,
  columns = 3,
}: {
  images: string[];
  columns?: 2 | 3 | 4;
}) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, next, prev]);

  const colClass =
    columns === 4 ? "sm:columns-3 lg:columns-4 2xl:columns-5" : columns === 2 ? "sm:columns-2" : "sm:columns-2 lg:columns-3";

  return (
    <>
      <div className={`columns-1 gap-4 ${colClass}`}>
        {images.map((src, i) => (
          <motion.button
            key={src + i}
            onClick={() => setActive(i)}
            aria-label={`View larger: ${altFromSrc(src)}`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.05 }}
            className="group relative mb-4 block w-full overflow-hidden rounded-sm"
          >
            <Image
              src={src}
              alt={altFromSrc(src)}
              width={800}
              height={1000}
              sizes="(max-width: 768px) 100vw, 33vw"
              placeholder="blur"
              blurDataURL={BLUR}
              className="img-zoom h-auto w-full object-cover"
            />
            <span className="absolute inset-0 bg-ink-deep/0 transition-colors duration-500 group-hover:bg-ink-deep/25" />
            <span aria-hidden className="glass-dark absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              ⤢
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-deep/92 p-4 backdrop-blur-md"
          >
            <button onClick={close} aria-label="Close image viewer" className="absolute right-6 top-6 text-3xl text-white/80 hover:text-white">
              ✕
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-white/70 hover:text-white sm:left-10"
            >
              ‹
            </button>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[86svh] w-auto max-w-5xl"
            >
              <Image
                src={images[active]}
                alt={altFromSrc(images[active])}
                width={1400}
                height={1750}
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="max-h-[86svh] w-auto rounded-sm object-contain"
              />
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-white/70 hover:text-white sm:right-10"
            >
              ›
            </button>
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.2em] text-white/60">
              {active + 1} / {images.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
