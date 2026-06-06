import Link from "next/link";
import Image from "next/image";
import { BLUR } from "@/lib/blur";
import { altFromSrc } from "@/lib/alt";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import ParallaxImage from "@/components/ParallaxImage";
import ServiceCard from "@/components/ServiceCard";
import FullBleedPanels from "@/components/FullBleedPanels";
import ScrollGallery from "@/components/ScrollGallery";
import AerialStrip from "@/components/AerialStrip";
import VideoReel from "@/components/VideoReel";
import KineticText from "@/components/KineticText";
import RevealWords from "@/components/RevealWords";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import TrustStrip from "@/components/TrustStrip";
import SectionRail from "@/components/SectionRail";
import { services } from "@/data/services";
import { catalog, formatINR } from "@/data/catalog";
import { getFullCategory } from "@/data/categories";
import { site, whatsappLink, telLink } from "@/data/site";

const beachPanel = [
  {
    image: "/img/beach/honeymoon-couple-andaman-islands-shoot.webp",
    label: "Beach Portraits",
    sub: "Golden-hour portraits on Asia's finest white sand at Radhanagar.",
    meta: "02 — Radhanagar · 35mm · ƒ/2.0",
    href: "/andaman-beach-photoshoot",
    pos: "object-[50%_35%]",
  },
];

const sunsetFrames = [
  { image: "/img/sunset/best-sunset-photography-in-andaman-islands.webp", label: "Golden Hour", sub: "Radhanagar" },
  { image: "/img/sunset/couple-sunset-shoot-havelock-island.webp", label: "Silhouettes", sub: "ƒ/2.0" },
  { image: "/img/sunset/havelock-island-radhanagar-beach-sunset-shoot.webp", label: "Kalapathar", sub: "Black rocks" },
  { image: "/img/sunset/perfect-sunset-shoots-at-havelock.webp", label: "Beach No.5", sub: "Last light" },
  { image: "/img/sunset/radhanagar-beach-candid-sunset-photoshoot.webp", label: "Candid", sub: "Golden" },
];

const aerial = [
  "/img/drone-shoot-andaman-islands.webp",
  "/img/sunset/havelock-island-radhanagar-beach-sunset-shoot.webp",
  "/img/beach/best-beach-photoshoot-in-havelock.webp",
  "/img/sunset/best-sunset-photography-in-andaman-islands.webp",
  "/img/beach/best-beach-side-photoshoot-in-havelock.webp",
];

const teaser = [
  "/img/beach/best-beach-photoshoot-in-havelock.webp",
  "/img/sunset/best-sunset-couple-shoot-in-andaman.webp",
  "/img/forest/best-forest-shoot-at-havelock.webp",
  "/img/candid/best-candid-photography-in-andaman.webp",
  "/img/cld/candle-light-dinner-photoshoot-in-andaman.webp",
  "/img/post-wedding/premium-post-wedding-shoots.webp",
  "/img/beach/couple-poses-for-photoshoot-in-andaman.webp",
  "/img/sunset/sunset-photoshoot-havelock-island.webp",
  "/img/property/resort-photography-for-couples.webp",
  "/img/bday/best-birthday-shoot-in-andaman.webp",
  "/img/candid/honeymoon-couple-candid-photography.webp",
  "/img/forest/couple-forest-photoshoot-in-andaman.webp",
];

// 8-item editorial bento — a tall 2-row anchor + gap-free rows.
const HOME_BENTO = [
  "lg:col-span-6 lg:row-span-2", "lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-4", "lg:col-span-4", "lg:col-span-4",
  "lg:col-span-6", "lg:col-span-6",
];

