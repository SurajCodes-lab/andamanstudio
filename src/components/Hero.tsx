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
  imageMobile,
  videoSrc,
  youtubeId,
  eyebrow,
  headline,
  intro,
  ctas = [],
}: {
  image: string;
  imageMobile?: string;
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
        {/* Mobile gets its own portrait-friendly still (no cropped video). */}
        <Image
          src={imageMobile || image}
          alt="Andaman Studio photography"
          fill
          preload
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          className="object-cover sm:hidden"
        />
        <Image
          src={image}
          alt="Andaman Studio photography"
          fill
          preload
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          className="hidden object-cover sm:block"
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
        {/* Video only from sm+ — on mobile a 16:9 YouTube frame crops badly, so we show the still image instead. */}
        {youtubeId && (
          <div className="absolute inset-0 hidden sm:block">
            <HeroVideo youtubeId={youtubeId} />
          </div>
        )}
      </motion.div>

      {/* Scroll-catcher — sits above the YouTube iframe so the player can
          never swallow the wheel/scroll. CTAs (z-10+) stay above this. */}
      <div aria-hidden className="absolute inset-0 z-[1]" />

      {/* Cinematic grade — light base keeps the footage visible; the dark backing
          is a localized corner gradient anchored to the lower-left where the copy
          sits, so the rest of the video (and its subject) stays clear. */}
      <div className="pointer-events-none absolute inset-0 bg-ink-deep/8" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(140% 100% at 55% 30%, transparent 50%, rgba(10,8,4,0.4) 100%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to top right, rgba(10,8,4,0.92) 0%, rgba(10,8,4,0.6) 20%, rgba(10,8,4,0.18) 42%, transparent 60%)" }}
      />

      {/* Minimal editorial frame brackets (no text) */}
      <span className="pointer-events-none absolute left-5 top-32 hidden h-6 w-6 border-l border-t border-white/25 sm:block sm:left-8" />
      <span className="pointer-events-none absolute right-5 top-32 hidden h-6 w-6 border-r border-t border-white/25 sm:block sm:right-8" />

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
                className="block whitespace-nowrap text-[clamp(2.25rem,5.5vw,4.75rem)] leading-[1.0]"
              >
                {line.em ? <span className="text-gold-soft">{line.text}</span> : line.text}
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

        {/* Social proof — above the fold, right beside the CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="mt-7 flex items-center gap-3 text-sm text-white/90"
        >
          <span className="text-gold-soft tracking-[0.1em]">★★★★★</span>
          <span><span className="font-semibold text-white">Rated 5.0</span> · 10,000+ travellers photographed · Havelock&apos;s highest-rated studio</span>
        </motion.div>

        {ctas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.8 }}
            className="mt-7 flex flex-col gap-4 sm:flex-row"
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

      {/* Minimal scroll cue (no text) */}
      <motion.div style={{ opacity: fade }} className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} className="text-lg text-white/50">↓</motion.span>
      </motion.div>
    </section>
  );
}
