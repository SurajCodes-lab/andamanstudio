// The 12 service detail pages. Slugs preserve the original site's URLs (minus .html).

export interface ServiceSection {
  heading: string;
  body: string;
}

export interface Service {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string; // short, used on cards
  heroImage: string;
  intro: string;
  sections: ServiceSection[];
  gallery: string[];
  relatedCategoryId: string;
}

export const services: Service[] = [
  {
    slug: "andaman-beach-photoshoot",
    title: "Beach Photoshoot",
    eyebrow: "Radhanagar Beach",
    summary: "Golden-hour portraits on Asia's finest white-sand beaches.",
    heroImage: "/img/beach/best-beach-photoshoot-in-havelock.webp",
    intro:
      "Embark on a journey to capture your perfect moments on the powder-white sands of Radhanagar Beach — consistently ranked among Asia's most beautiful shores.",
    sections: [
      {
        heading: "Where the islands meet the lens",
        body: "Our crew works the soft morning and golden-hour light to frame you against turquoise water and open sky. From candid laughter to styled portraits, every frame is composed to feel effortless and cinematic.",
      },
      {
        heading: "For couples, families & friends",
        body: "Honeymooners, families with little ones, and groups of friends — we tailor the pace and poses to you, so the session feels like a celebration rather than a shoot.",
      },
    ],
    gallery: [
      "/img/beach/photoshoot-at-radhanagar-beach.webp",
      "/img/beach/honeymoon-couple-beach-photoshoot.webp",
      "/img/beach/couple-poses-for-photoshoot-in-andaman.webp",
      "/img/beach/best-beach-side-photoshoot-in-havelock.webp",
      "/img/beach/premium-photoshoot-in-havelock.webp",
      "/img/beach/candid-beach-shoot-andaman.webp",
      "/img/beach/infant-beach-photoshoot-at-havelock-island.webp",
      "/img/beach/friends-beach-shoot-at-havelock.webp",
    ],
    relatedCategoryId: "photoshoot",
  },
  {
    slug: "candle-light-dinner-shoot-in-andaman",
    title: "Candle Light Dinner Shoot",
    eyebrow: "By the shore, after dark",
    summary: "Luxury, romance and island serenity glowing in every frame.",
    heroImage: "/img/cld/professional-candle-light-dinner-shoot.webp",
    intro:
      "On the pristine shores of the Andaman Islands, our premium team crafts an unforgettable candlelight dinner shoot — where luxury, romance and island serenity glow in every frame.",
    sections: [
      {
        heading: "A setting made for two",
        body: "Warm candlelight, the sound of the waves and a table set just for you. We light the scene professionally so the mood stays intimate while the images stay crisp.",
      },
      {
        heading: "Photos, film, or both",
        body: "Choose a photo session, a 30-second cinematic film with gimbal work and manual colour grading, or a combo that captures it all.",
      },
    ],
    gallery: [
      "/img/cld/candle-light-dinner-photoshoot-at-havelock-island.webp",
      "/img/cld/best-cld-photoshoot-in-andaman.webp",
      "/img/cld/best-honeymoon-couple-cld-photoshoot.webp",
      "/img/cld/couple-beach-cld-photoshoot.webp",
      "/img/cld/cld-beach-photoshoot-and-video.webp",
      "/img/cld/cld-photoshoot-havelock-island.webp",
    ],
    relatedCategoryId: "candle-light-dinner",
  },
  {
    slug: "post-wedding-shoot",
    title: "Pre / Post Wedding Shoot",
    eyebrow: "Cinematic celebration",
    summary: "A cinematic film and gallery to relive your celebration.",
    heroImage: "/img/post-wedding/premium-post-wedding-shoots.webp",
    intro:
      "Turn your celebration into a keepsake. Our cinematic pre and post wedding productions move across the island's most beautiful locations to tell your story.",
    sections: [
      {
        heading: "More than a photoshoot",
        body: "Gimbal-stabilised cinematic shots, manual edits, colour grading and a hand-picked soundtrack come together in a film you'll return to for years.",
      },
      {
        heading: "Multi-location productions",
        body: "From a one-minute story at Radhanagar to a full Radhanagar-Kalapathar-candlelight-dinner-drone production, choose the scale that fits your celebration.",
      },
    ],
    gallery: [
      "/img/post-wedding/post-wedding-shoot-in-andaman.webp",
      "/img/post-wedding/couple-post-wedding-andaman-shoot.webp",
      "/img/post-wedding/honeymoon-couple-post-wedding-shoot.webp",
      "/img/post-wedding/post-wedding-shoot-at-havelock.webp",
      "/img/post-wedding/best-photoshoot-for-post-wedding.webp",
      "/img/post-wedding/premium-quality-edits-with-post-wedding-shoot-in-andaman.webp",
    ],
    relatedCategoryId: "pre-post-wedding",
  },
  {
    slug: "forest-shoot-havelock-island",
    title: "Forest Shoot",
    eyebrow: "Inside the green",
    summary: "Lush canopy backdrops a short walk from the beach.",
    heroImage: "/img/forest/best-forest-shoot-at-havelock.webp",
    intro:
      "Just beyond the sand, the forest around Radhanagar offers a cool, green and wonderfully cinematic backdrop — a favourite for couples and families alike.",
    sections: [
      {
        heading: "A change of scenery",
        body: "Dappled light through the canopy and rich greens make for portraits with depth and drama. We pair forest frames with the beach for variety in a single session.",
      },
      {
        heading: "Styling tip",
        body: "Avoid yellows and greens that merge with the foliage — a red dress paired with black, or a long-tail dress and a hat, photographs beautifully here.",
      },
    ],
    gallery: [
      "/img/forest/forest-photoshoot-in-andaman.webp",
      "/img/forest/couple-forest-photoshoot-in-andaman.webp",
      "/img/forest/couple-forest-shoot-near-radhanagar.webp",
      "/img/forest/honeymoon-couple-forest-shoot-andaman-islands.webp",
      "/img/forest/awesome-couple-photoshoots-in-havelockisland.webp",
      "/img/forest/best-shoot-for-couples-at-forest.webp",
      "/img/forest/family-photoshoot-at-forest-at-andaman.webp",
      "/img/forest/premium-shoot-at-havelock-island.webp",
    ],
    relatedCategoryId: "photoshoot",
  },
  {
    slug: "andaman-property",
    title: "Property Photoshoot",
    eyebrow: "Resorts & villas",
    summary: "Crisp photography and cinematic video for hospitality.",
    heroImage: "/img/property/5-star-resorts-shoot-in-havelock-island.webp",
    intro:
      "Show your resort, villa or restaurant at its best. We shoot clean, inviting property photography — with optional cinematic video — built for bookings.",
    sections: [
      {
        heading: "Built for hospitality",
        body: "Interiors, exteriors, suites and dining — composed and lit to make spaces feel as good as they do in person, ready for your website and listings.",
      },
      {
        heading: "Add cinematic motion",
        body: "Layer in a 45-second cinematic walkthrough to give guests a feel for the space before they arrive.",
      },
    ],
    gallery: [
      "/img/property/property-shoot-at-havelock-andaman.webp",
      "/img/property/5-star-property-shoot-in-andaman.webp",
      "/img/property/best-photography-at-havelock.webp",
      "/img/property/resort-photography-for-couples.webp",
      "/img/property/honeymoon-couple-propertyshoot-at-havelock-island.webp",
      "/img/property/couple-photography-at-havelock-island.webp",
    ],
    relatedCategoryId: "property",
  },
  {
    slug: "andaman-candid",
    title: "Candid Photoshoot",
    eyebrow: "Unposed & real",
    summary: "The in-between moments, caught as they happen.",
    heroImage: "/img/candid/best-candid-photoshoot-in-andaman.webp",
    intro:
      "The best frames are often the unplanned ones. Our candid coverage follows the laughter, the glances and the quiet moments — so your gallery feels genuinely yours.",
    sections: [
      {
        heading: "Just be yourself",
        body: "Be yourself and enjoy the moment — we'll do the rest. Working unobtrusively, we capture real emotion across the beach, forest and beyond.",
      },
      {
        heading: "For couples & families",
        body: "Honeymoon couples, families with infants and groups of friends all come alive in candid coverage that tells the story of your day.",
      },
    ],
    gallery: [
      "/img/candid/candid-photography-in-andaman.webp",
      "/img/candid/couple-candid-shoot-in-andaman.webp",
      "/img/candid/honeymoon-couple-candid-photography.webp",
      "/img/candid/moments-photoshoot-candid.webp",
      "/img/candid/family-candid-photoshoot-in-andaman.webp",
      "/img/candid/premium-candid-shoot-in-havelock-island.webp",
    ],
    relatedCategoryId: "photoshoot",
  },
  {
    slug: "sunset-shoot-havelock-island",
    title: "Sunset Shoot",
    eyebrow: "Golden hour",
    summary: "Radhanagar's famous sunsets, in silhouette and glow.",
    heroImage: "/img/sunset/best-sunset-photography-in-andaman-islands.webp",
    intro:
      "Radhanagar Beach is famous for its sunsets. We time the session to the last hour of light for warm, glowing portraits and dramatic silhouettes.",
    sections: [
      {
        heading: "Chasing the light",
        body: "As the sky shifts from gold to rose, we work quickly to capture both the warm glow on your faces and striking silhouettes against the horizon.",
      },
      {
        heading: "A perfect finale",
        body: "A sunset session is the ideal close to a beach-and-forest shoot, sending you home with the islands' signature colours.",
      },
    ],
    gallery: [
      "/img/sunset/sunset-photoshoot-havelock-island.webp",
      "/img/sunset/best-sunset-couple-shoot-in-andaman.webp",
      "/img/sunset/couple-sunset-shoot-havelock-island.webp",
      "/img/sunset/perfect-sunset-shoots-at-havelock.webp",
      "/img/sunset/radhanagar-beach-candid-sunset-photoshoot.webp",
      "/img/sunset/family-sunset-photography-at-havelock-andaman.webp",
      "/img/sunset/couple-sunset-photography-in-andaman.webp",
      "/img/sunset/havelock-island-radhanagar-beach-sunset-shoot.webp",
    ],
    relatedCategoryId: "photoshoot",
  },
  {
    slug: "birthday-shoot-in-andaman",
    title: "Birthday & Anniversary Shoot",
    eyebrow: "Celebrate on the islands",
    summary: "Mark the milestone with a shoot to remember.",
    heroImage: "/img/bday/best-birthday-shoot-in-andaman.webp",
    intro:
      "Celebrating a birthday or anniversary in the Andamans? We bring the setup and the cameras so your milestone is captured in style.",
    sections: [
      {
        heading: "Made for the moment",
        body: "From intimate couple celebrations to family gatherings, we frame the joy, the decor and the people who matter most.",
      },
      {
        heading: "Popular with travellers",
        body: "One of our most-loved sessions — a relaxed, fun shoot that turns your celebration into a lasting memory.",
      },
    ],
    gallery: [
      "/img/bday/birthday-shoot-in-andaman-island.webp",
      "/img/bday/birthday-shoot-andaman-for-couples.webp",
      "/img/bday/popular-birthday-party-photographers.webp",
      "/img/bday/popular-birthday-party-photoshoot.webp",
      "/img/bday/birthday-shoot-andaman-island-packages.webp",
      "/img/bday/birthday-shoot-andaman-island-cost.webp",
    ],
    relatedCategoryId: "photoshoot",
  },
  {
    slug: "drone-shoot-in-andaman",
    title: "Drone Shoot",
    eyebrow: "From above",
    summary: "Sweeping aerial views of beach, forest and reef.",
    heroImage: "/img/drone-shoot-andaman-islands.webp",
    intro:
      "See the islands from a new height. Our drone coverage delivers sweeping aerial reels of the coastline, forest and turquoise shallows — with all RAW files shared.",
    sections: [
      {
        heading: "Aerial storytelling",
        body: "A 30 to 45-second aerial reel — with optional song selection and manual edits — adds scale and drama to any shoot or property.",
      },
      {
        heading: "Everything is yours",
        body: "We share all RAW files from the flight, so you keep the full set of aerial footage.",
      },
    ],
    gallery: [
      "/img/drone-shoot-andaman-islands.webp",
      "/img/sunset/havelock-island-radhanagar-beach-sunset-shoot.webp",
      "/img/beach/best-beach-photoshoot-in-havelock.webp",
    ],
    relatedCategoryId: "drone",
  },
  {
    slug: "cinematic-video-shoot-at-havelock-island",
    title: "Cinematic Video",
    eyebrow: "Motion & sound",
    summary: "Gimbal-shot, colour-graded films of your island story.",
    heroImage: "/img/cinematic-videos.webp",
    intro:
      "Some moments deserve motion and sound. Our cinematic films pair gimbal-stabilised camerawork with manual colour grading and a hand-picked soundtrack.",
    sections: [
      {
        heading: "Crafted frame by frame",
        body: "Manual edits, manual colour grading and song selection turn your footage into a short film — from Radhanagar to Kalapathar Beach.",
      },
      {
        heading: "Pair it with photos",
        body: "Cinematic video works beautifully alongside any photoshoot or as part of a pre/post wedding production.",
      },
    ],
    gallery: [
      "/img/mqdefault_6s.webp",
      "/img/mqdefault_6s-(1).webp",
      "/img/mqdefault_6s-(3).webp",
      "/img/mqdefault_6s-(4).webp",
      "/img/mqdefault_6s-(6).webp",
      "/img/mqdefault_6s-(8).webp",
    ],
    relatedCategoryId: "pre-post-wedding",
  },
  {
    slug: "kalapathar-beach-shoot",
    title: "Kalapathar Beach Shoot",
    eyebrow: "Black rocks, blue water",
    summary: "Dramatic rocks and turquoise water on the quiet coast.",
    heroImage: "/img/sunset/havelock-island-radhanagar-beach-sunset-shoot.webp",
    intro:
      "Kalapathar's dark rocks and clear shallows make for a strikingly different backdrop — quieter than Radhanagar and endlessly cinematic.",
    sections: [
      {
        heading: "A different mood",
        body: "Photo and cinematic options with a dedicated photographer, from a one-hour session to a fully colour-graded cinematic output.",
      },
      {
        heading: "Best paired",
        body: "Often combined with Radhanagar in our Memory Maker and Premium Cinematic productions for a full island story.",
      },
    ],
    gallery: [
      "/img/sunset/couple-sunset-shoot-havelock-island.webp",
      "/img/sunset/best-sunset-photography-in-andaman-islands.webp",
      "/img/beach/best-beach-side-photoshoot-in-havelock.webp",
      "/img/beach/couple-poses-for-photoshoot-in-andaman.webp",
      "/img/sunset/perfect-sunset-shoots-at-havelock.webp",
      "/img/beach/premium-photoshoot-in-havelock.webp",
    ],
    relatedCategoryId: "kalapathar",
  },
  {
    slug: "memory-make",
    title: "Memory Maker",
    eyebrow: "Your whole journey",
    summary: "Moments from across your trip, woven into one film.",
    heroImage: "/img/post-wedding/honeymoon-couple-post-wedding-shoot.webp",
    intro:
      "Want to capture your whole Andaman memory? Memory Maker gathers moments from various locations — your stay, Radhanagar Beach and a candlelight dinner — into a small film to cherish, alongside a photoshoot.",
    sections: [
      {
        heading: "A trip, not just a session",
        body: "We follow the highlights of your journey across the islands and bring them together into a cinematic keepsake with photos to match.",
      },
      {
        heading: "Personal & flexible",
        body: "Locations and moments are chosen around your trip, so the final film feels like a true record of your time in the Andamans.",
      },
    ],
    gallery: [
      "/img/post-wedding/couple-pre-post-wedding-shoot-at-havelock.webp",
      "/img/cld/best-honeymoon-couple-cld-photoshoot.webp",
      "/img/beach/honeymoon-couple-andaman-islands-shoot.webp",
      "/img/sunset/best-sunset-couple-shoot-in-andaman.webp",
      "/img/post-wedding/pre-post-wedding-shoot-in-andaman-islands.webp",
      "/img/cld/couple-beach-cld-photoshoot.webp",
    ],
    relatedCategoryId: "pre-post-wedding",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export const serviceSlugs = services.map((s) => s.slug);
