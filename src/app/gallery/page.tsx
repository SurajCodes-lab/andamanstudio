import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import FilterableGallery from "@/components/FilterableGallery";
import CTASection from "@/components/CTASection";
import { allGalleryImages } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A cinematic gallery of Andaman Studio's work — beach, sunset, forest, candle-light dinner, candid and wedding photography across Havelock Island. Filter by category.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow={`${allGalleryImages.length} frames · 8 categories`}
        title="The Gallery"
        intro="A scroll through the islands as we see them — light, colour and the people who make each frame. Filter by the shoot you're dreaming of."
        image="/img/sunset/best-sunset-photography-in-andaman-islands.webp"
        height="short"
      />

      <section className="sec-paper relative overflow-hidden pb-20 pt-8 sm:pb-28">
        <Container size="wide" className="relative">
          <FilterableGallery />
        </Container>
      </section>

      <CTASection />
    </>
  );
}
