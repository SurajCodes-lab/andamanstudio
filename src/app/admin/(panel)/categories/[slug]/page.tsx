import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db/client";
import ImagePicker from "../../images/ImagePicker";
import {
  updateCategory,
  setCategoryHero,
  addCategoryImage,
  removeCategoryImage,
  updateProduct,
  addProduct,
  deleteProduct,
  addPriceTier,
  deletePriceTier,
  addBlackout,
  deleteBlackout,
} from "../actions";
import { Card, Field, PageHeader, SaveButton, fieldCls } from "../../ui";
import { formatINR } from "@/data/catalog";
import { tierRange } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function EditCategory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await db.query.categories.findFirst({
    where: (t, { eq }) => eq(t.slug, slug),
    with: {
      hero: true,
      products: {
        orderBy: (t, { asc }) => asc(t.order),
        with: {
          tiers: { orderBy: (t, { asc }) => asc(t.startOn) },
          blackouts: { orderBy: (t, { asc }) => asc(t.day) },
        },
      },
      images: { orderBy: (t, { asc }) => asc(t.order), with: { media: true } },
    },
  });
  if (!cat) notFound();

  const mediaRows = await db.query.media.findMany({ orderBy: (t, { desc }) => desc(t.id) });
  const media = mediaRows.map((m) => ({ id: m.id, url: m.url, alt: m.alt, mime: m.mime }));

  return (
    <div>
      <PageHeader
        title={cat.title}
        subtitle={`/category/${cat.slug}`}
        action={<Link href="/admin/categories" className="text-xs text-on-deep/40 hover:text-gold">← All categories</Link>}
      />

      <div className="space-y-6">
        <Card>
          <form action={updateCategory} className="space-y-4">
            <input type="hidden" name="id" value={cat.id} />
            <Field label="Title"><input name="title" defaultValue={cat.title} className={fieldCls} /></Field>
            <Field label="Blurb" hint="short summary"><textarea name="blurb" defaultValue={cat.blurb} rows={2} className={`${fieldCls} resize-y`} /></Field>
            <Field label="Long description"><textarea name="longDescription" defaultValue={cat.longDescription} rows={4} className={`${fieldCls} resize-y`} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Meta title" hint="SEO"><input name="metaTitle" defaultValue={cat.metaTitle ?? ""} className={fieldCls} /></Field>
              <Field label="Meta description" hint="SEO"><input name="metaDescription" defaultValue={cat.metaDescription ?? ""} className={fieldCls} /></Field>
            </div>
            <SaveButton />
          </form>
        </Card>

        <Card>
          <h3 className="mb-3 font-serif text-lg text-gold-soft">Hero image</h3>
          <div className="w-48">
            <ImagePicker label="Hero" current={cat.hero ? { url: cat.hero.url } : null} targetId={cat.id} action={setCategoryHero} media={media} />
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-lg text-gold-soft">Packages &amp; prices</h3>
            <form action={addProduct}>
              <input type="hidden" name="categoryId" value={cat.id} />
              <button className="rounded-full border border-gold/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-gold hover:bg-gold hover:text-ink-deep">+ Add</button>
            </form>
          </div>
          <div className="space-y-4">
            {cat.products.map((p) => (
              <div key={p.id} className="rounded-xl border border-line p-4">
                <form action={updateProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
                    <Field label="Name"><input name="name" defaultValue={p.name} className={fieldCls} /></Field>
                    <Field label="Price ₹"><input name="price" type="number" defaultValue={p.price} className={fieldCls} /></Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Inclusions" hint="one per line"><textarea name="specs" defaultValue={p.specs.join("\n")} rows={4} className={`${fieldCls} resize-y`} /></Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Note" hint="optional"><input name="note" defaultValue={p.note ?? ""} className={fieldCls} /></Field>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <SaveButton />
                    <button formAction={deleteProduct} name="id" value={p.id} className="ml-auto text-xs uppercase tracking-[0.12em] text-on-deep/40 hover:text-[#e0633b]">Delete</button>
                  </div>
                </form>

                {/* Seasonal price tiers — overrides the base price when a shoot date falls in range */}
                <div className="mt-4 rounded-lg border border-line/70 bg-ink-deep/30 p-3">
                  <p className="meta mb-2 text-on-deep/45">Seasonal pricing · base {formatINR(p.price)}</p>
                  <div className="space-y-1.5">
                    {p.tiers.map((t) => (
                      <form key={t.id} action={deletePriceTier} className="flex items-center gap-2 text-xs">
                        <input type="hidden" name="id" value={t.id} />
                        <span className="text-on-deep/75">{t.label}</span>
                        <span className="mono text-on-deep/45">{tierRange(t)}</span>
                        <span className="mono ml-auto text-gold-soft">{formatINR(t.price)}</span>
                        <button className="text-on-deep/30 hover:text-[#e0633b]">✕</button>
                      </form>
                    ))}
                    {p.tiers.length === 0 && <p className="text-[0.7rem] text-on-deep/30">No seasonal rates — base price applies all year.</p>}
                  </div>
                  <form action={addPriceTier} className="mt-3 grid items-end gap-2 sm:grid-cols-[1fr_auto_auto_auto_auto]">
                    <input type="hidden" name="productId" value={p.id} />
                    <Field label="Season label"><input name="label" placeholder="Peak / Festive" className={fieldCls} /></Field>
                    <Field label="From"><input name="startOn" type="date" required className={fieldCls} /></Field>
                    <Field label="To"><input name="endOn" type="date" required className={fieldCls} /></Field>
                    <Field label="Price ₹"><input name="price" type="number" required className={`${fieldCls} w-28`} /></Field>
                    <SaveButton>+ Add</SaveButton>
                  </form>
                </div>

                {/* Per-product blackout days — block this package when slots are full */}
                <div className="mt-3 rounded-lg border border-line/70 bg-ink-deep/30 p-3">
                  <p className="meta mb-2 text-on-deep/45">Blocked days · slots full</p>
                  <div className="flex flex-wrap gap-2">
                    {p.blackouts.map((bo) => (
                      <form key={bo.id} action={deleteBlackout} className="inline-flex items-center gap-1.5 rounded-full bg-[#e0633b]/15 px-2.5 py-1 text-xs text-[#f08a66]">
                        <input type="hidden" name="id" value={bo.id} />
                        <span className="mono">{bo.day}</span>
                        {bo.reason && <span className="text-on-deep/40">· {bo.reason}</span>}
                        <button className="hover:text-white">✕</button>
                      </form>
                    ))}
                    {p.blackouts.length === 0 && <span className="text-[0.7rem] text-on-deep/30">No blocked days.</span>}
                  </div>
                  <form action={addBlackout} className="mt-3 grid items-end gap-2 sm:grid-cols-[auto_1fr_auto]">
                    <input type="hidden" name="productId" value={p.id} />
                    <Field label="Block date"><input name="day" type="date" required className={fieldCls} /></Field>
                    <Field label="Reason" hint="optional"><input name="reason" placeholder="Fully booked" className={fieldCls} /></Field>
                    <SaveButton>Block</SaveButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 font-serif text-lg text-gold-soft">Gallery</h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {cat.images.map((ci) => (
              <div key={ci.id} className="group relative">
                <div className="relative aspect-square overflow-hidden rounded-lg border border-line">
                  <Image src={ci.media.url} alt={ci.media.alt} fill sizes="120px" className="object-cover" />
                </div>
                <form action={removeCategoryImage}>
                  <input type="hidden" name="id" value={ci.id} />
                  <button className="absolute right-1.5 top-1.5 rounded-full bg-ink-deep/85 px-2 py-0.5 text-[0.65rem] text-white opacity-0 transition-opacity group-hover:opacity-100">✕</button>
                </form>
              </div>
            ))}
            <ImagePicker label="" current={null} targetId={cat.id} action={addCategoryImage} media={media} />
          </div>
        </Card>
      </div>
    </div>
  );
}
