import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import ServicesWall from "@/components/ServicesWall";
import { whatsappLink } from "@/data/site";
import { getServices, getCatalog } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Services — The Work",
  description:
    "The work: beach, sunset, forest, candid, candle-light dinner, birthday, drone, cinematic film, property, Kalapathar, pre/post wedding and Memory Maker sessions across the Andaman Islands.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [services, catalog] = await Promise.all([getServices(), getCatalog()]);
  return (
    <>
      <PageHero
        eyebrow="The work — 12 sessions"
        title="The Work"
        intro="Twelve ways to remember the islands — every shoot we craft, in full colour. The experiences; pricing lives on Packages."
        image="/img/beach/best-beach-photoshoot-in-havelock.webp"
        icon="aperture"
        accent="#d8a82f"
      />

      {/* One continuous image-only bento wall — no prices, no bands */}
      <section className="sec-paper py-16 sm:py-24">
        <Container size="wide">
          <ServicesWall services={services} categories={catalog.map((c) => ({ id: c.id, title: c.title }))} />
        </Container>
      </section>

      {/* Bespoke closer (NOT the shared CTASection) */}
      <section className="sec-deep relative overflow-hidden py-28 text-center sm:py-36">
        <span className="index-numeral pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[20rem] opacity-[0.06] sm:text-[30rem]">
          12
        </span>
        <Container className="relative">
          <span className="meta text-gold">Ready when you are</span>
          <h2 className="display mx-auto mt-4 max-w-[16ch] text-[clamp(2.25rem,6vw,5rem)] leading-[0.98] text-white">
            Twelve shoots. <span className="font-serif text-gold-soft">One message.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-on-deep/70">
            Tell us your dates and the moments you want to keep — we&apos;ll shape the perfect session across the islands.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-syne rounded-full bg-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-ink-deep transition-colors hover:bg-gold-soft"
            >
              Book on WhatsApp →
            </a>
            <Link
              href="/packages"
              className="font-syne rounded-full border border-line px-8 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-on-deep transition-colors hover:border-gold hover:text-gold"
            >
              See pricing →
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
