"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

// Cinematic custom cursor: a lagging ring + a precise dot. Only on fine-pointer
// devices (desktop); touch devices keep the native cursor.
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest?.("a, button, [data-cursor], input, textarea, select");
      setActive(!!t);
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: rx, y: ry }}
        animate={{ scale: active ? 1.9 : 1, opacity: active ? 0.9 : 0.7 }}
        transition={{ scale: { duration: 0.25 }, opacity: { duration: 0.25 } }}
        className="pointer-events-none fixed left-0 top-0 z-[10000] -ml-[17px] -mt-[17px] h-[34px] w-[34px] rounded-full border border-gold-soft/70 mix-blend-difference"
      />
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[10000] -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-gold-soft"
      />
    </>
  );
}
