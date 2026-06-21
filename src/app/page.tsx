import Link from "next/link";
import Image from "next/image";
import { BLUR } from "@/lib/blur";
import Hero from "@/components/Hero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import ServiceCard from "@/components/ServiceCard";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import ReviewsBar from "@/components/ReviewsBar";
import InstagramStrip from "@/components/InstagramStrip";
import EnquiryForm from "@/components/EnquiryForm";
import { formatINR } from "@/data/catalog";
import { getCategories, getServices, getTestimonials, getSlot, getSlots, getSite } from "@/lib/db/queries";

// 8-item editorial bento for the sessions grid.
const HOME_BENTO = [
  "lg:col-span-6 lg:row-span-2", "lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-4", "lg:col-span-4", "lg:col-span-4",
  "lg:col-span-6", "lg:col-span-6",
];

// Which teaser slots fill the gallery collage, and their grid spans.
const TEASER_GRID = [
  { i: 0, cls: "col-span-2 row-span-2 sm:col-span-6" },
  { i: 1, cls: "sm:col-span-3" },
  { i: 3, cls: "sm:col-span-3" },
  { i: 5, cls: "sm:col-span-3" },
  { i: 7, cls: "sm:col-span-3" },
];

export default async function Home() {
  const [categories, services, testimonials, heroImg, heroImgMobile, teaser, instagram, settings] = await Promise.all([
    getCategories(),
    getServices(),
    getTestimonials(),
    getSlot("home.hero"),
    getSlot("home.hero.mobile"),
    getSlots("home.teaser"),
    getSlots("home.instagram"),
    getSite(),
  ]);

  return (
    <>
      <Hero
        image={heroImg}
        imageMobile={heroImgMobile || undefined}
        youtubeId={settings.heroVideoId ?? undefined}
        eyebrow={`${settings.tagline} · Andaman Islands`}
        headline={[
          { text: "Your story," },
          { text: "beautifully" },
          { text: "captured." },
        ]}
        ctas={[
          { label: "Book a shoot", href: "/book", primary: true },
          { label: "View the gallery", href: "/gallery" },
        ]}
      />

      {/* Trust band — directly below the hero */}
      <ReviewsBar />

      {/* Crafted by experience — full-bleed credibility banner, directly below the stats */}
      <section className="bg-ink-deep pb-12 sm:pb-16">
        <Reveal>
          {/* Desktop / tablet */}
          <Image
            src="/crafted-by-experience-desktop.png"
            alt="Crafted by experience — by a team of seasoned visual storytellers"
            width={1324}
            height={272}
            sizes="100vw"
            className="hidden h-auto w-full sm:block"
          />
          {/* Mobile */}
          <Image
            src="/crafted-by-experience-mobile.png"
            alt="Crafted by experience — by a team of seasoned visual storytellers"
            width={1224}
            height={718}
            sizes="100vw"
            className="block h-auto w-full sm:hidden"
          />
        </Reveal>
      </section>

      {/* 02 — Packages & pricing */}
      <section id="packages" className="sec-paper py-16 sm:py-24">
        <Container>
          <div className="mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading
              index="01"
              eyebrow="Packages & pricing"
              title={<>Pick your <span className="text-gradient">island shoot.</span></>}
            />
            <Reveal delay={0.1}>
              <Link href="/packages" className="link-underline shrink-0 text-sm uppercase tracking-[0.18em] text-ink">
                Compare all packages →
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {categories.map((c) => {
              const prices = c.products.map((p) => p.price);
              const from = prices.length ? Math.min(...prices) : 0;
              return (
                <div
                  key={c.slug}
                  className="group flex flex-col overflow-hidden rounded-xl border border-line bg-ink-deep-2 transition-all duration-500 hover:border-gold/50"
                >
                  {/* Image on top — large & photo-forward (the studio's work is the hero) */}
                  <Link href={`/category/${c.slug}`} className="relative block aspect-[4/5] overflow-hidden sm:aspect-[4/3]" aria-label={`View ${c.title}`}>
                    <Image src={c.heroImage} alt={c.title} fill sizes="(max-width:768px) 50vw, 33vw" placeholder="blur" blurDataURL={BLUR} className="img-zoom object-cover" />
                  </Link>
                  {/* Compact info strip — minimal, so the image stays the hero */}
                  <div className="flex flex-1 flex-col p-2.5 sm:p-3.5">
                    <Link href={`/category/${c.slug}`} className="min-w-0">
                      <h3 className="truncate font-serif text-sm leading-tight text-on-deep transition-colors group-hover:text-gold sm:text-lg">{c.title}</h3>
                    </Link>
                    <p className="mt-0.5 flex items-baseline gap-1">
                      <span className="text-[0.55rem] uppercase tracking-[0.1em] text-on-deep/45">From</span>
                      <span className="font-serif text-lg font-semibold text-gold-soft sm:text-2xl">{formatINR(from)}</span>
                    </p>
                    <div className="mt-auto flex gap-2 pt-2.5">
                      <Link href={`/category/${c.slug}`} className="flex-1 rounded-full border border-line px-2 py-1.5 text-center text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-on-deep/80 transition-colors hover:border-gold hover:text-gold sm:text-[0.68rem]">View</Link>
                      <Link href="/book" className="flex-1 rounded-full bg-gold px-2 py-1.5 text-center text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-ink-deep transition-colors hover:bg-gold-soft sm:text-[0.68rem]">Book</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 04 — The twelve sessions */}
      <section id="sessions" className="sec-paper py-16 sm:py-24">
        <Container>
          <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading index="02" eyebrow="Every session" title={<>Twelve ways to remember <span className="text-gradient">the islands.</span></>} />
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

      {/* 05 — Testimonials */}
      <Testimonials items={testimonials} />

      {/* 06 — Gallery teaser */}
      <section className="sec-ivory overflow-hidden py-16 sm:py-24">
        <Container>
          <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading index="03" eyebrow="Selected frames" title={<>A reel of <span className="text-gradient">the islands.</span></>} />
            <Link href="/gallery" className="link-underline shrink-0 text-sm uppercase tracking-[0.18em] text-ink">
              Open the gallery →
            </Link>
          </div>
          <div className="grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:grid-cols-12 sm:gap-4">
            {TEASER_GRID.map(({ i, cls }) => (
              <Link key={i} href="/gallery" className={`group relative overflow-hidden rounded-lg ring-0 ring-gold/0 transition-all duration-500 hover:ring-1 hover:ring-gold/50 ${cls}`}>
                <Image src={teaser[i]?.url ?? ""} alt={teaser[i]?.alt ?? ""} fill sizes="(max-width:640px) 50vw, 33vw" placeholder="blur" blurDataURL={BLUR} className="img-zoom object-cover" />
                <span className="absolute inset-0 bg-ink-deep/0 transition-colors duration-500 group-hover:bg-ink-deep/20" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 07 — Enquiry form, at page level */}
      <section id="enquire" className="bg-ink-deep py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading index="04" eyebrow="Enquire" title={<>Let&apos;s plan your <span className="text-gradient">island shoot.</span></>} />
              <p className="mt-4 max-w-md text-on-deep/65">
                Tell us your dates and what you have in mind — we&apos;ll craft the perfect session across the islands. Prefer WhatsApp? The button&apos;s always a tap away.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface/30 p-6 sm:p-8">
              <EnquiryForm source="home" />
            </div>
          </div>
        </Container>
      </section>

      {/* 08 — Social + close */}
      <InstagramStrip images={instagram.map((s) => s.url)} />
      <CTASection />
    </>
  );
}
