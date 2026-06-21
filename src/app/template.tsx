"use client";

import { motion } from "motion/react";

// Re-mounts on every route change → gives a smooth page-transition fade.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // NOTE: do NOT animate `filter` here — Motion leaves an inline `filter: blur(0px)`
      // after settling, which makes this full-height div the containing block for every
      // `position: fixed` modal inside a page (they'd render off-screen). Opacity + y only.
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
