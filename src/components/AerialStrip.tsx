"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import KineticText from "./KineticText";
import { BLUR } from "@/lib/blur";
import { altFromSrc } from "@/lib/alt";

// Drone category, shown its OWN way: a black letterboxed "flight deck" with a
// self-scrolling strip of aerial frames, crosshair reticle and flight metadata.
export default function AerialStrip({
  images,
  href = "/drone-shoot-in-andaman",
}: {
  images: string[];
  href?: string;
}) {
  const row = [...images, ...images];
  return (
    <section className="relative overflow-hidden bg-ink-deep py-16 text-on-deep sm:py-32">
      {/* letterbox bars */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-black/60" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-black/60" />

      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="meta text-gold-soft">04 — Drone · Aerial cinematography</span>
          <span className="meta hidden text-on-deep/55 sm:block">ALT 120M · 4K · 24FPS · 11.98°N</span>
        </div>
        <h2 className="display text-[clamp(2.75rem,7vw,6rem)] leading-[0.92] text-white">
          <KineticText text="The islands," />
          <br />
          <KineticText text="from above." className="text-gold-soft" />
        </h2>
        <p className="mt-6 max-w-xl text-on-deep/70">
          Sweeping aerial reels of the coastline, forest and turquoise shallows — every RAW file shared with you.
        </p>
      </div>

      {/* self-scrolling aerial strip */}
      <div className="relative mt-12">
        <div className="flex w-max animate-marquee gap-5">
          {row.map((src, i) => (
            <figure
              key={src + i}
              className="group relative h-[34vh] min-h-[230px] w-[58vw] shrink-0 overflow-hidden sm:w-[40vw] lg:w-[30vw]"
            >
              <Image src={src} alt={altFromSrc(src)} fill sizes="40vw" placeholder="blur" blurDataURL={BLUR} className="object-cover" />
              {/* crosshair reticle */}
              <span className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40" />
              <span className="pointer-events-none absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-white/40" />
              <span className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-white/40" />
              <span className="meta absolute bottom-3 left-3 text-white/70">REC ●</span>
            </figure>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1600px] px-5 sm:px-8">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Link href={href} className="link-underline text-sm uppercase tracking-[0.18em] text-gold-soft">
            Explore drone shoots →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
