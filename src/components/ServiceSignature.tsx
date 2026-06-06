"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Service } from "@/data/services";
import type { ServiceTheme } from "@/data/serviceThemes";
import { BLUR } from "@/lib/blur";
import Container from "./Container";
import ParallaxImage from "./ParallaxImage";
import KineticText from "./KineticText";
import Reveal from "./Reveal";
import AerialStrip from "./AerialStrip";
import SubjectIcon from "./SubjectIcon";

// One distinct "signature" band per service, tinted by its subject accent.
export default function ServiceSignature({
  service,
  theme,
}: {
  service: Service;
  theme: ServiceTheme;
}) {
  const imgs = service.gallery.length ? service.gallery : [service.heroImage];
  const Glow = ({ cls, op = 0.22 }: { cls: string; op?: number }) => (
    <div className={`pointer-events-none absolute rounded-full blur-[90px] ${cls}`} style={{ background: theme.accent, opacity: op }} />
  );
  const Kicker = () => (
    <span className="meta inline-flex items-center gap-2" style={{ color: theme.accent }}>
      <SubjectIcon name={theme.icon} className="h-4 w-4" />
      {theme.kicker}
    </span>
  );
  const Motif = ({ cls }: { cls: string }) => (
    <span className={`pointer-events-none absolute opacity-[0.06] ${cls}`} style={{ color: theme.accent }}>
      <SubjectIcon name={theme.icon} className="h-full w-full" strokeWidth={0.7} />
    </span>
  );

  if (theme.layout === "aerial") {
    return <AerialStrip images={imgs.slice(0, 6)} href={`/${service.slug}`} />;
  }

  /* LUSH — forest: overlapping greenery */
  if (theme.layout === "lush") {
    return (
      <section className="relative overflow-hidden bg-ink-deep py-20 text-on-deep sm:py-28 lg:py-36">
        <Glow cls="left-[-6rem] top-10 h-72 w-72 sm:h-96 sm:w-96" />
        <Motif cls="right-6 top-12 h-32 w-32 sm:h-48 sm:w-48" />
        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="relative">
              <ParallaxImage src={imgs[0]} alt={service.title} className="aspect-[4/5]" sizes="(max-width:1024px) 90vw, 45vw" frame caption="FOREST · 35MM" />
              <div className="absolute -bottom-8 -right-3 hidden w-1/2 sm:block">
                <ParallaxImage src={imgs[1] ?? imgs[0]} alt="" className="aspect-square shadow-[0_30px_70px_-40px_rgba(0,0,0,0.6)]" sizes="25vw" amount={50} />
              </div>
            </div>
            <div className="lg:pl-10">
              <Kicker />
              <h2 className="display mt-4 text-[clamp(2rem,5vw,4rem)] leading-[1] text-white">
                <KineticText text={theme.tagline} />
              </h2>
              <p className="mt-6 max-w-md text-on-deep/70">{service.intro}</p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  /* IMMERSIVE / DRAMATIC — beach, sunset, kalapathar: full-bleed */
  if (theme.layout === "immersive" || theme.layout === "dramatic") {
    return (
      <section className="relative h-[70svh] min-h-[420px] w-full overflow-hidden sm:h-[80svh]">
        <Image src={imgs[0]} alt={service.title} fill sizes="100vw" placeholder="blur" blurDataURL={BLUR} className="object-cover object-[50%_30%]" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,8,4,0.92), transparent 55%)" }} />
        <div className="absolute inset-0 mix-blend-soft-light" style={{ background: `radial-gradient(80% 60% at 20% 90%, ${theme.accent}55, transparent 60%)` }} />
        <Motif cls="right-5 top-24 z-10 h-28 w-28 !opacity-50 sm:right-10 sm:h-40 sm:w-40" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-[9vh] sm:px-8">
          <span className="mb-3 block"><Kicker /></span>
          <h2 className="display max-w-[16ch] text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] text-white">{theme.tagline}</h2>
        </div>
      </section>
    );
  }

  /* CANDID — candid, birthday: scattered tilted frames */
  if (theme.layout === "candid") {
    return (
      <section className="relative overflow-hidden bg-ink-deep py-20 text-on-deep sm:py-28 lg:py-36">
        <Glow cls="right-[-4rem] top-0 h-64 w-64 sm:h-80 sm:w-80" />
        <Container className="relative">
          <div className="mx-auto mb-10 max-w-xl text-center sm:mb-14">
            <span className="meta" style={{ color: theme.accent }}>{theme.kicker}</span>
            <h2 className="display mt-4 text-[clamp(2rem,5vw,4rem)] text-white">{theme.tagline}</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            {imgs.slice(0, 5).map((src, i) => (
              <motion.figure
                key={src + i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="relative h-48 w-36 shrink-0 overflow-hidden sm:h-64 sm:w-52"
                style={{ transform: `rotate(${(i % 2 ? 1 : -1) * (2 + i)}deg)` }}
              >
                <Image src={src} alt="" fill sizes="(max-width:640px) 40vw, 20vw" placeholder="blur" blurDataURL={BLUR} className="object-cover" />
              </motion.figure>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  /* FILM — cinematic, memory, wedding: letterboxed */
  if (theme.layout === "film") {
    return (
      <section className="relative overflow-hidden bg-ink-deep py-20 text-on-deep sm:py-28 lg:py-32">
        <Glow cls="left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 sm:h-[36rem] sm:w-[36rem]" op={0.16} />
        <Container className="relative">
          <div className="mb-6 flex items-center justify-between sm:mb-8">
            <Kicker />
            <span className="meta hidden text-on-deep/55 sm:block">CINE · 24FPS</span>
          </div>
          <div className="relative aspect-video w-full overflow-hidden sm:aspect-[21/9]">
            <Image src={imgs[0]} alt={service.title} fill sizes="100vw" placeholder="blur" blurDataURL={BLUR} className="object-cover" />
            <div className="absolute inset-x-0 top-0 h-[8%] bg-black/70" />
            <div className="absolute inset-x-0 bottom-0 h-[8%] bg-black/70" />
          </div>
          <h2 className="display mt-7 text-[clamp(2rem,5vw,4rem)] text-white">
            <KineticText text={theme.tagline} />
          </h2>
        </Container>
      </section>
    );
  }

  /* INTIMATE — candle-light */
  if (theme.layout === "intimate") {
    return (
      <section className="relative overflow-hidden bg-ink-deep py-20 text-on-deep sm:py-28 lg:py-36">
        <Glow cls="left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 sm:h-[40rem] sm:w-[40rem]" op={0.3} />
        <Motif cls="left-1/2 top-10 h-16 w-16 -translate-x-1/2 !opacity-40" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <span className="meta" style={{ color: theme.accent }}>{theme.kicker}</span>
            <h2 className="display mt-4 text-[clamp(2.25rem,6vw,5rem)] text-white">{theme.tagline}</h2>
            <p className="mx-auto mt-6 max-w-lg text-on-deep/70">{service.intro}</p>
          </div>
          <Reveal>
            <div className="relative mx-auto mt-12 max-w-3xl">
              <ParallaxImage src={imgs[0]} alt={service.title} className="aspect-[16/10] sm:aspect-[16/9]" sizes="(max-width:1024px) 100vw, 60vw" frame caption="CANDLE-LIGHT · ƒ/1.8" />
            </div>
          </Reveal>
        </Container>
      </section>
    );
  }

  /* ARCHITECTURAL — property */
  return (
    <section className="bg-ink-deep py-20 text-on-deep sm:py-28 lg:py-32">
      <Container>
        <div className="mb-8 border-t border-line pt-6 sm:mb-10">
          <span className="meta" style={{ color: theme.accent }}>{theme.kicker}</span>
          <h2 className="display mt-3 text-[clamp(1.85rem,4.5vw,3.5rem)] text-white">{theme.tagline}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {imgs.slice(0, 6).map((src, i) => (
            <figure key={src + i} className="group relative aspect-[4/3] overflow-hidden">
              <Image src={src} alt="" fill sizes="(max-width:640px) 50vw, 33vw" placeholder="blur" blurDataURL={BLUR} className="img-zoom object-cover" />
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
