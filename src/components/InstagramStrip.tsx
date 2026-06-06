"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { site } from "@/data/site";
import { allGalleryImages } from "@/data/gallery";
import Container from "./Container";
import Reveal from "./Reveal";

// A teaser grid that drives visitors to the studio's Instagram.
const picks = [
  allGalleryImages[2],
  allGalleryImages[14],
  allGalleryImages[26],
  allGalleryImages[39],
  allGalleryImages[51],
  allGalleryImages[63],
].filter(Boolean);

export default function InstagramStrip() {
  return (
    <section className="bg-ink-deep relative overflow-hidden py-24 sm:py-32">
      <Container>
        <div className="mb-12 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="tag mb-5">✦ On the grid</span>
            <h2 className="display text-paper text-4xl sm:text-5xl">
              Follow the journey
              <span className="text-gradient"> daily.</span>
            </h2>
          </div>
          <Reveal delay={0.1}>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-6 py-3 text-sm uppercase tracking-[0.16em] text-gold-soft transition-colors duration-300 hover:bg-gold hover:text-ink-deep"
            >
              {site.social.instagramHandle} →
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {picks.map((src, i) => (
            <motion.a
              key={src + i}
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.06 }}
              className="group relative aspect-square overflow-hidden rounded-md"
            >
              <Image src={src} alt="Andaman Studio on Instagram" fill sizes="(max-width:768px) 50vw, 16vw" className="img-zoom object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-ink-deep/0 transition-colors duration-300 group-hover:bg-ink-deep/45">
                <span className="translate-y-2 text-2xl text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  ⌾
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </Container>
    </section>
  );
}
