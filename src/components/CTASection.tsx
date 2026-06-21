"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import { BLUR } from "@/lib/blur";
import { useSite, useWaLink } from "./SiteProvider";

export default function CTASection({
  image = "/img/sunset/best-sunset-photography-in-andaman-islands.webp",
  title = "Let's create something timeless.",
  text = "Tell us your dates and the moments you want to remember — we'll craft the perfect session across the islands.",
}: {
  image?: string;
  title?: string;
  text?: string;
}) {
  const site = useSite();
  const wa = useWaLink("Hi Andaman Studio! I'd like to book a session.");
  const tel = `tel:${(site.phones[0] ?? "").replace(/\s/g, "")}`;
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[70vh] min-h-[480px] w-full">
        <Image src={image} alt="" fill sizes="100vw" placeholder="blur" blurDataURL={BLUR} className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/45 via-ink-deep/10 to-ink-deep/20" />

        <div className="absolute inset-0 flex items-center justify-center px-5">
          <div className="glass max-w-2xl rounded-2xl px-8 py-12 text-center sm:px-14 sm:py-16">
            <Reveal>
              <span className="eyebrow">Book your session</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">{title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-5 max-w-lg text-ink-soft">{text}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gold px-8 py-3.5 text-sm uppercase tracking-[0.16em] text-ink-deep transition-colors duration-300 hover:bg-gold-soft"
                >
                  WhatsApp Us
                </a>
                <a
                  href={tel}
                  className="rounded-full border border-ink/25 px-8 py-3.5 text-sm uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
                >
                  {site.phones[0]}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
