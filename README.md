# Andaman Studio — Website

A complete redesign of [andaman.studio](https://andaman.studio) in **Next.js 16** — a
bright, airy, cinematic experience for a photography & videography studio on Havelock
Island. Same URL slugs as the original (with 301s from the old `.html` paths), the same
homepage YouTube showreel, and the brochure pricing surfaced as a browsable catalogue.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** with custom design tokens (`src/app/globals.css`)
- **Motion** (Framer Motion) — scroll reveals, parallax, hero animation, lightbox
- **Lenis** — smooth scrolling
- Fonts: **Cormorant Garamond** (display serif) + **Inter** (sans)

## Design language

Bright airy luxury with cinematic touches: ivory/sand palette, ocean-teal & sunset-gold
accents, oversized serif display, glassmorphism (navbar, cards, overlays), letterboxed
widescreen hero, film grain, slow-zoom and parallax imagery, and animation throughout.

## Project structure

```
src/
  app/
    page.tsx                     # Home (YouTube hero + sections)
    [slug]/page.tsx              # 12 data-driven service pages (SSG)
    packages/   services/        # core pages
    gallery/    about/  contact/
    sitemap.ts  robots.ts  not-found.tsx
  components/                    # Navbar, Footer, hero, cards, gallery, etc.
  data/
    site.ts      # contact, social, nav, hero video id
    services.ts  # 12 services (slugs preserve original URLs)
    catalog.ts   # categories -> products -> pricing (from the brochure)
    info.ts      # FAQ, tips, T&C, booking, testimonials
scripts/
  fetch-assets.mjs               # mirrors images from the live site into public/img
  gen-gallery.mjs                # generates src/data/gallery.ts (categorised portfolio)
  audit-shots.mjs                # full-page screenshots (scrolls to fire animations)
  responsive-audit.mjs           # 36-viewport overflow audit
  retina-check.mjs               # dpr 2/3 layout + srcset check
```

## Category-centric structure

The site is organised around **categories** (the header shows them all inline):
Photoshoot · Pre/Post Wedding · Candle-Light Dinner · Kalapathar · Drone · Property.

- Each category has a rich page at **`/category/[slug]`** carrying its **packages + pricing**,
  its **photos** (migrated by folder) and its **films** (YouTube reels migrated from the
  old site), plus the related sessions.
- `src/data/categories.ts` is the single source — it merges `catalog.ts` (pricing),
  `gallery.ts` (images) and migrated video IDs. Regenerate gallery data with
  `node scripts/gen-gallery.mjs`; re-scrape the old site with `node scripts/scrape-old.mjs`.
- **Films auto-play sequentially** (`VideoReel`) — the showreel advances to the next clip
  on end (muted autoplay, unmute button, thumbnail strip to jump), no click-to-load.
- `/packages` remains the pricing overview; each category there links into its full page.

## Creative direction — "viewfinder / photographer's craft"

The site is art-directed like looking through a camera: a **viewfinder hero overlay**
(REC, coordinates, ƒ-stop, 4K·24FPS, corner brackets), **mono technical captions** on
imagery (`LOCATION · LENS · ƒ-stop`), **crop-mark framing** on feature photos, a film
**contact sheet** (greyscale→colour "develop" on hover, on `/gallery`) with **sprocket
film-strips**, and an **aperture/iris** motif. Cinematic dark base with light editorial
breaks, scroll-pinned reel, bento grids, custom cursor, blur-up imagery, page transitions.

Contact form is **WhatsApp-based UI** (no backend). A branded **OG share image** is
generated at `/opengraph-image`.

## Photography-studio features

- **Filterable portfolio** (`/gallery`) — browse 75 frames by category (Beach, Sunset,
  Forest, Candid, Candle-Light, Pre/Post Wedding, Property, Birthday), with a full-screen
  lightbox (arrow-key navigation).
- **Brochure-grounded content** — credentials trust strip (Highest Rated · Top Kit · Top
  Edit Team · 10k+), mission statement, "Highest Rated" badges on the cover's flagship
  sessions, a **Locations** showcase (Radhanagar, the forest, Kalapathar, Beach No. 5),
  and a **downloadable 2025 brochure** (`/andaman-studio-brochure-2025.pdf`).
- **Instagram strip** driving to `@andaman.studio`.

## Content & data

All copy, pricing and imagery references live in `src/data/*`. The pricing catalogue is
modelled as **categories → products → pricing**, rendered on `/packages` and contextually
on each service page.

> Imagery in `public/img` is currently **mirrored from the live site as scaffolding** —
> swap in final photography/video by replacing files at the same paths (or re-run
> `node scripts/fetch-assets.mjs`). The homepage hero video id is set in `src/data/site.ts`.

## URL preservation (SEO)

`next.config.ts` 301-redirects every old `.html` URL to its clean equivalent
(`/about.html → /about`, `/contacts.html → /contact`, each service slug, etc.), generated
from the same slug list as the routes.

## Develop

```bash
npm run dev      # http://localhost:3000
npm run build    # production build (prerenders all routes + sitemap)
npm run start    # serve the production build
```

## Responsive

Audited across **36 viewports** (iPhone SE 320px → 4K/ultrawide 3840px) via
`scripts/responsive-audit.mjs` (puppeteer-core + Edge), which flags any horizontal
overflow per page/size. `html { overflow-x: clip }` is a global safety net.

```bash
node scripts/responsive-audit.mjs   # needs the prod server running on :3000
```



## To do before launch

- Replace scaffold imagery with final photos/video.
- Optional: wire the contact form to a real backend/email (currently a WhatsApp deep-link).
- Update social links / phone numbers in `src/data/site.ts` if they change.
