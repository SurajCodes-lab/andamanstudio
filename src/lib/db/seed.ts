import "dotenv/config";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as s from "./schema";

import { site } from "../../data/site";
import { categories, categoryNav } from "../../data/categories";
import { services } from "../../data/services";
import { galleryCategories } from "../../data/gallery";
import { testimonials, locations, faqs, bookingSteps, tips, terms } from "../../data/info";
import { getCategoryTheme } from "../../data/categoryThemes";
import { getServiceTheme } from "../../data/serviceThemes";
import { altFromSrc } from "../alt";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const sql = postgres(connectionString, { prepare: false, max: 1 });
const db = drizzle(sql, { schema: s });

/* ---- collect every /img file on disk ---- */
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(webp|jpg|jpeg|png|avif)$/i.test(name)) out.push(full);
  }
  return out;
}
const PUBLIC_IMG = join(process.cwd(), "public", "img");
function toUrl(absPath: string): string {
  const rel = absPath.slice(join(process.cwd(), "public").length).split("\\").join("/");
  return rel.startsWith("/") ? rel : `/${rel}`;
}

const SHORT = new Map(categoryNav.map((c) => [c.slug, c.short]));

async function main() {
  console.log("⏳ Seeding Andaman Studio database…");

  await sql`TRUNCATE
    media, site_settings, image_slots, categories, products, category_images,
    category_services, services, service_sections, service_images,
    gallery_categories, gallery_images, testimonials, locations, faqs,
    booking_steps, text_items, legal_pages
    RESTART IDENTITY CASCADE`;

  /* ---------- media (existing /img files) ---------- */
  const files = walk(PUBLIC_IMG).map(toUrl).sort();
  const mediaRows = await db
    .insert(s.media)
    .values(files.map((url) => ({ url, alt: altFromSrc(url), mime: "image/webp" })))
    .returning({ id: s.media.id, url: s.media.url });
  const mediaMap = new Map(mediaRows.map((m) => [m.url, m.id]));

  async function mediaId(url: string): Promise<number> {
    const hit = mediaMap.get(url);
    if (hit) return hit;
    const [row] = await db
      .insert(s.media)
      .values({ url, alt: altFromSrc(url), mime: "image/webp" })
      .returning({ id: s.media.id });
    mediaMap.set(url, row.id);
    return row.id;
  }
  console.log(`  • media: ${mediaMap.size}`);

  /* ---------- site settings ---------- */
  await db.insert(s.siteSettings).values({
    id: 1,
    name: site.name,
    legalName: site.legalName,
    tagline: site.tagline,
    shortDesc: site.shortDesc,
    url: site.url,
    locale: site.locale,
    heroVideoId: site.heroVideoId,
    mission: site.mission,
    brochureUrl: site.brochureUrl,
    email: site.email,
    whatsapp: site.whatsapp,
    phones: [...site.phones],
    address: { ...site.address },
    social: { ...site.social },
    stat: { ...site.stat },
    credentials: site.credentials.map((c) => ({ ...c })),
    highlightedServiceSlugs: [...site.highlightedServiceSlugs],
  });

  /* ---------- categories + products + images + services link ---------- */
  let catOrder = 0;
  for (const c of categories) {
    const theme = getCategoryTheme(c.slug);
    const [cat] = await db
      .insert(s.categories)
      .values({
        slug: c.slug,
        title: c.title,
        shortLabel: SHORT.get(c.slug) ?? null,
        blurb: c.blurb,
        longDescription: c.longDescription,
        imageMediaId: await mediaId(c.image),
        heroMediaId: await mediaId(c.heroImage),
        videoIds: [...c.videoIds],
        order: catOrder++,
        themeKicker: theme.kicker,
        themeTagline: theme.tagline,
        themeSignature: theme.signature,
        themeIcon: theme.icon,
        themeAccent: theme.accent,
      })
      .returning({ id: s.categories.id });

    let pOrder = 0;
    for (const p of c.products) {
      await db.insert(s.products).values({
        categoryId: cat.id,
        name: p.name,
        price: p.price,
        specs: [...p.specs],
        note: p.note ?? null,
        popular: p.popular ?? false,
        order: pOrder++,
      });
    }

    let ciOrder = 0;
    for (const img of c.images) {
      await db.insert(s.categoryImages).values({
        categoryId: cat.id,
        mediaId: await mediaId(img),
        order: ciOrder++,
      });
    }

    let csOrder = 0;
    for (const slug of c.serviceSlugs) {
      await db.insert(s.categoryServices).values({
        categoryId: cat.id,
        serviceSlug: slug,
        order: csOrder++,
      });
    }
  }
  console.log(`  • categories: ${categories.length}`);

  /* ---------- services + sections + gallery ---------- */
  let svcOrder = 0;
  for (const sv of services) {
    const theme = getServiceTheme(sv.slug);
    const [svc] = await db
      .insert(s.services)
      .values({
        slug: sv.slug,
        title: sv.title,
        eyebrow: sv.eyebrow,
        summary: sv.summary,
        heroMediaId: await mediaId(sv.heroImage),
        intro: sv.intro,
        relatedCategorySlug: sv.relatedCategoryId,
        order: svcOrder++,
        themeKicker: theme.kicker,
        themeTagline: theme.tagline,
        themeAccent: theme.accent,
        themeLayout: theme.layout,
        themeIcon: theme.icon,
      })
      .returning({ id: s.services.id });

    let secOrder = 0;
    for (const sec of sv.sections) {
      await db.insert(s.serviceSections).values({
        serviceId: svc.id,
        heading: sec.heading,
        body: sec.body,
        order: secOrder++,
      });
    }
    let giOrder = 0;
    for (const img of sv.gallery) {
      await db.insert(s.serviceImages).values({
        serviceId: svc.id,
        mediaId: await mediaId(img),
        order: giOrder++,
      });
    }
  }
  console.log(`  • services: ${services.length}`);

  /* ---------- gallery ---------- */
  let gcOrder = 0;
  for (const g of galleryCategories) {
    const [gc] = await db
      .insert(s.galleryCategories)
      .values({ slug: g.id, label: g.label, order: gcOrder++ })
      .returning({ id: s.galleryCategories.id });
    let giOrder = 0;
    for (const img of g.images) {
      await db.insert(s.galleryImages).values({
        galleryCategoryId: gc.id,
        mediaId: await mediaId(img),
        order: giOrder++,
      });
    }
  }
  console.log(`  • gallery categories: ${galleryCategories.length}`);

  /* ---------- info / text ---------- */
  await db.insert(s.testimonials).values(
    testimonials.map((t, i) => ({ quote: t.quote, name: t.name, role: t.role, order: i }))
  );
  let locOrder = 0;
  for (const l of locations) {
    await db.insert(s.locations).values({
      name: l.name,
      blurb: l.blurb,
      imageMediaId: await mediaId(l.image),
      order: locOrder++,
    });
  }
  await db.insert(s.faqs).values(faqs.map((f, i) => ({ q: f.q, a: f.a, order: i })));
  await db.insert(s.bookingSteps).values(
    bookingSteps.map((b, i) => ({ title: b.title, body: b.body, order: i }))
  );
  await db.insert(s.textItems).values([
    ...tips.map((body, i) => ({ kind: "tip" as const, body, order: i })),
    ...terms.map((body, i) => ({ kind: "term" as const, body, order: i })),
  ]);
  console.log("  • info (testimonials, locations, faqs, steps, tips, terms)");

  /* ---------- legal pages (editable) ---------- */
  const termsBody = terms.map((t, i) => `${i + 1}. ${t}`).join("\n\n");
  const privacyBody = [
    "Andaman Studio respects your privacy. This policy explains what information we collect when you book a shoot or contact us, and how we use it.",
    "Information we collect: your name, phone number, email and booking details — shared by you when enquiring or booking via WhatsApp, phone or email.",
    "How we use it: solely to plan, confirm and deliver your photoshoot, and to send you your final images. We do not sell your information to third parties.",
    "Your photographs: we may showcase selected images from your session on our website and social media. If you would prefer your photos not be shared publicly, let us know in writing before the shoot and we will respect that.",
    "Payments: booking payments are handled directly between you and the studio. We do not store card details.",
    "Contact: for any privacy request — including removal of your images from our channels — reach us at " + site.email + " or " + site.phones[0] + ".",
  ].join("\n\n");

  await db.insert(s.legalPages).values([
    { slug: "terms-and-conditions", title: "Terms & Conditions", body: termsBody, order: 0 },
    { slug: "privacy-policy", title: "Privacy Policy", body: privacyBody, order: 1 },
  ]);
  console.log("  • legal pages (terms, privacy)");

  /* ---------- home image slots ---------- */
  const allGallery = galleryCategories.flatMap((g) => g.images);
  const heroUrl = "/img/beach/best-beach-side-photoshoot-in-havelock.webp";
  const signature = [
    { url: "/img/beach/best-beach-side-photoshoot-in-havelock.webp", label: "Beach", href: "/andaman-beach-photoshoot" },
    { url: "/img/sunset/best-sunset-photography-in-andaman-islands.webp", label: "Sunset", href: "/sunset-shoot-havelock-island" },
    { url: "/img/drone-shoot-andaman-islands.webp", label: "Drone", href: "/drone-shoot-in-andaman" },
    { url: "/img/forest/best-forest-shoot-at-havelock.webp", label: "Forest", href: "/forest-shoot-havelock-island" },
    { url: "/img/cld/candle-light-dinner-photoshoot-in-andaman.webp", label: "Candle-light", href: "/candle-light-dinner-shoot-in-andaman" },
  ];
  const teaser = [
    "/img/beach/best-beach-photoshoot-in-havelock.webp",
    "/img/sunset/best-sunset-couple-shoot-in-andaman.webp",
    "/img/forest/best-forest-shoot-at-havelock.webp",
    "/img/candid/best-candid-photography-in-andaman.webp",
    "/img/cld/candle-light-dinner-photoshoot-in-andaman.webp",
    "/img/post-wedding/premium-post-wedding-shoots.webp",
    "/img/beach/couple-poses-for-photoshoot-in-andaman.webp",
    "/img/sunset/sunset-photoshoot-havelock-island.webp",
  ];
  const instagram = [2, 14, 26, 39, 51, 63].map((i) => allGallery[i]).filter(Boolean);

  await db.insert(s.imageSlots).values({ key: "home.hero", order: 0, mediaId: await mediaId(heroUrl) });
  // Separate portrait-friendly still for phones (owner can swap it in admin → Images).
  await db.insert(s.imageSlots).values({ key: "home.hero.mobile", order: 0, mediaId: await mediaId("/img/beach/honeymoon-couple-andaman-islands-shoot.webp") });
  for (let i = 0; i < signature.length; i++) {
    await db.insert(s.imageSlots).values({
      key: "home.signature", order: i, label: signature[i].label, href: signature[i].href,
      mediaId: await mediaId(signature[i].url),
    });
  }
  for (let i = 0; i < teaser.length; i++) {
    await db.insert(s.imageSlots).values({ key: "home.teaser", order: i, mediaId: await mediaId(teaser[i]) });
  }
  for (let i = 0; i < instagram.length; i++) {
    await db.insert(s.imageSlots).values({ key: "home.instagram", order: i, mediaId: await mediaId(instagram[i]) });
  }
  console.log("  • home image slots");

  console.log("✅ Seed complete.");
  await sql.end();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  await sql.end();
  process.exit(1);
});
