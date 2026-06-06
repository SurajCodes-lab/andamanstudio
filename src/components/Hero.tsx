"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { BLUR } from "@/lib/blur";
import Magnetic from "./Magnetic";
import HeroVideo from "./HeroVideo";

type CTA = { label: string; href: string; external?: boolean; primary?: boolean };

export default function Hero({
  image,
  videoSrc,
  youtubeId,
  eyebrow,
  headline,
  intro,
  ctas = [],
}: {
  image: string;
  videoSrc?: string;
  youtubeId?: string;
  eyebrow?: string;
  headline: { text: string; em?: boolean }[];
  intro?: string;
  ctas?: CTA[];
}) {
  const ref = useRef<HTMLElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      data-hero
      className="relative h-svh min-h-[600px] w-full overflow-hidden bg-sand"
    >
      {/* Bright full-bleed photo — the foundation */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={image}
          alt="Andaman Studio photography"
          fill
          preload
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          className="object-cover"
        />
        {videoSrc && (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setVideoReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {youtubeId && <HeroVideo youtubeId={youtubeId} />}
      </motion.div>

      {/* Scroll-catcher — sits above the YouTube iframe so the player can
          never swallow the wheel/scroll. CTAs (z-10+) stay above this. */}
      <div aria-hidden className="absolute inset-0 z-[1]" />

      {/* Cinematic grade — vignette + veil keep the footage rich while
          subduing any branding/title-cards inside the reel */}
      <div className="pointer-events-none absolute inset-0 bg-ink-deep/25" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(125% 90% at 50% 38%, transparent 28%, rgba(10,8,4,0.7) 100%)" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-deep/95 via-ink-deep/45 to-ink-deep/15" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-deep/60 via-transparent to-transparent" />

      {/* Editorial meta-bar + frame brackets */}
      <motion.div
        style={{ opacity: fade }}
        className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden items-center justify-between px-5 pt-24 sm:flex sm:px-8"
      >
        <span className="meta text-white/70">Est. Havelock · Andaman Islands</span>
        <span className="meta text-white/70">11.98°N 93.00°E · 4K · 24FPS</span>
      </motion.div>
      <span className="pointer-events-none absolute left-5 top-32 hidden h-6 w-6 border-l border-t border-white/30 sm:block sm:left-8" />
      <span className="pointer-events-none absolute right-5 top-32 hidden h-6 w-6 border-r border-t border-white/30 sm:block sm:right-8" />
      <span className="v-label pointer-events-none absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 text-white/50 lg:block">
        Andaman Studio — Showreel
      </span>

      {/* Copy — editorial, lower-left */}
      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-[13vh] sm:px-8"
      >
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-gold-soft" />
            <span className="text-[0.72rem] uppercase tracking-[0.32em] text-white/90">{eyebrow}</span>
          </motion.div>
        )}

        <h1 className="display text-white">
          {headline.map((line, i) => (
            <span key={line.text} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.45 + i * 0.13, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="block whitespace-nowrap text-[clamp(2.75rem,8vw,7rem)] leading-[0.98]"
              >
                {line.em ? (
                  <em className="font-serif italic text-gold-soft">{line.text}</em>
                ) : (
                  line.text
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.8 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg"
          >
            {intro}
          </motion.p>
        )}

        {ctas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.8 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            {ctas.map((cta) =>
              cta.external ? (
                <Magnetic key={cta.label}>
                  <a
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      cta.primary
                        ? "inline-block bg-gold px-8 py-3.5 text-sm uppercase tracking-[0.16em] text-ink-deep transition-colors duration-300 hover:bg-gold-soft"
                        : "inline-block border border-white/45 px-8 py-3.5 text-sm uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-white hover:text-ink"
                    }
                  >
                    {cta.label}
                  </a>
                </Magnetic>
              ) : (
                <Magnetic key={cta.label}>
                  <Link
                    href={cta.href}
                    className={
                      cta.primary
                        ? "inline-block bg-gold px-8 py-3.5 text-sm uppercase tracking-[0.16em] text-ink-deep transition-colors duration-300 hover:bg-gold-soft"
                        : "inline-block border border-white/45 px-8 py-3.5 text-sm uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-white hover:text-ink"
                    }
                  >
                    {cta.label}
                  </Link>
                </Magnetic>
              )
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Modern bottom utility bar */}
      <motion.div style={{ opacity: fade }} className="absolute inset-x-0 bottom-0 z-10 border-t border-white/15 backdrop-blur-[2px]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <span className="meta flex items-center gap-2 text-white/75">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gold" /> Showreel · REC
          </span>
          <span className="meta hidden text-white/55 md:block">Cinematic photography &amp; film · Havelock Island</span>
          <span className="meta flex items-center gap-2 text-white/75">
            Scroll
            <motion.span animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>↓</motion.span>
          </span>
        </div>
      </motion.div>
    </section>
  );
}
