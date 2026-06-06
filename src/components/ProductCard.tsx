"use client";

import { motion } from "motion/react";
import { type Product, formatINR } from "@/data/catalog";
import { whatsappLink } from "@/data/site";
import type { SignatureKind } from "@/data/categoryThemes";

// Per-theme package card — each shoot type gets its own pricing style.
export default function ProductCard({
  product,
  index = 0,
  variant = "editorial",
}: {
  product: Product;
  index?: number;
  variant?: SignatureKind;
}) {
  const enquire = whatsappLink(
    `Hi Andaman Studio! I'm interested in the "${product.name}" package (${formatINR(product.price)}).`
  );

  const wrap = (children: React.ReactNode, extra = "") => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex h-full flex-col ${extra}`}
    >
      {children}
    </motion.div>
  );

  const cta = (label = "Enquire on WhatsApp", cls = "") => (
    <a
      href={enquire}
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-7 inline-flex items-center justify-center px-5 py-3 text-[0.74rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${cls}`}
    >
      {label}
    </a>
  );

  const specs = (markClass: string) => (
    <ul className="mt-6 flex-1 space-y-2.5 border-t border-line pt-6">
      {product.specs.map((s) => (
        <li key={s} className="flex gap-3 text-sm text-on-deep/80">
          <span className={markClass}>—</span>
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );

  /* ---- AERIAL: technical spec-sheet ---- */
  if (variant === "aerial") {
    return wrap(
      <div className={`relative rounded-none border bg-ink-deep-2 p-7 ${product.popular ? "border-gold" : "border-line"}`}>
        <div className="flex items-center justify-between">
          <span className="mono text-[0.62rem] text-gold-soft">UNIT {String(index + 1).padStart(2, "0")}</span>
          {product.popular && <span className="mono text-[0.58rem] uppercase tracking-[0.16em] text-gold">◆ Top</span>}
        </div>
        <h4 className="font-serif mt-3 text-2xl text-on-deep">{product.name}</h4>
        <p className="mono mt-2 text-3xl text-gold">{formatINR(product.price)}</p>
        {specs("mono text-gold mt-[2px] text-xs")}
        {product.note && <p className="mt-4 text-xs italic text-on-deep/50">{product.note}</p>}
        {cta("Request flight →", product.popular ? "bg-gold text-ink-deep hover:bg-gold-soft" : "border border-line text-on-deep hover:border-gold hover:text-gold")}
      </div>,
      ""
    );
  }

  /* ---- ROMANTIC: elegant, centred, gold ---- */
  if (variant === "romantic") {
    return wrap(
      <div className={`relative rounded-3xl border bg-ink-deep-2 p-8 text-center ${product.popular ? "border-gold shadow-[0_0_60px_-30px_rgba(216,168,47,0.6)]" : "border-line"}`}>
        {product.popular && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-[0.58rem] uppercase tracking-[0.18em] text-ink-deep">Most loved</span>
        )}
        <h4 className="font-serif text-2xl text-on-deep">{product.name}</h4>
        <p className="font-serif mt-2 text-4xl italic text-gold-soft">{formatINR(product.price)}</p>
        <ul className="mx-auto mt-6 flex-1 space-y-2.5 border-t border-line pt-6 text-left">
          {product.specs.map((s) => (
            <li key={s} className="flex gap-3 text-sm text-on-deep/80">
              <span className="text-gold-soft mt-[2px]">♥</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
        {product.note && <p className="mt-4 text-xs italic text-on-deep/50">{product.note}</p>}
        {cta("Begin your story →", product.popular ? "rounded-full bg-gold text-ink-deep hover:bg-gold-soft" : "rounded-full border border-line text-on-deep hover:border-gold hover:text-gold")}
      </div>,
      ""
    );
  }

  /* ---- INTIMATE: candlelit dark card with glow ---- */
  if (variant === "intimate") {
    return wrap(
      <div className={`relative overflow-hidden rounded-2xl border bg-ink-deep-2 p-8 ${product.popular ? "border-gold" : "border-line"}`}>
        <div className="glow glow-gold -right-10 -top-10 h-32 w-32 opacity-30" />
        <div className="relative">
          <h4 className="font-serif text-2xl text-on-deep">{product.name}</h4>
          <p className="font-serif mt-2 text-4xl text-gold-soft">{formatINR(product.price)}</p>
          {specs("text-gold-soft mt-[2px]")}
          {product.note && <p className="mt-4 text-xs italic text-on-deep/50">{product.note}</p>}
          {cta("Reserve the evening →", product.popular ? "rounded-full bg-gold text-ink-deep hover:bg-gold-soft" : "rounded-full border border-line text-on-deep hover:border-gold hover:text-gold")}
        </div>
      </div>,
      ""
    );
  }

  /* ---- DRAMATIC: stark, oversized price ---- */
  if (variant === "dramatic") {
    return wrap(
      <div className={`relative rounded-none border-l-2 bg-ink-deep-2 p-7 ${product.popular ? "border-gold" : "border-line"}`}>
        <h4 className="mono text-[0.7rem] uppercase tracking-[0.18em] text-on-deep/70">{product.name}</h4>
        <p className="display mt-1 text-5xl text-on-deep">{formatINR(product.price)}</p>
        {specs("text-gold mt-[2px]")}
        {product.note && <p className="mt-4 text-xs italic text-on-deep/50">{product.note}</p>}
        {cta("Book this →", product.popular ? "bg-gold text-ink-deep hover:bg-gold-soft" : "border border-line text-on-deep hover:border-gold hover:text-gold")}
      </div>,
      ""
    );
  }

  /* ---- ARCHITECTURAL: blueprint thin-line ---- */
  if (variant === "architectural") {
    return wrap(
      <div className={`relative border bg-ink-deep-2 p-7 ${product.popular ? "border-gold" : "border-line"}`}>
        <span className="mono text-[0.6rem] text-gold">{String(index + 1).padStart(2, "0")} / 0{Math.max(1, index + 1)}</span>
        <div className="mt-2 flex items-baseline justify-between border-b border-line pb-4">
          <h4 className="font-serif text-xl text-on-deep">{product.name}</h4>
          <span className="mono text-gold">{formatINR(product.price)}</span>
        </div>
        <ul className="mt-5 flex-1 space-y-2 text-sm text-on-deep/80">
          {product.specs.map((s) => (
            <li key={s} className="flex justify-between gap-3 border-b border-line/60 pb-2">
              <span>{s}</span>
            </li>
          ))}
        </ul>
        {product.note && <p className="mt-4 text-xs italic text-on-deep/50">{product.note}</p>}
        {cta("Enquire →", product.popular ? "bg-gold text-ink-deep hover:bg-gold-soft" : "border border-line text-on-deep hover:border-gold hover:text-gold")}
      </div>,
      ""
    );
  }

  /* ---- EDITORIAL (default) ---- */
  return wrap(
    <div className={`relative rounded-2xl border bg-ink-deep-2 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold ${product.popular ? "border-gold" : "border-line"}`}>
      {product.popular && (
        <span className="absolute -top-3 left-7 rounded-full bg-gold px-3 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-ink-deep">Most loved</span>
      )}
      <h4 className="font-serif text-2xl text-on-deep">{product.name}</h4>
      <p className="font-serif mt-2 text-4xl text-gold">{formatINR(product.price)}</p>
      {specs("text-gold mt-[2px]")}
      {product.note && <p className="mt-4 text-xs italic text-on-deep/50">{product.note}</p>}
      {cta("Enquire on WhatsApp", product.popular ? "rounded-full bg-gold text-ink-deep hover:bg-gold-soft" : "rounded-full border border-line text-on-deep hover:border-gold hover:text-gold")}
    </div>
  );
}
