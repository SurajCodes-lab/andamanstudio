import type { IconName } from "@/components/SubjectIcon";

// Per-category visual themes — kicker, tagline, subject icon and a distinct
// "signature" section design on /category/[slug].
export type SignatureKind =
  | "editorial"
  | "romantic"
  | "intimate"
  | "dramatic"
  | "aerial"
  | "architectural";

export interface CategoryTheme {
  kicker: string;
  tagline: string;
  signature: SignatureKind;
  icon: IconName;
  accent: string;
}

export const categoryThemes: Record<string, CategoryTheme> = {
  photoshoot: { kicker: "Signature sessions", tagline: "Where the islands meet the lens.", signature: "editorial", icon: "aperture", accent: "#2bb6c4" },
  "pre-post-wedding": { kicker: "Your love story", tagline: "Cinematic films that move the way you do.", signature: "romantic", icon: "rings", accent: "#d8a82f" },
  "candle-light-dinner": { kicker: "After dark", tagline: "Romance, lit by candlelight.", signature: "intimate", icon: "flame", accent: "#e6a83a" },
  kalapathar: { kicker: "Black rock & turquoise", tagline: "Dramatic, quiet, endlessly cinematic.", signature: "dramatic", icon: "mountain", accent: "#6b7d8a" },
  drone: { kicker: "From above", tagline: "The islands, seen at altitude.", signature: "aerial", icon: "drone", accent: "#3aa6c4" },
  property: { kicker: "Spaces, beautifully shown", tagline: "Clean, inviting — built for bookings.", signature: "architectural", icon: "building", accent: "#a59a86" },
};

export const getCategoryTheme = (slug: string): CategoryTheme =>
  categoryThemes[slug] ?? {
    kicker: "Category",
    tagline: "Crafted across the Andaman Islands.",
    signature: "editorial",
    icon: "aperture",
    accent: "#d8a82f",
  };
