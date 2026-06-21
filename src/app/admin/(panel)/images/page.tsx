import { db } from "@/lib/db/client";
import { guardPage } from "@/lib/permissions";
import ImagePicker from "./ImagePicker";
import { setSlotImage, setCategoryHero, setServiceHero } from "./actions";

export const dynamic = "force-dynamic";

const SLOT_LABELS: Record<string, string> = {
  "home.hero": "Home — hero (desktop)",
  "home.hero.mobile": "Home — hero (mobile)",
  "home.signature": "Home — signature band",
  "home.teaser": "Home — gallery teaser",
  "home.instagram": "Home — Instagram strip",
};

export default async function ImagesPage() {
  await guardPage("content");
  const mediaRows = await db.query.media.findMany({ orderBy: (t, { desc }) => desc(t.id) });
  const media = mediaRows.map((m) => ({ id: m.id, url: m.url, alt: m.alt, mime: m.mime }));

  const slots = await db.query.imageSlots.findMany({
    orderBy: (t, { asc }) => [asc(t.key), asc(t.order)],
    with: { media: true },
  });
  const cats = await db.query.categories.findMany({ orderBy: (t, { asc }) => asc(t.order), with: { hero: true } });
  const svcs = await db.query.services.findMany({ orderBy: (t, { asc }) => asc(t.order), with: { hero: true } });

  const slotGroups = Object.keys(SLOT_LABELS).map((key) => ({
    key,
    label: SLOT_LABELS[key],
    items: slots.filter((s) => s.key === key),
  }));

  return (
    <div>
      <h1 className="font-serif text-3xl text-on-deep">Images</h1>
      <p className="mt-1 text-sm text-on-deep/55">
        Click any image to swap it. New photos can be added in the{" "}
        <a href="/admin/media" className="text-gold hover:underline">Media library</a>.
      </p>

      {slotGroups.map((g) => (
        <section key={g.key} className="mt-8">
          <h2 className="font-serif text-xl text-gold-soft">{g.label}</h2>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {g.items.map((s) => (
              <ImagePicker
                key={s.id}
                label={s.label ?? `#${s.order + 1}`}
                current={s.media ? { url: s.media.url } : null}
                targetId={s.id}
                action={setSlotImage}
                media={media}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="mt-10">
        <h2 className="font-serif text-xl text-gold-soft">Category hero images</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {cats.map((c) => (
            <ImagePicker key={c.id} label={c.title} current={c.hero ? { url: c.hero.url } : null} targetId={c.id} action={setCategoryHero} media={media} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl text-gold-soft">Service hero images</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {svcs.map((s) => (
            <ImagePicker key={s.id} label={s.title} current={s.hero ? { url: s.hero.url } : null} targetId={s.id} action={setServiceHero} media={media} />
          ))}
        </div>
      </section>
    </div>
  );
}
