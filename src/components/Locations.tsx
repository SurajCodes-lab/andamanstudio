"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { locations } from "@/data/info";
import Container from "./Container";
import SectionHeading from "./SectionHeading";
import { BLUR } from "@/lib/blur";

export default function Locations() {
  return (
    <section className="sec-tint-sand relative overflow-hidden py-24 sm:py-32">
      <div className="glow glow-gold -right-24 top-10 h-80 w-80 opacity-25" />
      <span className="index-numeral pointer-events-none absolute -top-6 left-6 hidden text-[13rem] opacity-40 lg:block">
        04
      </span>
      <Container className="relative">
        <div className="mb-14 max-w-2xl">
          <SectionHeading
            eyebrow="Where we shoot"
            title={
              <>
                The island&apos;s most
                <span className="text-gradient"> beautiful backdrops.</span>
              </>
            }
            intro="From Asia's finest white-sand beach to the quiet black rocks of Kalapathar — we know exactly where the light falls best."
          />
        </div>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:auto-rows-[14.5rem]">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-lg ${
                i === 0 ? "col-span-2 lg:row-span-2" : i === 1 ? "col-span-2" : ""
              }`}
            >
              <div className={`relative ${i === 0 ? "aspect-square lg:aspect-auto lg:h-full" : "aspect-[5/4] lg:aspect-auto lg:h-full"}`}>
                <Image
                  src={loc.image}
                  alt={loc.name}
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={BLUR}
                  className="img-zoom object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/80 via-ink-deep/10 to-transparent" />
                <span className="absolute left-4 top-4 font-serif text-5xl text-white/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-serif text-2xl text-white">{loc.name}</h3>
                  <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-white/80 opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:opacity-100">
                    {loc.blurb}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
