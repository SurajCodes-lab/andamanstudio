import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import GalleryGrid from "@/components/GalleryGrid";
import VideoReel from "@/components/VideoReel";
import CTASection from "@/components/CTASection";
import CategorySignature from "@/components/CategorySignature";
import { categorySlugs } from "@/data/categories";
import { formatINR } from "@/data/catalog";
import { getCategoryTheme } from "@/data/categoryThemes";
import { getFullCategory, getCategories, getService } from "@/lib/db/queries";

export function generateStaticParams() {
  return categorySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getFullCategory(slug);
  if (!cat) return {};
  return {
    title: cat.metaTitle ?? `${cat.title} — Packages, Photos & Films`,
    description: cat.metaDescription ?? cat.longDescription,
    alternates: { canonical: `/category/${slug}` },
    openGraph: { title: cat.metaTitle ?? cat.title, description: cat.metaDescription ?? cat.longDescription, images: [cat.heroImage] },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = await getFullCategory(slug);
  if (!cat) notFound();

  const fromPrice = Math.min(...cat.products.map((p) => p.price));
  const services = (await Promise.all(cat.serviceSlugs.map((s) => getService(s)))).filter(Boolean);
  const others = (await getCategories()).filter((c) => c.slug !== slug);
  const theme = getCategoryTheme(slug);

  return (
    <>
      <PageHero
        eyebrow={theme.kicker}
        title={cat.title}
        intro={cat.longDescription}
        image={cat.heroImage}
        icon={theme.icon}
        accent={theme.accent}
      />

      {/* Quick facts bar */}
      <section className="sec-ivory border-b border-line">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-6 text-center sm:justify-between">
            <span className="tag">{cat.products.length} packages</span>
            <span className="text-ink-soft text-sm">
              From <span className="text-gold font-serif text-xl">{formatINR(fromPrice)}</span>
            </span>
            <span className="text-ink-soft text-sm">{cat.images.length} photos</span>
            {cat.videoIds.length > 0 && (
              <span className="text-ink-soft text-sm">{cat.videoIds.length} films</span>
            )}
            <a href="#packages" className="text-gold link-underline text-sm uppercase tracking-[0.16em]">
              See pricing ↓
            </a>
          </div>
        </Container>
      </section>

      {/* Category-specific signature band — distinct per shoot type */}
      <CategorySignature category={cat} theme={theme} />

      {/* Packages */}
      <section id="packages" className="sec-paper relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
        <Container className="relative">
          <div className="mb-12">
            <span className="eyebrow">{theme.kicker} · Pricing</span>
            <h2 className="display text-ink mt-3 text-4xl sm:text-5xl">
              {cat.title.replace(/\s*packages?$/i, "")} <span className="text-gradient">packages</span>
            </h2>
            <p className="text-ink-soft mt-4 max-w-xl">{theme.tagline} {cat.blurb}</p>
          </div>
          <div
            className={`grid gap-6 ${
              cat.products.length <= 2
                ? "mx-auto max-w-3xl sm:grid-cols-2"
                : cat.products.length === 3
                  ? "sm:grid-cols-2 lg:grid-cols-3"
                  : "sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {cat.products.map((p, i) => (
              <ProductCard key={p.name} product={p} index={i} variant={theme.signature} />
            ))}
          </div>
        </Container>
      </section>

      {/* Films */}
      {cat.videoIds.length > 0 && (
        <section className="bg-ink-deep relative overflow-hidden py-24 sm:py-32">
          <Container className="relative">
            <div className="mb-12">
              <span className="eyebrow text-gold-soft">Watch</span>
              <h2 className="display text-on-deep mt-3 text-4xl sm:text-5xl">
                {cat.title} films
              </h2>
              <p className="mt-4 max-w-xl text-on-deep/70">
                Gimbal-shot, colour-graded and scored — a look at how we move on the islands.
              </p>
            </div>
            <VideoReel ids={cat.videoIds} />
          </Container>
        </section>
      )}

      {/* Photos */}
      {cat.images.length > 0 && (
        <section className="sec-ivory py-24 sm:py-32">
          <Container size="wide">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">The gallery</span>
                <h2 className="display text-ink mt-3 text-4xl sm:text-5xl">{cat.title} photos</h2>
              </div>
              <Link href="/gallery" className="link-underline text-ink text-sm uppercase tracking-[0.16em]">
                Full gallery →
              </Link>
            </div>
            <GalleryGrid images={cat.images} columns={4} />
          </Container>
        </section>
      )}

      {/* Related sessions — light break */}
      {services.length > 0 && (
        <section className="sec-paper border-t border-line py-20">
          <Container>
            <span className="eyebrow">In this category</span>
            <h2 className="display text-ink mt-3 mb-10 text-3xl sm:text-4xl">Sessions</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <Link key={s!.slug} href={`/${s!.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                    <Image src={s!.heroImage} alt={s!.title} fill sizes="33vw" className="img-zoom object-cover" />
                    <div className="absolute inset-0 bg-ink-deep/25 transition-colors group-hover:bg-ink-deep/10" />
                  </div>
                  <h3 className="font-serif text-ink mt-4 text-xl">{s!.title}</h3>
                  <p className="text-ink-mute text-sm">{s!.summary}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Other categories */}
      <section className="sec-paper border-t border-line py-16">
        <Container>
          <span className="eyebrow">Explore categories</span>
          <div className="mt-6 flex flex-wrap gap-3">
            {others.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="border-line text-ink-soft hover:border-gold hover:text-gold rounded-full border px-5 py-2.5 text-sm uppercase tracking-[0.14em] transition-colors"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CTASection image={cat.images[1] ?? cat.heroImage} />
    </>
  );
}
