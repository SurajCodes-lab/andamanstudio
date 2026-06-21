"use client";

import { createContext, useContext } from "react";

export type SiteContact = {
  name: string;
  email: string;
  whatsapp: string;
  phones: string[];
  tagline: string;
  social: { instagram: string; instagramHandle: string; youtube: string; youtubeHandle: string };
  address: { line1: string; line2: string; line3: string; mapsQuery: string; mapEmbed?: string };
};

const Ctx = createContext<SiteContact | null>(null);

// Fed once from the DB at the root layout, so every client component reflects
// admin → Settings edits (WhatsApp number, email, social links, phones, etc.).
export function SiteProvider({ value, children }: { value: SiteContact; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite(): SiteContact {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSite must be used within <SiteProvider>");
  return v;
}

/** WhatsApp deep link built from the live settings number. */
export function useWaLink(message?: string): string {
  const { whatsapp } = useSite();
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message ?? "Hi Andaman Studio!")}`;
}
