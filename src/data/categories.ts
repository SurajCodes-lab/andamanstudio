// Unified category layer — the spine of the site.
// Each category carries its PRODUCTS (pricing, from the brochure), its IMAGES
// (migrated from the old site, by folder) and its VIDEOS (reels migrated from the
// old site). Categories drive the header nav and the /category/[slug] pages.
import { catalog, type Category } from "./catalog";
import { galleryCategories } from "./gallery";

export interface FullCategory extends Category {
  slug: string;
  heroImage: string;
  longDescription: string;
  images: string[];
  videoIds: string[];
  serviceSlugs: string[];
}

interface Meta {
  longDescription: string;
  folderIds: string[];
  extraImages?: string[];
  videoIds: string[];
  serviceSlugs: string[];
  heroImage?: string;
}

const META: Record<string, Meta> = {
  photoshoot: {
    longDescription:
      "Our flagship sessions across the islands' most beautiful backdrops — Radhanagar Beach, the forest, sunset shores and candid moments. High-end cameras, professional lighting and a top edit team turn your concepts into captivating, gallery-ready images.",
    folderIds: ["beach", "forest", "sunset", "candid", "bday"],
    videoIds: [],
    serviceSlugs: [
      "andaman-beach-photoshoot",
      "forest-shoot-havelock-island",
      "sunset-shoot-havelock-island",
      "andaman-candid",
      "birthday-shoot-in-andaman",
    ],
    heroImage: "/img/beach/best-beach-photoshoot-in-havelock.webp",
  },
  "pre-post-wedding": {
    longDescription:
      "Cinematic pre and post wedding productions that move across the island's finest locations to tell your story — gimbal-stabilised footage, manual colour grading and a hand-picked soundtrack, paired with a polished photo gallery.",
    folderIds: ["post-wedding"],
    videoIds: ["YaeLJka3QmI", "dBIhufT2UNg", "MycZGxtgY3w"],
    serviceSlugs: [
      "post-wedding-shoot",
      "cinematic-video-shoot-at-havelock-island",
      "memory-make",
    ],
    heroImage: "/img/post-wedding/premium-post-wedding-shoots.webp",
  },
  "candle-light-dinner": {
    longDescription:
      "On the pristine shores of the Andamans, our premium team crafts an unforgettable candlelight dinner — where luxury, romance and island serenity glow in every frame. Choose a photo session, a cinematic film, or both.",
    folderIds: ["cld"],
    videoIds: ["MycZGxtgY3w"],
    serviceSlugs: ["candle-light-dinner-shoot-in-andaman"],
    heroImage: "/img/cld/professional-candle-light-dinner-shoot.webp",
  },
  kalapathar: {
    longDescription:
      "The dramatic black rocks and clear shallows of Kalapathar make a strikingly different, quieter backdrop. Photo and cinematic options with a dedicated photographer and fully colour-graded output.",
    folderIds: [],
    extraImages: [
      "/img/sunset/havelock-island-radhanagar-beach-sunset-shoot.webp",
      "/img/sunset/couple-sunset-shoot-havelock-island.webp",
      "/img/sunset/best-sunset-photography-in-andaman-islands.webp",
      "/img/beach/best-beach-side-photoshoot-in-havelock.webp",
      "/img/sunset/perfect-sunset-shoots-at-havelock.webp",
      "/img/beach/premium-photoshoot-in-havelock.webp",
      "/img/sunset/radhanagar-beach-candid-sunset-photoshoot.webp",
      "/img/beach/couple-poses-for-photoshoot-in-andaman.webp",
    ],
    videoIds: ["uoieN7ygm5E", "qcuNbZM9U_E", "JfOJ-i32Gc8", "rIPJ8J1Q1vE", "YZFdL2aDAfs", "zb0LV-UG43s"],
    serviceSlugs: ["kalapathar-beach-shoot"],
    heroImage: "/img/sunset/havelock-island-radhanagar-beach-sunset-shoot.webp",
  },
  drone: {
    longDescription:
      "See the islands from a new height. Sweeping aerial reels of the coastline, forest and turquoise shallows — with optional song selection and manual edits. All RAW files are shared with you.",
    folderIds: [],
    extraImages: [
      "/img/drone-shoot-andaman-islands.webp",
      "/img/sunset/havelock-island-radhanagar-beach-sunset-shoot.webp",
      "/img/beach/best-beach-photoshoot-in-havelock.webp",
      "/img/sunset/best-sunset-photography-in-andaman-islands.webp",
    ],
    videoIds: ["rIPJ8J1Q1vE", "uoieN7ygm5E", "YaeLJka3QmI", "JfOJ-i32Gc8", "qcuNbZM9U_E", "zb0LV-UG43s"],
    serviceSlugs: ["drone-shoot-in-andaman"],
    heroImage: "/img/drone-shoot-andaman-islands.webp",
  },
  property: {
    longDescription:
      "Show your resort, villa or restaurant at its best — clean, inviting property photography with an optional cinematic walkthrough, built for bookings.",
    folderIds: ["property"],
    videoIds: [],
    serviceSlugs: ["andaman-property"],
    heroImage: "/img/property/5-star-resorts-shoot-in-havelock-island.webp",
  },
};

function imagesFor(folderIds: string[], extra?: string[]): string[] {
  const fromFolders = folderIds.flatMap(
    (id) => galleryCategories.find((c) => c.id === id)?.images ?? []
  );
  return [...new Set([...(extra ?? []), ...fromFolders])];
}

export const categories: FullCategory[] = catalog.map((c: Category) => {
  const m = META[c.id];
  return {
    ...c,
    slug: c.id,
    heroImage: m.heroImage ?? c.image,
    longDescription: m.longDescription,
    images: imagesFor(m.folderIds, m.extraImages),
    videoIds: m.videoIds,
    serviceSlugs: m.serviceSlugs,
  };
});

export const getFullCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const categorySlugs = categories.map((c) => c.slug);

// Short labels for the header (kept compact so every category fits inline).
const SHORT: Record<string, string> = {
  photoshoot: "Photoshoot",
  "pre-post-wedding": "Weddings",
  "candle-light-dinner": "Candle-Light",
  kalapathar: "Kalapathar",
  drone: "Drone",
  property: "Property",
};

export const categoryNav = categories.map((c) => ({
  label: c.title,
  short: SHORT[c.slug] ?? c.title,
  href: `/category/${c.slug}`,
  slug: c.slug,
}));
