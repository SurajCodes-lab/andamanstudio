import Image from "next/image";
import Link from "next/link";
import { type Category, formatINR } from "@/data/catalog";
import ProductCard from "./ProductCard";
import { getCategoryTheme } from "@/data/categoryThemes";
import Reveal from "./Reveal";
import Container from "./Container";

export default function CategorySection({
  category,
  index,
}: {
  category: Category;
  index: number;
}) {
  return (
    <section id={category.id} className="scroll-mt-28 py-16 sm:py-20">
      <Container>
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="flex items-start gap-6">
            <span className="numeral-fill hidden text-7xl leading-none sm:block lg:text-8xl">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <Reveal>
                <div className="mb-3 flex items-center gap-3">
                  <span className="bg-gold h-px w-8" />
                  <span className="eyebrow">Category</span>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <h3 className="display text-3xl text-ink sm:text-5xl">{category.title}</h3>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-ink-soft mt-4 max-w-xl text-sm leading-relaxed sm:text-base">
                  {category.blurb}
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                  <span className="tag">
                    {category.products.length} package{category.products.length > 1 ? "s" : ""}
                  </span>
                  <span className="text-ink-mute">
                    from{" "}
                    <span className="text-gold font-serif text-lg">
                      {formatINR(Math.min(...category.products.map((p) => p.price)))}
                    </span>
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
          <Reveal direction="left" className="hidden xl:block">
            <Link href={`/category/${category.id}`} className="group block">
              <div className="relative h-28 w-44 overflow-hidden rounded-sm">
                <Image src={category.image} alt={category.title} fill sizes="200px" className="img-zoom object-cover" />
                <div className="absolute inset-0 flex items-end justify-center bg-ink-deep/40 pb-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-[0.62rem] uppercase tracking-[0.16em] text-white">Explore →</span>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>

        <div
          className={`mt-12 grid gap-6 ${
            category.products.length <= 2
              ? "mx-auto max-w-3xl sm:grid-cols-2"
              : category.products.length === 3
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {category.products.map((p, i) => (
            <ProductCard key={p.name} product={p} index={i} variant={getCategoryTheme(category.id).signature} />
          ))}
        </div>

        <Reveal>
          <Link
            href={`/category/${category.id}`}
            className="text-gold link-underline mt-8 inline-flex text-sm uppercase tracking-[0.16em]"
          >
            View {category.title} — photos &amp; films →
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
