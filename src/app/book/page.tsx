import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import BookingWidget from "@/components/BookingWidget";
import { getBookingCatalog, getGlobalBlackoutDays, getSite } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book your shoot",
  description: "Pick your package and date — see live pricing and request your Andaman Studio shoot. Seasonal rates and real-time availability.",
  alternates: { canonical: "/book" },
};

export default async function BookPage({ searchParams }: { searchParams: Promise<{ pkg?: string }> }) {
  const { pkg } = await searchParams;
  const [catalog, blackout, site] = await Promise.all([getBookingCatalog(), getGlobalBlackoutDays(), getSite()]);

  return (
    <>
      <PageHero
        eyebrow="Reserve your date"
        title="Book your shoot"
        intro="Choose a package and a date to see live pricing, then send your request. We confirm availability on WhatsApp within a couple of hours."
        image="/img/beach/best-beach-side-photoshoot-in-havelock.webp"
        height="short"
        icon="camera"
        accent="#e6a23c"
      />

      <section className="sec-deep py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-surface/30 p-6 sm:p-10">
            <span className="eyebrow text-gold">Booking request</span>
            <h2 className="font-serif mt-2 mb-7 text-3xl text-on-deep">Pick a package & date</h2>
            <BookingWidget catalog={catalog} blackout={blackout} whatsapp={site.whatsapp} initialPkg={pkg ?? ""} />
          </div>
        </Container>
      </section>
    </>
  );
}
