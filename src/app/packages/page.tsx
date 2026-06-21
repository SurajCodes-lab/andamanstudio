import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import CategorySection from "@/components/CategorySection";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Accordion from "@/components/Accordion";
import CTASection from "@/components/CTASection";
import { formatINR } from "@/data/catalog";
import { bookingSteps, faqs, terms } from "@/data/info";
import { whatsappLink } from "@/data/site";
import { getCatalog } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Packages & Pricing",
  description:
    "Transparent, upfront pricing — photoshoots, pre/post wedding cinematic films, candle-light dinner, Kalapathar, drone and property shoots, each with clear inclusions and ₹ pricing.",
  alternates: { canonical: "/packages" },
};

export default async function PackagesPage() {
  const catalog = await getCatalog();
  const totalTiers = catalog.reduce((n, c) => n + c.products.length, 0);
  const lowest = Math.min(...catalog.flatMap((c) => c.products.map((p) => p.price)));
  const fromOf = (c: (typeof catalog)[number]) => Math.min(...c.products.map((p) => p.price));

  return (
    <>
      <PageHero
        eyebrow="Transparent · upfront"
        title="Packages & Pricing"
        intro="What you see is what you pay. Every tier, every inclusion, every ₹ — laid out plainly. The work lives on Services; here are the numbers."
        image="/img/beach/premium-photoshoot-in-havelock.webp"
        icon="aperture"
        accent="#d8a82f"
      />

      {/* Ledger stat strip */}
      <section className="sec-ivory border-b border-line">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 py-5 sm:justify-between">
            <span className="meta text-on-deep/65"><span className="font-serif text-gold text-xl">{totalTiers}</span> packages</span>
            <span className="meta text-on-deep/65"><span className="font-serif text-gold text-xl">{catalog.length}</span> categories</span>
            <span className="meta text-on-deep/65">from <span className="font-serif text-gold text-xl">{formatINR(lowest)}</span></span>
            <a href="#booking" className="meta text-gold link-underline">How to book ↓</a>
          </div>
        </Container>
      </section>

      {/* THE PRICE INDEX — ₹ leads the page */}
      <section className="sec-paper py-16 sm:py-24">
        <Container>
          <div className="mb-8 border-t border-line pt-6 sm:mb-10">
            <span className="meta text-gold">The index</span>
            <h2 className="display mt-2 text-[clamp(2rem,4.5vw,3.5rem)] text-ink">Every package, by category.</h2>
          </div>
          <div>
            {catalog.map((c, i) => (
              <a key={c.id} href={`#${c.id}`} className="group flex items-baseline justify-between gap-5 border-b border-line py-5 sm:py-6">
                <span className="flex items-baseline gap-4 sm:gap-7">
                  <span className="mono text-gold text-xs sm:text-sm">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-2xl leading-none text-ink transition-colors duration-300 group-hover:text-gold sm:text-4xl lg:text-5xl">{c.title}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="font-serif text-lg text-gold-soft sm:text-2xl">from {formatINR(fromOf(c))}</span>
                  <span className="mono ml-2 hidden text-[0.66rem] text-on-deep/45 sm:inline">{c.products.length} tiers</span>
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* Sticky in-page nav for the detailed tiers */}
      <section className="glass-nav sticky top-[68px] z-30 hidden border-y border-line lg:block">
        <Container>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 py-3.5 text-xs uppercase tracking-[0.16em]">
            {catalog.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} className="text-on-deep/70 hover:text-gold link-underline">{c.title}</a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Detailed tiers per category */}
      <div className="divide-y divide-line">
        {catalog.map((c, i) => (
          <CategorySection key={c.id} category={c} index={i} />
        ))}
      </div>

      {/* Reassurance band */}
      <section className="py-12">
        <Container>
          <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl border border-gold/30 bg-surface px-8 py-10 text-center sm:flex-row sm:text-left">
            <div className="relative">
              <span className="eyebrow">No surprises</span>
              <h3 className="font-serif mt-2 text-2xl text-ink sm:text-3xl">Every package &amp; price, right here.</h3>
              <p className="mt-2 max-w-md text-sm text-ink-soft">
                What you see is what you pay — full inclusions and pricing listed above. Questions on any package? We&apos;re a message away.
              </p>
            </div>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-syne relative shrink-0 rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-ink-deep transition-colors duration-300 hover:bg-gold-soft"
            >
              Ask about a package →
            </a>
          </div>
        </Container>
      </section>

      {/* Booking procedure */}
      <section id="booking" className="sec-ivory scroll-mt-24 py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="How it works" title="A simple booking procedure" align="center" className="mx-auto" />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {bookingSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <div className="bg-surface border border-line h-full rounded-2xl p-7">
                  <span className="font-serif text-gold text-5xl">{String(i + 1).padStart(2, "0")}</span>
                  <h4 className="font-serif text-ink mt-4 text-xl">{step.title}</h4>
                  <p className="text-ink-soft mt-3 text-sm leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ + Terms */}
      <section className="sec-paper py-24 sm:py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Good to know" title="Frequently asked" className="mb-10" />
              <Accordion items={faqs} />
            </div>
            <div>
              <SectionHeading eyebrow="The fine print" title="Terms &amp; conditions" className="mb-10" />
              <ul className="space-y-4">
                {terms.map((t, i) => (
                  <Reveal key={i} delay={i * 0.03}>
                    <li className="flex gap-4 text-sm leading-relaxed text-ink-soft">
                      <span className="text-gold font-serif">{String(i + 1).padStart(2, "0")}</span>
                      <span>{t}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
