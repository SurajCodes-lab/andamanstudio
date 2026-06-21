import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db/client";
import { guardPage } from "@/lib/permissions";
import { formatINR } from "@/data/catalog";
import { PageHeader } from "../ui";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  await guardPage("content");
  const items = await db.query.categories.findMany({
    orderBy: (t, { asc }) => asc(t.order),
    with: { hero: true, products: true },
  });
  return (
    <div>
      <PageHeader title="Packages & categories" subtitle="Edit each category's content, hero, gallery, packages/prices and SEO." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => {
          const from = c.products.length ? Math.min(...c.products.map((p) => p.price)) : 0;
          return (
            <Link key={c.id} href={`/admin/categories/${c.slug}`} className="group flex items-center gap-3 rounded-xl border border-line bg-surface/30 p-3 transition-colors hover:border-gold/50">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded">
                {c.hero && <Image src={c.hero.url} alt="" fill sizes="80px" className="object-cover" />}
              </div>
              <div className="min-w-0">
                <p className="font-serif text-on-deep transition-colors group-hover:text-gold">{c.title}</p>
                <p className="mono text-[0.6rem] text-on-deep/40">{c.products.length} packages · from {formatINR(from)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
