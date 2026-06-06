// Single source of truth for studio-wide facts: contact, social, nav, hero video.

export const site = {
  name: "Andaman Studio",
  legalName: "Andaman Studio",
  tagline: "The Best at Havelock",
  shortDesc:
    "A collective of photographers, videographers and editors capturing your story across the Andaman Islands.",
  url: "https://andaman.studio",
  locale: "en_IN",
  heroVideoId: "KKZ2Q8JMV8g", // homepage YouTube hero (kept from the original site)
  stat: { value: "10k+", label: "Customers Served" },
  // Brochure cover credentials.
  credentials: [
    { value: "Highest", label: "Rated" },
    { value: "Top", label: "Kit" },
    { value: "Top", label: "Edit Team" },
    { value: "10k+", label: "Customers Served" },
  ],
  // Brochure mission statement (page 2).
  mission:
    "Embark on a journey to capture your perfect moments amidst the breathtaking beauty of the Andaman Islands with our expert photoshoot team. We assure you that every special moment will be captured and delivered to perfection.",
  // Highest-rated sessions highlighted on the brochure cover.
  highlightedServiceSlugs: [
    "post-wedding-shoot",
    "drone-shoot-in-andaman",
    "birthday-shoot-in-andaman",
    "candle-light-dinner-shoot-in-andaman",
  ],
  brochureUrl: "/andaman-studio-brochure-2025.pdf",
  phones: ["+91 9513290687", "+91 7695070721"],
  whatsapp: "919513290687", // wa.me number, no symbols
  email: "andamanisland.studio@gmail.com",
  address: {
    line1: "Andaman Studio, Govind Nagar 3",
    line2: "Near SBI Bank, Havelock Island",
    line3: "Andaman Islands — 744211",
    mapsQuery: "Andaman Studio, Govind Nagar, Havelock Island, Andaman",
  },
  social: {
    instagram: "https://www.instagram.com/andaman.studio",
    instagramHandle: "@andaman.studio",
    youtube: "https://www.youtube.com/@AndamanStudio",
    youtubeHandle: "@AndamanStudio",
  },
} as const;

export const nav: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Packages", href: "/packages" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Pre-built WhatsApp deep link with a friendly default message.
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  const text =
    message ?? "Hi Andaman Studio! I'd like to know more about your photoshoot packages.";
  return `${base}?text=${encodeURIComponent(text)}`;
}

export const telLink = `tel:${site.phones[0].replace(/\s/g, "")}`;
export const mailLink = `mailto:${site.email}`;
