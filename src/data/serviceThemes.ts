import type { IconName } from "@/components/SubjectIcon";

// Per-service themes — each of the 12 shoots gets its own kicker, tagline,
// a subtle subject "accent" (used only for soft glows + the kicker), and a
// distinct signature layout. The base stays dark charcoal + gold; the accent
// gives each page its own atmosphere (forest = green, sunset = amber, …).
export type ServiceLayout =
  | "immersive"
  | "lush"
  | "candid"
  | "film"
  | "aerial"
  | "intimate"
  | "dramatic"
  | "architectural";

export interface ServiceTheme {
  kicker: string;
  tagline: string;
  accent: string;
  layout: ServiceLayout;
  icon: IconName;
}

export const serviceThemes: Record<string, ServiceTheme> = {
  "andaman-beach-photoshoot": { kicker: "Sand & turquoise", tagline: "Golden light on Asia's finest beach.", accent: "#2bb6c4", layout: "immersive", icon: "wave" },
  "forest-shoot-havelock-island": { kicker: "Into the green", tagline: "Cool canopy, rich natural depth.", accent: "#5aa85f", layout: "lush", icon: "leaf" },
  "sunset-shoot-havelock-island": { kicker: "Golden hour", tagline: "When the sky turns to fire.", accent: "#e2942f", layout: "immersive", icon: "sun" },
  "andaman-candid": { kicker: "Unposed & true", tagline: "The in-between moments, caught.", accent: "#cf9a45", layout: "candid", icon: "camera" },
  "birthday-shoot-in-andaman": { kicker: "Celebrate", tagline: "Your day, beautifully marked.", accent: "#d85a55", layout: "candid", icon: "balloon" },
  "post-wedding-shoot": { kicker: "Your love story", tagline: "Cinematic, across the islands.", accent: "#d8a82f", layout: "film", icon: "rings" },
  "cinematic-video-shoot-at-havelock-island": { kicker: "Roll camera", tagline: "Gimbal-shot, colour-graded films.", accent: "#95a0c0", layout: "film", icon: "film" },
  "memory-make": { kicker: "Memory maker", tagline: "Your whole trip, woven into a film.", accent: "#d3a04a", layout: "film", icon: "film" },
  "candle-light-dinner-shoot-in-andaman": { kicker: "After dark", tagline: "Romance, lit by candlelight.", accent: "#e6a83a", layout: "intimate", icon: "flame" },
  "kalapathar-beach-shoot": { kicker: "Black rock & turquoise", tagline: "Dramatic, quiet, cinematic.", accent: "#6b7d8a", layout: "dramatic", icon: "mountain" },
  "drone-shoot-in-andaman": { kicker: "From above", tagline: "The islands, seen at altitude.", accent: "#3aa6c4", layout: "aerial", icon: "drone" },
  "andaman-property": { kicker: "Spaces, shown well", tagline: "Clean, inviting — built for bookings.", accent: "#a59a86", layout: "architectural", icon: "building" },
};

export const getServiceTheme = (slug: string): ServiceTheme =>
  serviceThemes[slug] ?? {
    kicker: "The experience",
    tagline: "Crafted across the Andaman Islands.",
    accent: "#d8a82f",
    layout: "immersive",
    icon: "aperture",
  };
