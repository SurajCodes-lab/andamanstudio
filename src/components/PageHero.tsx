"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { BLUR } from "@/lib/blur";
import SubjectIcon, { type IconName } from "./SubjectIcon";

export default function PageHero({
  eyebrow,
  title,
  intro,
  image,
  height = "tall",
  icon,
  accent,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
  height?: "tall" | "short";
  icon?: IconName;
  accent?: string;
}) {
  const h = height === "tall" ? "h-[72svh] min-h-[460px]" : "h-[58svh] min-h-[420px] lg:h-[64svh]";
  return (
    <section data-hero className={`framed relative ${h} w-full overflow-hidden bg-sand`}>
      <div className="absolute inset-0">
        <Image
          src={image}
          alt=""
          fill
          preload
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          className="object-cover object-[50%_30%]"
        />
      </div>
      {/* Bright up top, soft graded foot for the copy */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-deep/35 via-transparent to-transparent" />
      {/* Subject colour-wash — gives each themed page its own atmosphere */}
      {accent && (
        <div
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{ background: `radial-gradient(100% 80% at 20% 100%, ${accent}88, transparent 60%)` }}
        />
      )}

      {/* Editorial frame brackets (sit below the fixed header) */}
      <span className="pointer-events-none absolute left-5 top-24 hidden h-6 w-6 border-l border-t border-white/30 sm:block sm:left-8" />
      <span className="pointer-events-none absolute right-5 top-24 hidden h-6 w-6 border-r border-t border-white/30 sm:block sm:right-8" />
      <span className="meta pointer-events-none absolute right-5 top-[6.5rem] hidden text-white/65 sm:block sm:right-16">11.98°N 93.00°E</span>

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col items-start justify-end px-5 pb-14 sm:px-8 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-5 flex items-center gap-3"
        >
          {icon ? (
            <span style={{ color: accent ?? "var(--gold-soft)" }}>
              <SubjectIcon name={icon} className="h-5 w-5" />
            </span>
          ) : (
            <span className="h-px w-8 bg-gold-soft" />
          )}
          <span className="text-[0.7rem] uppercase tracking-[0.32em] text-white/90">{eyebrow}</span>
        </motion.div>

        <h1 className="display overflow-hidden text-white">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="block text-5xl sm:text-7xl lg:text-[5rem]"
          >
            {title}
          </motion.span>
        </h1>

        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg"
          >
            {intro}
          </motion.p>
        )}
      </div>
    </section>
  );
}