export default function Home() {
  const films = getFullCategory("pre-post-wedding")?.videoIds ?? [];

  return (
    <>
      <Hero
        image="/img/beach/best-beach-side-photoshoot-in-havelock.webp"
        youtubeId={site.heroVideoId}
        eyebrow={`${site.tagline} · Andaman Islands`}
        headline={[
          { text: "Your story," },
          { text: "beautifully", em: true },
          { text: "captured." },
        ]}
        intro="Photographers, videographers & editors crafting timeless beach, sunset and cinematic films across Havelock Island."
        ctas={[
          { label: "Book a shoot", href: whatsappLink(), external: true, primary: true },
          { label: "View the gallery", href: "/gallery" },
        ]}
      />

      <SectionRail
        items={[
          { id: "intro", label: "Intro" },
          { id: "beach", label: "Beach" },
          { id: "sunset", label: "Sunset" },
          { id: "drone", label: "Drone" },
          { id: "dinner", label: "Dinner" },
          { id: "forest", label: "Forest" },
          { id: "sessions", label: "Sessions" },
          { id: "films", label: "Films" },
          { id: "gallery-teaser", label: "Gallery" },
          { id: "pricing", label: "Pricing" },
        ]}
      />

      <Marquee />

      <TrustStrip />

      {/* 01 — Statement: type-forward editorial manifesto */}
      <section id="intro" className="sec-paper relative overflow-hidden py-24 sm:py-36">
        <span className="index-numeral pointer-events-none absolute -right-3 top-6 hidden text-[15rem] opacity-50 lg:block">01</span>
        <Container className="relative">
          <div className="mb-7 flex items-center gap-3">
            <span className="mono text-gold text-[0.72rem]">01 / 10</span>
            <span className="h-px w-10 bg-ink/25" />
            <span className="eyebrow">Est. Havelock Island</span>
          </div>
          <h2 className="display max-w-[15ch] text-[clamp(2.5rem,7vw,6rem)] leading-[0.98] tracking-[-0.02em] text-ink">
            <KineticText text="A collective devoted to " />
            <KineticText text="island stories." className="text-gradient italic" />
          </h2>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-ink-soft max-w-[46ch] text-lg leading-relaxed">
                We are photographers, videographers and editors who came together to capture moments
                from your journey across the Andaman Islands — high-end kit, a top edit team, and an
                eye for the cinematic.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-line pt-8">
                {[
                  { v: site.stat.value, l: site.stat.label },
                  { v: "Havelock", l: "Island crew" },
                  { v: "3–5 days", l: "Delivery" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="font-serif text-gold text-3xl sm:text-4xl">{s.v}</p>
                    <p className="text-ink-mute mt-1 text-[0.68rem] uppercase tracking-[0.16em]">{s.l}</p>
                  </div>
                ))}
                <Link href="/about" className="link-underline ml-auto text-sm uppercase tracking-[0.18em] text-ink">
                  Our story →
                </Link>
              </div>
            </div>
            <Reveal direction="left">
              <ParallaxImage src="/img/beach/honeymoon-couple-beach-photoshoot.webp" alt="Beach photoshoot" className="aspect-[16/11] shadow-[0_40px_90px_-50px_rgba(0,0,0,0.6)]" sizes="(max-width:1024px) 100vw, 55vw" amount={55} frame caption="RADHANAGAR · 35MM" />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 02 — Beach: full-bleed immersive */}
      <div id="beach"><FullBleedPanels panels={beachPanel} /></div>

      {/* 03 — Sunset: horizontal pinned scroll gallery */}
      <div id="sunset"><ScrollGallery frames={sunsetFrames} eyebrow="03 — Golden hour" title="Sunset sessions." /></div>

      {/* 04 — Drone: aerial flight deck */}
      <div id="drone"><AerialStrip images={aerial} /></div>

      {/* 05 — Candle-light: intimate, after dark */}
      <section id="dinner" className="relative overflow-hidden bg-ink-deep py-28 text-on-deep sm:py-36">
        <div className="glow glow-gold left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-25" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <span className="meta text-gold-soft">05 — After dark</span>
            <h2 className="display mt-4 text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-white">
              Candle-light dinners <em className="font-serif italic text-gold-soft">by the sea.</em>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-on-deep/70">
              On the pristine shores of the Andamans, our premium team crafts an unforgettable
              candlelight dinner — luxury, romance and island serenity in every frame.
            </p>
          </div>
          <Reveal>
            <div className="relative mx-auto mt-14 max-w-3xl">
              <ParallaxImage src="/img/cld/professional-candle-light-dinner-shoot.webp" alt="Candle-light dinner" className="aspect-[16/10]" sizes="(max-width:1024px) 100vw, 60vw" frame caption="CANDLE-LIGHT · ƒ/1.8 · ISO 800" />
              <div className="glass ctx-light absolute -bottom-5 left-6 rounded-2xl px-5 py-3">
                <p className="font-serif text-xl text-ink">From {formatINR(4000)}</p>
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-ink-mute">Candle-light</p>
              </div>
            </div>
          </Reveal>
          <div className="mt-12 text-center">
            <Link href="/candle-light-dinner-shoot-in-andaman" className="inline-flex items-center gap-3 rounded-full bg-gold px-8 py-3.5 text-sm uppercase tracking-[0.16em] text-ink-deep transition-colors duration-300 hover:bg-gold-soft">
              Explore the experience →
            </Link>
          </div>
        </Container>
      </section>

      {/* 06 — Forest: overlapping editorial */}
      <section id="forest" className="sec-paper relative overflow-hidden py-24 sm:py-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal direction="right">
              <div className="relative">
                <span className="index-numeral pointer-events-none absolute -left-4 -top-16 hidden text-[11rem] lg:block">06</span>
                <ParallaxImage src="/img/forest/honeymoon-couple-forest-shoot-andaman-islands.webp" alt="Forest shoot" className="aspect-[4/5]" sizes="(max-width:1024px) 100vw, 45vw" frame caption="FOREST · 35MM" />
                <div className="absolute -bottom-10 -right-4 hidden w-1/2 sm:block">
                  <ParallaxImage src="/img/forest/best-forest-shoot-at-havelock.webp" alt="Forest canopy" className="aspect-square shadow-[0_30px_70px_-40px_rgba(0,0,0,0.6)]" sizes="25vw" amount={50} />
                </div>
              </div>
            </Reveal>
            <div className="lg:pl-10">
              <span className="meta text-gold">06 — Into the green</span>
              <h2 className="display text-ink mt-4 text-[clamp(2.25rem,5vw,4rem)] leading-[0.98]">
                <KineticText text="Forest shoots, " />
                <KineticText text="cool & cinematic." className="italic text-gold" />
              </h2>
              <p className="text-ink-soft mt-6 max-w-md leading-relaxed">
                A short walk from the sand, the green canopy gives dramatic, intimate frames with
                rich natural depth.
              </p>
              <Link href="/forest-shoot-havelock-island" className="link-underline mt-8 inline-block text-sm uppercase tracking-[0.18em] text-ink">
                Explore forest shoots →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 07 — All sessions grid */}
      <section id="sessions" className="sec-ivory py-24 sm:py-32">
        <Container>
          <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading index="07" eyebrow="Every session" title={<>Twelve ways to remember <span className="text-gradient">the islands.</span></>} />
            <Reveal delay={0.1}>
              <Link href="/services" className="link-underline shrink-0 text-sm uppercase tracking-[0.18em] text-ink">
                All 12 services →
              </Link>
            </Reveal>
          </div>
          <div className="grid auto-rows-[14rem] grid-cols-2 gap-4 sm:auto-rows-[16rem] lg:grid-cols-12">
            {services.slice(0, 8).map((s, i) => (
              <div key={s.slug} className={HOME_BENTO[i]}>
                <ServiceCard service={s} index={i} big={i === 0} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mid-page booking nudge */}
      <section className="bg-ink-deep-2 py-14 sm:py-16">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-gold/30 bg-ink-deep px-8 py-10 text-center sm:flex-row sm:text-left">
            <div>
              <span className="meta text-gold">Ready when you are</span>
              <h3 className="display mt-2 text-2xl text-white sm:text-3xl">Let&apos;s capture your island story.</h3>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-syne rounded-full bg-gold px-7 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-ink-deep transition-colors hover:bg-gold-soft">
                Book on WhatsApp →
              </a>
              <a href={telLink} className="mono text-sm text-on-deep/80 transition-colors hover:text-gold">{site.phones[0]}</a>
            </div>
          </div>
        </Container>
      </section>

      {/* 08 — Cinematic films */}
      {films.length > 0 && (
        <section id="films" className="relative overflow-hidden bg-ink-deep py-24 text-on-deep sm:py-32">
          <Container>
            <div className="mb-12">
              <span className="meta text-gold-soft">08 — Pre / Post wedding</span>
              <h2 className="display mt-3 text-[clamp(2.25rem,5vw,4rem)] text-white"><RevealWords text="Cinematic films." /></h2>
              <p className="mt-4 max-w-xl text-on-deep/70">
                Gimbal-shot, colour-graded and scored — a look at how we move on the islands.
              </p>
            </div>
            <VideoReel ids={films} />
          </Container>
        </section>
      )}

      {/* 09 — Gallery teaser: asymmetric collage */}
      <section id="gallery-teaser" className="sec-ivory overflow-hidden py-24 sm:py-36">
        <Container>
          <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="meta text-gold">09 — Selected frames</span>
              <h2 className="display mt-3 text-[clamp(2.25rem,5vw,4rem)] text-ink">
                A reel of <span className="text-gradient italic">the islands.</span>
              </h2>
            </div>
            <Link href="/gallery" className="link-underline shrink-0 text-sm uppercase tracking-[0.18em] text-ink">
              Open the gallery →
            </Link>
          </div>
          <div className="grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:grid-cols-12 sm:gap-4">
            {[
              { src: teaser[0], cls: "col-span-2 row-span-2 sm:col-span-6" },
              { src: teaser[1], cls: "sm:col-span-3" },
              { src: teaser[3], cls: "sm:col-span-3" },
              { src: teaser[5], cls: "sm:col-span-3" },
              { src: teaser[7], cls: "sm:col-span-3" },
            ].map((it, i) => (
              <Link key={i} href="/gallery" className={`group relative overflow-hidden ${it.cls}`}>
                <Image src={it.src} alt={altFromSrc(it.src)} fill sizes="(max-width:640px) 50vw, 33vw" placeholder="blur" blurDataURL={BLUR} className="img-zoom object-cover" />
                <span className="absolute inset-0 bg-ink-deep/0 transition-colors duration-500 group-hover:bg-ink-deep/20" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 10 — Packages: the price index (bold editorial menu) */}
      <section id="pricing" className="bg-ink-deep py-24 text-on-deep sm:py-36">
        <Container>
          <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="meta text-gold">10 — Transparent pricing</span>
              <h2 className="display mt-3 text-[clamp(2.25rem,5vw,4rem)] text-white"><RevealWords text="The price index." /></h2>
            </div>
            <Link href="/packages" className="link-underline shrink-0 text-sm uppercase tracking-[0.18em] text-gold">
              View all packages →
            </Link>
          </div>
          <div className="border-t border-line">
            {catalog.map((c, i) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className="group flex items-baseline justify-between gap-5 border-b border-line py-5 sm:py-7"
              >
                <span className="flex items-baseline gap-4 sm:gap-7">
                  <span className="mono text-gold text-xs sm:text-sm">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-2xl leading-none text-on-deep transition-colors duration-300 group-hover:text-gold sm:text-4xl lg:text-5xl">
                    {c.title}
                  </span>
                </span>
                <span className="shrink-0 font-serif text-lg text-gold-soft sm:text-2xl">
                  from {formatINR(Math.min(...c.products.map((p) => p.price)))}
                  <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1 sm:ml-4">→</span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <Testimonials />

      <CTASection />
    </>
  );
}
