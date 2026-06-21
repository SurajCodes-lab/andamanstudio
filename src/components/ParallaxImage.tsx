"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { BLUR } from "@/lib/blur";

/** Cinematic parallax: the image drifts slower than the scroll, framed in an overflow-hidden box.
 *  Optional viewfinder crop-marks (`frame`) and a mono metadata `caption`. */
export default function ParallaxImage({
  src,
  alt,
  className = "",
  rounded = "rounded-none",
  amount = 60,
  priority = false,
  sizes = "100vw",
  frame = false,
  caption,
}: {
  src: string;
  alt: string;
  className?: string;
  rounded?: string;
  amount?: number;
  priority?: boolean;
  sizes?: string;
  frame?: boolean;
  caption?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${frame ? "framed" : ""} ${rounded} ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0 -top-[12%] h-[124%]">
        <Image src={src} alt={alt} fill preload={priority} sizes={sizes} placeholder="blur" blurDataURL={BLUR} className="object-cover" />
      </motion.div>
      {caption && (
        <span className="meta absolute bottom-3 left-3 z-[4] rounded bg-ink-deep/55 px-2 py-1 text-white/90 backdrop-blur-sm">
          {caption}
        </span>
      )}
      {/* legibility floor: a whisper of shade at the foot so captions never vanish on a bright frame */}
      {caption && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-16 bg-gradient-to-t from-ink-deep/40 to-transparent" />
      )}
    </div>
  );
}
