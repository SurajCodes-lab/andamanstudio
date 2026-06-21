import { db } from "@/lib/db/client";
import { formatINR } from "@/data/catalog";
import InlineField from "./InlineField";
import { updateProductPrice, updateProductName } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPackages() {
  const cats = await db.query.categories.findMany({
    orderBy: (t, { asc }) => asc(t.order),
    with: { products: { orderBy: (t, { asc }) => asc(t.order) } },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl text-on-deep">Packages &amp; prices</h1>
      <p className="mt-1 text-sm text-on-deep/55">Edit a name or price — click the field, change it, click away. Changes go live immediately.</p>

      <div className="mt-8 space-y-8">
        {cats.map((c) => (
          <section key={c.id} className="rounded-2xl border border-line bg-surface/30 p-5">
            <h2 className="font-serif text-xl text-gold-soft">{c.title}</h2>
            <div className="mt-4 divide-y divide-line">
              {c.products.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <InlineField action={updateProductName} id={p.id} name="name" defaultValue={p.name} className="w-64" />
                  <div className="flex items-center gap-3">
                    <span className="mono text-xs text-on-deep/40">{formatINR(p.price)}</span>
                    <InlineField action={updateProductPrice} id={p.id} name="price" type="number" prefix="₹" defaultValue={p.price} className="w-28" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
