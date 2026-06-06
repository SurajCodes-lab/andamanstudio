"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Service } from "@/data/services";
import { site } from "@/data/site";
import { BLUR } from "@/lib/blur";

export default function ServiceCard({
  service,
  index = 0,
  big = false,
}: {
  service: Service;
  index?: number;
  big?: boolean;
}) {
  const featured = (site.highlightedServiceSlugs as readonly string[]).includes(service.slug);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link href={`/${service.slug}`} className="group relative block h-full min-h-[11rem] overflow-hidden">
        <Image
          src={service.heroImage}
          alt={service.title}
          fill
          sizes={big ? "(max-width:768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 33vw"}
          placeholder="blur"
          blurDataURL={BLUR}
          className="img-zoom object-cover transition-[filter] duration-500 group-hover:[filter:contrast(1.12)_saturate(1.3)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/10 to-transparent transition-opacity duration-500 group-hover:from-ink-deep/90" />

        {/* top meta row */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="meta text-white/85">
            {featured ? "★ Highest rated" : service.eyebrow}
          </span>
          <span className="mono text-[0.7rem] text-white/70">{String(index + 1).padStart(2, "0")}</span>
        </div>

        {/* gold tick that grows on hover */}
        <span className="absolute bottom-[4.6rem] left-5 h-px w-8 bg-gold transition-all duration-500 group-hover:w-16" />

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className={`font-serif leading-tight text-white ${big ? "text-2xl sm:text-3xl lg:text-4xl" : "text-lg sm:text-2xl"}`}>{service.title}</h3>
            <span className="text-gold-soft text-lg transition-transform duration-300 group-hover:translate-x-1 sm:text-xl">→</span>
          </div>
          {/* Summary: clamped on mobile (no overflow, no info hidden), collapse-reveal on sm+ */}
          <p className="mt-1.5 line-clamp-2 text-[0.78rem] leading-snug text-white/80 sm:mt-2 sm:line-clamp-none sm:max-h-0 sm:overflow-hidden sm:text-sm sm:leading-relaxed sm:opacity-0 sm:transition-all sm:duration-500 sm:group-hover:max-h-24 sm:group-hover:opacity-100">
            {service.summary}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
