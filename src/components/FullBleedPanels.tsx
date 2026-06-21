"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { BLUR } from "@/lib/blur";

export interface Panel {
  image: string;
  label: string;
  sub?: string;
  meta?: string;
  href?: string;
  /** object-position class, e.g. "object-[50%_40%]". Defaults to centred. */
  pos?: string;
}

function PanelView({ panel, index }: { panel: Panel; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const inner = (
    <>
      <motion.div style={{ y }} className="absolute inset-0 -top-[8%] h-[116%]">
        <Image
          src={panel.image}
          alt={panel.label}
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          className={`object-cover ${panel.pos ?? "object-[50%_42%]"} transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]`}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/15 to-ink-deep/20" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-[8vh] sm:px-8">
        {panel.meta && <span className="meta mb-4 text-white/75">{panel.meta}</span>}
        <div className="flex items-end justify-between gap-6">
          <div>
            <h3 className="display text-[clamp(2.25rem,6vw,5rem)] leading-[0.95] text-white">
              {panel.label}
            </h3>
            {panel.sub && (
              <p className="mt-3 max-w-md text-base text-white/85 sm:text-lg">{panel.sub}</p>
            )}
          </div>
          <span className="font-serif hidden text-7xl text-white/20 sm:block">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        {panel.href && (
          <span className="link-underline mt-6 w-fit text-sm uppercase tracking-[0.18em] text-gold-soft">
            View work →
          </span>
        )}
      </div>
    </>
  );

  return (
    <div
      ref={ref}
      className="group relative h-[86svh] min-h-[520px] w-full overflow-hidden"
    >
      {panel.href ? (
        <Link href={panel.href} className="block h-full w-full">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}

export default function FullBleedPanels({ panels }: { panels: Panel[] }) {
  return (
    <section className="overflow-x-clip">
      {panels.map((p, i) => (
        <PanelView key={p.image + i} panel={p} index={i} />
      ))}
    </section>
  );
}
