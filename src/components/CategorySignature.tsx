"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { FullCategory } from "@/data/categories";
import type { CategoryTheme } from "@/data/categoryThemes";
import { BLUR } from "@/lib/blur";
import Container from "./Container";
import ParallaxImage from "./ParallaxImage";
import KineticText from "./KineticText";
import AerialStrip from "./AerialStrip";
import Reveal from "./Reveal";
import SubjectIcon from "./SubjectIcon";

// A distinct "signature" band per category — its own mood & layout.
export default function CategorySignature({
  category,
  theme,
}: {
  category: FullCategory;
  theme: CategoryTheme;
}) {
  const imgs = category.images.length ? category.images : [category.heroImage];

  /* ---- AERIAL (drone): black flight deck ---- */
  if (theme.signature === "aerial") {
    return <AerialStrip images={imgs.slice(0, 6)} href={`/${category.serviceSlugs[0] ?? ""}`} />;
  }

  /* ---- ROMANTIC (pre/post wedding): warm, cinematic, love-story ---- */
  if (theme.signature === "romantic") {
    return (
      <section className="relative overflow-hidden bg-ink-deep py-28 text-on-deep sm:py-36">
        <div className="glow glow-gold left-[10%] top-0 h-[34rem] w-[34rem] opacity-20" />
        <div className="glow glow-gold right-[5%] bottom-0 h-[28rem] w-[28rem] opacity-15" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="meta inline-flex items-center gap-2 text-gold-soft"><SubjectIcon name={theme.icon} className="h-4 w-4" />{theme.kicker}</span>
            <h2 className="display mt-5 text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] text-white">
              <KineticText text="Two of you," />
              <br />
              <KineticText text="one timeless film." className="text-gold-soft" />
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-on-deep/70">{category.longDescription}</p>
          </div>
          <div className="mt-14 grid items-center gap-6 lg:grid-cols-3">
            <Reveal className="lg:col-span-1">
              <ParallaxImage src={imgs[0]} alt={category.title} className="aspect-[3/4]" sizes="33vw" frame caption="PRE-WEDDING · 50MM" />
            </Reveal>
            <Reveal className="lg:col-span-1" delay={0.1}>
              <ParallaxImage src={imgs[1] ?? imgs[0]} alt={category.title} className="aspect-[3/4] lg:-translate-y-8" sizes="33vw" amount={70} />
            </Reveal>
            <Reveal className="lg:col-span-1" delay={0.2}>
              <ParallaxImage src={imgs[2] ?? imgs[0]} alt={category.title} className="aspect-[3/4]" sizes="33vw" frame caption="POST-WEDDING · ƒ/2.0" />
            </Reveal>
          </div>
        </Container>
      </section>
    );
  }

  /* ---- INTIMATE (candle-light): dark, gold candle glow ---- */
  if (theme.signature === "intimate") {
    return (
      <section className="relative overflow-hidden bg-ink-deep py-28 text-on-deep sm:py-36">
        <div className="glow glow-gold left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-30" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <span className="meta inline-flex items-center gap-2 text-gold-soft"><SubjectIcon name={theme.icon} className="h-4 w-4" />{theme.kicker}</span>
            <h2 className="display mt-5 text-[clamp(2.5rem,6vw,5rem)] leading-[0.96] text-white">
              {theme.tagline}
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-on-deep/70">{category.longDescription}</p>
          </div>
          <Reveal>
            <div className="relative mx-auto mt-14 max-w-3xl">
              <ParallaxImage src={imgs[0]} alt={category.title} className="aspect-[16/9]" sizes="(max-width:1024px) 100vw, 60vw" frame caption="CANDLE-LIGHT · ƒ/1.8 · ISO 800" />
            </div>
          </Reveal>
        </Container>
      </section>
    );
  }

  /* ---- DRAMATIC (kalapathar): stark full-bleed, high contrast ---- */
  if (theme.signature === "dramatic") {
    return (
      <section className="relative h-[86svh] min-h-[520px] w-full overflow-hidden">
        <Image src={imgs[0]} alt={category.title} fill sizes="100vw" placeholder="blur" blurDataURL={BLUR} className="object-cover object-[50%_30%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/90 via-ink-deep/20 to-ink-deep/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-deep/60 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-[10vh] sm:px-8">
          <span className="meta mb-4 inline-flex items-center gap-2 text-white/75"><SubjectIcon name={theme.icon} className="h-4 w-4" />{theme.kicker}</span>
          <h2 className="display max-w-[14ch] text-[clamp(2.75rem,7vw,6rem)] leading-[0.92] text-white">
            {theme.tagline}
          </h2>
        </div>
      </section>
    );
  }

  /* ---- ARCHITECTURAL (property): clean structured grid ---- */
  if (theme.signature === "architectural") {
    return (
      <section className="bg-ink-deep py-24 text-on-deep sm:py-32">
        <Container>
          <div className="mb-12 border-t border-line pt-6">
            <span className="meta inline-flex items-center gap-2 text-gold"><SubjectIcon name={theme.icon} className="h-4 w-4" />{theme.kicker}</span>
            <h2 className="display mt-3 text-[clamp(2rem,4.5vw,3.5rem)] text-white">{theme.tagline}</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {imgs.slice(0, 6).map((src, i) => (
              <motion.figure
                key={src + i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.07 }}
                className="group relative aspect-[4/3] overflow-hidden"
              >
                <Image src={src} alt={category.title} fill sizes="33vw" placeholder="blur" blurDataURL={BLUR} className="img-zoom object-cover" />
                <span className="meta absolute bottom-2 left-2 text-white/0 transition-colors duration-300 group-hover:text-white/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.figure>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  /* ---- EDITORIAL (photoshoot, default): bright varied bento ---- */
  return (
    <section className="bg-ink-deep py-24 text-on-deep sm:py-32">
      <Container>
        <div className="mb-12 max-w-2xl">
          <span className="meta inline-flex items-center gap-2 text-gold"><SubjectIcon name={theme.icon} className="h-4 w-4" />{theme.kicker}</span>
          <h2 className="display mt-3 text-[clamp(2rem,4.5vw,3.5rem)] text-white">{theme.tagline}</h2>
          <p className="mt-4 max-w-xl text-on-deep/65">{category.longDescription}</p>
        </div>
        <div className="grid auto-rows-[13rem] grid-cols-2 gap-3 sm:auto-rows-[16rem] lg:grid-cols-12">
          {imgs.slice(0, 5).map((src, i) => {
            const span = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"][i];
            return (
              <motion.figure
                key={src + i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.06 }}
                className={`group relative overflow-hidden ${span}`}
              >
                <Image src={src} alt={category.title} fill sizes="50vw" placeholder="blur" blurDataURL={BLUR} className="img-zoom object-cover" />
              </motion.figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
