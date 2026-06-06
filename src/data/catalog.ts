// Pricing catalog: categories -> products (packages) -> price + specs.
// Sourced from the Andaman Studio Brochure 2025.

export interface Product {
  name: string;
  price: number; // INR
  specs: string[];
  note?: string;
  popular?: boolean;
}

export interface Category {
  id: string;
  title: string;
  blurb: string;
  image: string;
  products: Product[];
}

export const catalog: Category[] = [
  {
    id: "photoshoot",
    title: "Photoshoot Packages",
    blurb:
      "Our elite crew transforms your vision into captivating images with high-end cameras and lighting, shot across Radhanagar Beach, forest and sunset locations.",
    image: "/img/beach/photoshoot-at-radhanagar-beach.webp",
    products: [
      {
        name: "Intro Shoot",
        price: 2000,
        specs: ["Min 15 RAW", "5 Edited", "20 minute shoot", "Radhanagar Beach"],
      },
      {
        name: "Standard Shoot",
        price: 3500,
        specs: ["30 RAW images", "10 Edited", "30 minute shoot", "Radhanagar Beach & Forest"],
      },
      {
        name: "Premium Shoot",
        price: 6000,
        popular: true,
        specs: [
          "40 RAW images",
          "15 Edited",
          "4-shot reel (without music)",
          "1 dress change",
          "45 minute shoot",
          "Radhanagar Beach, Forest & Sunset",
        ],
      },
      {
        name: "Premium Plus Shoot",
        price: 10000,
        specs: [
          "50 RAW images",
          "20 Edited",
          "30-sec cinematic shot with gimbal",
          "Song selection",
          "1 dress change",
          "2 hour shoot",
          "Radhanagar Beach, Forest & Sunset",
        ],
      },
    ],
  },
  {
    id: "pre-post-wedding",
    title: "Pre / Post Wedding Cinematic",
    blurb:
      "Cinematic films and photography that turn your celebration into a keepsake — from a one-minute story to a full multi-location production.",
    image: "/img/post-wedding/premium-post-wedding-shoots.webp",
    products: [
      {
        name: "Basic",
        price: 15000,
        specs: ["1 minute cinematic video", "35 RAW", "15 Processed", "Radhanagar"],
      },
      {
        name: "Standard",
        price: 20000,
        specs: [
          "1 minute cinematic video",
          "50 RAW",
          "25 Processed",
          "Radhanagar + Property Photoshoot or Drone Shoot at property",
        ],
      },
      {
        name: "Memory Maker",
        price: 25000,
        popular: true,
        specs: [
          "2 minute cinematic video",
          "60 RAW",
          "30 Processed",
          "Radhanagar & Kalapathar + CLD video shoot",
        ],
        note: "If you dive, diving video can be added if needed.",
      },
      {
        name: "Premium Cinematic",
        price: 35000,
        specs: [
          "2–3 minute cinematic video",
          "80 RAW",
          "35 Processed",
          "Radhanagar, Kalapathar, Candle Light Dinner, Drone & Property shoot",
        ],
        note: "If you dive, diving video can be added if needed.",
      },
    ],
  },
  {
    id: "candle-light-dinner",
    title: "Candle Light Dinner",
    blurb:
      "Luxury, romance and island serenity glowing in every frame — an unforgettable candlelight dinner shoot at the property.",
    image: "/img/cld/professional-candle-light-dinner-shoot.webp",
    products: [
      {
        name: "Photoshoot",
        price: 4000,
        specs: [
          "At the property",
          "20 RAW images",
          "10 Edited",
          "2 photographers & lighting gear",
        ],
      },
      {
        name: "Cinematic Video",
        price: 5000,
        specs: [
          "At the property",
          "30 sec video",
          "3 photographers & lighting gear",
          "Gimbal shots, manual edits",
          "Manual colour grading & song selection",
        ],
      },
      {
        name: "Combo — Photos + Video",
        price: 8000,
        popular: true,
        specs: [
          "At the property",
          "25 RAW images",
          "12 Edited",
          "30 sec video",
          "3 photographers & lighting gear",
          "Gimbal shots, manual edits",
        ],
      },
    ],
  },
  {
    id: "kalapathar",
    title: "Kalapathar Beach Shoot",
    blurb:
      "The dramatic black rocks and turquoise water of Kalapathar — photo and cinematic options with a dedicated photographer.",
    image: "/img/sunset/havelock-island-radhanagar-beach-sunset-shoot.webp",
    products: [
      {
        name: "Photoshoot",
        price: 3500,
        specs: ["1 hour shoot", "30 RAW", "10 Edited", "Kalapathar only"],
      },
      {
        name: "Photoshoot & Video Template",
        price: 5000,
        specs: ["1 hour shoot", "30 RAW", "10 Edited", "4-shot reel video (without music)"],
      },
      {
        name: "Dedicated Photographer",
        price: 7000,
        specs: ["1 hour shoot", "30 RAW", "15 Edited", "Multiple dress", "Video shoot option"],
        note: "Edited video charged extra.",
      },
      {
        name: "Cinematic Output",
        price: 8000,
        popular: true,
        specs: [
          "1.5 hour shoot",
          "30 RAW",
          "10 Edited",
          "Gimbal shot video",
          "Manual edits & colour grading",
          "Song selection",
        ],
      },
    ],
  },
  {
    id: "drone",
    title: "Drone Shoot",
    blurb:
      "Sweeping aerial perspectives of the islands. All RAW files are shared with you.",
    image: "/img/drone-shoot-andaman-islands.webp",
    products: [
      {
        name: "Drone Standard",
        price: 5000,
        specs: ["30 minute shoot", "30 sec reel video (without music)", "All RAW files shared"],
      },
      {
        name: "Drone Premium",
        price: 8000,
        popular: true,
        specs: [
          "1 hour shoot",
          "45 sec reel video with song selection",
          "Manual edits",
          "All RAW files shared",
        ],
      },
    ],
  },
  {
    id: "property",
    title: "Property Photoshoot",
    blurb:
      "Showcase your resort or villa with crisp photography and optional cinematic video.",
    image: "/img/property/5-star-resorts-shoot-in-havelock-island.webp",
    products: [
      {
        name: "Property Photo Shoot",
        price: 3500,
        specs: ["1 hour shoot", "30 RAW", "10 Edited"],
      },
      {
        name: "Property + Cinematic Video",
        price: 8000,
        popular: true,
        specs: ["2 hour shoot", "30 RAW", "10 Edited", "45 sec video"],
      },
    ],
  },
];

export function getCategory(id: string) {
  return catalog.find((c) => c.id === id);
}

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
