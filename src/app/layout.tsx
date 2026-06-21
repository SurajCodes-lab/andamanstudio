import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import Cursor from "@/components/Cursor";
import NavbarServer from "@/components/NavbarServer";
import Footer from "@/components/Footer";
import FloatingSocial from "@/components/FloatingSocial";
import StickyBookBar from "@/components/StickyBookBar";
import StickyEnquiry from "@/components/StickyEnquiry";
import Preloader from "@/components/Preloader";
import ChromeGate from "@/components/ChromeGate";
import { SiteProvider } from "@/components/SiteProvider";
import { getSite } from "@/lib/db/queries";

// Display/headline face — a modern high-contrast editorial serif for the
// studio brand. Keeps the existing `--font-cormorant` CSS variable so all
// `.display` / `.font-serif` rules pick it up with no further changes.
const fraunces = Fraunces({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Andaman Studio — Cinematic Photography & Film at Havelock Island",
    template: "%s — Andaman Studio",
  },
  description:
    "Andaman Studio is a collective of photographers, videographers and editors capturing cinematic beach, sunset, candle-light dinner, drone and pre/post wedding stories across the Andaman Islands.",
  keywords: [
    "Andaman photography",
    "Havelock Island photoshoot",
    "Radhanagar Beach photographer",
    "candle light dinner shoot",
    "pre post wedding Andaman",
    "drone shoot Andaman",
    "cinematic video Havelock",
  ],
  openGraph: {
    title: "Andaman Studio — Cinematic Photography & Film",
    description:
      "Capturing your story across the Andaman Islands — beach, sunset, candle-light dinner, drone and cinematic wedding films.",
    url: site.url,
    siteName: site.name,
    locale: site.locale,
    type: "website",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#14110b",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const s = await getSite();
  const siteCtx = {
    name: s.name,
    email: s.email,
    whatsapp: s.whatsapp,
    phones: s.phones,
    tagline: s.tagline,
    social: s.social,
    address: s.address,
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    image: `${site.url}/img/beach/best-beach-photoshoot-in-havelock.webp`,
    url: site.url,
    telephone: site.phones[0],
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Govind Nagar 3, Near SBI Bank",
      addressLocality: "Havelock Island",
      addressRegion: "Andaman & Nicobar Islands",
      postalCode: "744211",
      addressCountry: "IN",
    },
    sameAs: [site.social.instagram, site.social.youtube],
    priceRange: "₹₹",
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable} ${jetbrains.variable} ${syne.variable}`}>
      <body className="bg-paper text-ink min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteProvider value={siteCtx}>
        <ChromeGate><Preloader /></ChromeGate>
        <SmoothScroll>
          <ChromeGate><Cursor /></ChromeGate>
          <ChromeGate><ScrollProgress /></ChromeGate>
          <ChromeGate><NavbarServer /></ChromeGate>
          <main className="pb-20 sm:pb-0">{children}</main>
          <ChromeGate><Footer /></ChromeGate>
          <ChromeGate><FloatingSocial /></ChromeGate>
          <ChromeGate><StickyEnquiry /></ChromeGate>
          <ChromeGate><StickyBookBar /></ChromeGate>
        </SmoothScroll>
        </SiteProvider>
      </body>
    </html>
  );
}
