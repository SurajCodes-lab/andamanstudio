import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db/client";
import ImagePicker from "../../images/ImagePicker";
import {
  updateService,
  updateSection,
  addSection,
  deleteSection,
  setServiceHero,
  addGalleryImage,
  removeGalleryImage,
} from "../actions";
import { Card, Field, PageHeader, SaveButton, fieldCls } from "../../ui";

export const dynamic = "force-dynamic";

export default async function EditService({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svc = await db.query.services.findFirst({
    where: (t, { eq }) => eq(t.slug, slug),
    with: {
      hero: true,
      sections: { orderBy: (t, { asc }) => asc(t.order) },
      images: { orderBy: (t, { asc }) => asc(t.order), with: { media: true } },
    },
  });
  if (!svc) notFound();

  const mediaRows = await db.query.media.findMany({ orderBy: (t, { desc }) => desc(t.id) });
  const media = mediaRows.map((m) => ({ id: m.id, url: m.url, alt: m.alt, mime: m.mime }));

  return (
    <div>
      <PageHeader
        title={svc.title}
        subtitle={`/${svc.slug}`}
        action={
          <Link href={`/admin/services`} className="text-xs text-on-deep/40 hover:text-gold">← All services</Link>
        }
      />

      <div className="space-y-6">
        <Card>
          <form action={updateService} className="space-y-4">
            <input type="hidden" name="id" value={svc.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title"><input name="title" defaultValue={svc.title} className={fieldCls} /></Field>
              <Field label="Eyebrow"><input name="eyebrow" defaultValue={svc.eyebrow} className={fieldCls} /></Field>
            </div>
            <Field label="Summary" hint="shown on cards"><input name="summary" defaultValue={svc.summary} className={fieldCls} /></Field>
            <Field label="Intro"><textarea name="intro" defaultValue={svc.intro} rows={3} className={`${fieldCls} resize-y`} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Meta title" hint="SEO"><input name="metaTitle" defaultValue={svc.metaTitle ?? ""} placeholder={svc.title} className={fieldCls} /></Field>
              <Field label="Meta description" hint="SEO"><input name="metaDescription" defaultValue={svc.metaDescription ?? ""} placeholder={svc.summary} className={fieldCls} /></Field>
            </div>
            <SaveButton />
          </form>
        </Card>

        <Card>
          <h3 className="mb-3 font-serif text-lg text-gold-soft">Hero image</h3>
          <div className="w-48">
            <ImagePicker label="Hero" current={svc.hero ? { url: svc.hero.url } : null} targetId={svc.id} action={setServiceHero} media={media} />
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-lg text-gold-soft">Body sections</h3>
            <form action={addSection}>
              <input type="hidden" name="serviceId" value={svc.id} />
              <button className="rounded-full border border-gold/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-gold hover:bg-gold hover:text-ink-deep">+ Add</button>
            </form>
          </div>
          <div className="space-y-4">
            {svc.sections.map((sec) => (
              <form key={sec.id} action={updateSection} className="rounded-xl border border-line p-4">
                <input type="hidden" name="id" value={sec.id} />
                <Field label="Heading"><input name="heading" defaultValue={sec.heading} className={fieldCls} /></Field>
                <div className="mt-3">
                  <Field label="Body"><textarea name="body" defaultValue={sec.body} rows={3} className={`${fieldCls} resize-y`} /></Field>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <SaveButton />
                  <button formAction={deleteSection} className="ml-auto text-xs uppercase tracking-[0.12em] text-on-deep/40 hover:text-[#e0633b]">Delete</button>
                </div>
              </form>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 font-serif text-lg text-gold-soft">Gallery</h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {svc.images.map((si) => (
              <div key={si.id} className="group relative">
                <div className="relative aspect-square overflow-hidden rounded-lg border border-line">
                  <Image src={si.media.url} alt={si.media.alt} fill sizes="120px" className="object-cover" />
                </div>
                <form action={removeGalleryImage}>
                  <input type="hidden" name="id" value={si.id} />
                  <button className="absolute right-1.5 top-1.5 rounded-full bg-ink-deep/85 px-2 py-0.5 text-[0.65rem] text-white opacity-0 transition-opacity group-hover:opacity-100">✕</button>
                </form>
              </div>
            ))}
            <ImagePicker label="" current={null} targetId={svc.id} action={addGalleryImage} media={media} />
          </div>
        </Card>
      </div>
    </div>
  );
}
