import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Hanken_Grotesk, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
    <html lang="en" className={`${cormorant.variable} ${hanken.variable} ${jetbrains.variable} ${syne.variable}`}>
      <body className="bg-paper text-ink min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <Cursor />
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFab />
        </SmoothScroll>
      </body>
    </html>
  );
}
