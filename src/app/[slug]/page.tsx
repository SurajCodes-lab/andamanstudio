import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import ParallaxImage from "@/components/ParallaxImage";
import GalleryGrid from "@/components/GalleryGrid";
import ProductCard from "@/components/ProductCard";
import CTASection from "@/components/CTASection";
import { serviceSlugs } from "@/data/services";
import { getCategoryTheme } from "@/data/categoryThemes";
import { getServiceTheme } from "@/data/serviceThemes";
import { getService, getServices, getFullCategory } from "@/lib/db/queries";
import ServiceSignature from "@/components/ServiceSignature";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return {
    title: service.metaTitle ?? service.title,
    description: service.metaDescription ?? service.intro,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: service.metaTitle ?? `${service.title} — Andaman Studio`,
      description: service.metaDescription ?? service.intro,
      images: [service.heroImage],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const category = await getFullCategory(service.relatedCategoryId);
  const others = (await getServices()).filter((s) => s.slug !== slug).slice(0, 3);
  const theme = getServiceTheme(slug);

  return (
    <>
      <PageHero
        eyebrow={theme.kicker}
        title={service.title}
        intro={service.intro}
        image={service.heroImage}
        icon={theme.icon}
        accent={theme.accent}
      />

      <ServiceSignature service={service} theme={theme} />

      {/* Editorial body */}
      <section className="sec-paper relative overflow-hidden py-24 sm:py-32">
        <Container className="relative">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-stretch">
            <div className="order-2 flex flex-col justify-center lg:order-1">
              <Reveal>
                <span className="tag mb-6">✦ The experience</span>
                <p className="font-serif text-ink text-2xl leading-snug sm:text-3xl">
                  {service.intro}
                </p>
              </Reveal>
              <div className="mt-10 space-y-10">
                {service.sections.map((sec, i) => (
                  <Reveal key={sec.heading} delay={i * 0.1}>
                    <div className="flex items-center gap-3">
                      <span className="bg-gold h-px w-8" />
                      <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h2 className="font-serif text-ink mt-4 text-2xl sm:text-3xl">{sec.heading}</h2>
                    <p className="text-ink-soft mt-3 max-w-lg leading-relaxed">{sec.body}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
              <Reveal direction="left" className="col-span-2">
                <ParallaxImage
                  src={service.gallery[0] ?? service.heroImage}
                  alt={service.title}
                  className="aspect-[16/11] rounded-lg shadow-[0_30px_70px_-40px_rgba(22,32,30,0.4)]"
                  sizes="(max-width:1024px) 100vw, 50vw"
                  frame
                  caption={`${service.eyebrow.toUpperCase()} · ƒ/1.8`}
                />
              </Reveal>
              <Reveal direction="up" delay={0.1}>
                <ParallaxImage
                  src={service.gallery[1] ?? service.heroImage}
                  alt={service.title}
                  className="aspect-[4/5] rounded-lg shadow-[0_30px_70px_-40px_rgba(22,32,30,0.4)]"
                  sizes="25vw"
                  amount={40}
                />
              </Reveal>
              <Reveal direction="up" delay={0.18}>
                <ParallaxImage
                  src={service.gallery[2] ?? service.gallery[0] ?? service.heroImage}
                  alt={service.title}
                  className="aspect-[4/5] rounded-lg shadow-[0_30px_70px_-40px_rgba(22,32,30,0.4)]"
                  sizes="25vw"
                  amount={75}
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Related packages — light break */}
      {category && (
        <section className="sec-ivory py-24 sm:py-32">
          <Container>
            <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="eyebrow">Pricing</span>
                <h2 className="display text-ink mt-3 text-4xl sm:text-5xl">
                  {category.title}
                </h2>
              </div>
              <Link
                href={`/category/${category.id}`}
                className="link-underline text-ink text-sm uppercase tracking-[0.18em]"
              >
                Explore {category.title} →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {category.products.map((p, i) => (
                <ProductCard key={p.name} product={p} index={i} variant={getCategoryTheme(category.id).signature} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Gallery */}
      <section className="sec-ivory py-24 sm:py-32">
        <Container>
          <div className="mb-12">
            <span className="eyebrow">The gallery</span>
            <h2 className="display text-ink mt-3 text-4xl sm:text-5xl">Moments from the shoot</h2>
          </div>
          <GalleryGrid images={service.gallery} columns={3} />
        </Container>
      </section>

      {/* Explore more */}
      <section className="sec-paper border-t border-line py-20">
        <Container>
          <span className="eyebrow">Keep exploring</span>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/${o.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
                  <Image src={o.heroImage} alt={o.title} fill sizes="33vw" className="img-zoom object-cover" />
                  <div className="absolute inset-0 bg-ink-deep/30 transition-colors group-hover:bg-ink-deep/10" />
                </div>
                <h3 className="font-serif text-ink mt-4 text-xl">{o.title}</h3>
                <p className="text-ink-mute text-sm">{o.summary}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CTASection image={service.gallery[1] ?? service.heroImage} />
    </>
  );
}
