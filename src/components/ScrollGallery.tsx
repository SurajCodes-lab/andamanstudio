"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { BLUR } from "@/lib/blur";

export interface Frame {
  image: string;
  label: string;
  sub?: string;
}

// Signature cinematic section: the section is tall; while it's pinned, a row of
// large frames scrolls horizontally as you scroll vertically.
export default function ScrollGallery({
  frames,
  title,
  eyebrow,
}: {
  frames: Frame[];
  title: string;
  eyebrow: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useEffect(() => {
    const calc = () => {
      if (rowRef.current) {
        setDistance(Math.max(0, rowRef.current.scrollWidth - window.innerWidth + 40));
      }
    };
    calc();
    window.addEventListener("resize", calc);
    const t = setTimeout(calc, 300);
    return () => {
      window.removeEventListener("resize", calc);
      clearTimeout(t);
    };
  }, [frames.length]);

  return (
    <section ref={sectionRef} className="relative bg-paper h-[220vh] sm:h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* Heading */}
        <div className="mb-8 px-5 sm:px-[6vw]">
          <span className="tag mb-4">✦ {eyebrow}</span>
          <h2 className="display text-ink text-4xl sm:text-6xl lg:text-7xl">{title}</h2>
        </div>

        {/* Horizontal track */}
        <motion.div ref={rowRef} style={{ x }} className="flex gap-5 px-5 sm:gap-7 sm:pl-[6vw]">
          {frames.map((f, i) => (
            <article
              key={f.image + i}
              className="group relative h-[58vh] w-[78vw] shrink-0 overflow-hidden rounded-lg sm:w-[44vw] lg:w-[34vw]"
            >
              <Image
                src={f.image}
                alt={f.label}
                fill
                sizes="(max-width:768px) 78vw, 34vw"
                placeholder="blur"
                blurDataURL={BLUR}
                className="img-zoom object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/80 via-transparent to-transparent" />
              <span className="absolute left-5 top-5 font-serif text-6xl text-white/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-serif text-3xl text-white">{f.label}</h3>
                {f.sub && <p className="mt-1 text-sm uppercase tracking-[0.18em] text-white/65">{f.sub}</p>}
              </div>
            </article>
          ))}

          {/* End card */}
          <div className="flex h-[58vh] w-[60vw] shrink-0 flex-col items-start justify-center sm:w-[26vw]">
            <p className="font-serif text-ink text-3xl sm:text-4xl">
              And many more <span className="text-gradient">stories.</span>
            </p>
            <Link href="/gallery" className="link-underline mt-5 text-sm uppercase tracking-[0.18em] text-gold">
              Open the gallery →
            </Link>
          </div>
        </motion.div>

        {/* Progress hint */}
        <div className="mt-8 px-5 sm:px-[6vw]">
          <div className="h-px w-40 overflow-hidden bg-sand">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-full w-full origin-left bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}
