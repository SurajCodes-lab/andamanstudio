"use client";

import { useEffect, useRef } from "react";
import SplitType from "split-type";

// Splits text into characters and reveals them on scroll — cinematic kinetic type.
export default function KineticText({
  text,
  className = "",
  stagger = 0.022,
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const split = new SplitType(el, { types: "words,chars" });
    split.chars?.forEach((c, i) => {
      (c as HTMLElement).style.transitionDelay = `${i * stagger}s`;
    });
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("kt-in");
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      try {
        split.revert();
      } catch {}
    };
  }, [text, stagger]);

  return (
    <span ref={ref} className={`kinetic ${className}`}>
      {text}
    </span>
  );
}
