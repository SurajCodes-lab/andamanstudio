"use client";

import { motion } from "motion/react";
import Container from "./Container";
import AnimatedCounter from "./AnimatedCounter";
import { useSite } from "./SiteProvider";

const googleReviews = `https://www.google.com/search?q=${encodeURIComponent(
  "Andaman Studio Havelock Island reviews"
)}`;

// Caption styling — like `.meta` but with a scalable size so the strip stays
// one thin line on a phone (the `.meta` class hard-codes 0.64rem).
const LBL = "font-mono uppercase tracking-[0.12em] text-[0.5rem] leading-tight sm:text-[0.64rem]";

function Stars() {
  return (
    <span className="flex items-center gap-0.5 text-gold" aria-label="Rated 5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.07, type: "spring", stiffness: 260, damping: 14 }}
          className="text-xs sm:text-sm"
        >
          ★
        </motion.span>
      ))}
    </span>
  );
}

/* Brand glyphs — kept monochrome so they sit in the gold/charcoal palette,
   then flash to true brand colour on hover. */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" aria-hidden="true">
      <path d="M12 11v2.9h4.1c-.2 1.1-1.3 3.2-4.1 3.2a4.5 4.5 0 1 1 0-9c1.4 0 2.3.6 2.8 1.1l2-1.9A7.2 7.2 0 1 0 12 19.2c4.1 0 6.8-2.9 6.8-6.9 0-.5 0-.8-.1-1.3z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" aria-hidden="true">
      <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.5 12 4.5 12 4.5s-7 0-8.9.6A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.2zM9.8 15.3V8.7l5.7 3.3z" />
    </svg>
  );
}

// A thin, premium credibility strip: travellers count, a 5-star rating, and
// brand-icon links to where the studio is reviewed. One line on every screen.
export default function ReviewsBar() {
  const site = useSite();
  const channels = [
    { label: "Google", href: googleReviews, Icon: GoogleIcon, hover: "hover:border-[#4285F4] hover:bg-[#4285F4]" },
    { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon, hover: "hover:border-[#E1306C] hover:bg-[#E1306C]" },
    { label: "YouTube", href: site.social.youtube, Icon: YoutubeIcon, hover: "hover:border-[#FF0000] hover:bg-[#FF0000]" },
  ];
  return (
    <section className="relative overflow-hidden border-y border-line/50 bg-ink-deep py-3.5 sm:py-4">
      <div className="glow glow-gold -left-24 top-1/2 h-48 w-48 -translate-y-1/2 opacity-20" />
      <Container className="relative">
        <div className="flex items-center justify-center gap-2 sm:gap-8">
          {/* Travellers photographed */}
          <div className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="font-serif text-base leading-none text-gold-soft sm:text-2xl">
              <AnimatedCounter value={10000} suffix="+" />
            </span>
            <span className={`${LBL} text-on-deep/55`}>
              Travellers<span className="hidden sm:inline"> photographed</span>
            </span>
          </div>

          <span className="h-5 w-px shrink-0 bg-line/70 sm:h-6" aria-hidden="true" />

          {/* Rating */}
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Stars />
            <span className="display text-sm leading-none text-on-deep sm:text-lg">5.0</span>
            <span className={`${LBL} hidden text-on-deep/55 lg:inline`}>· Highest rated at Havelock</span>
          </div>

          <span className="h-5 w-px shrink-0 bg-line/70 sm:h-6" aria-hidden="true" />

          {/* Review channels — icon links */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className={`${LBL} hidden text-on-deep/55 sm:inline`}>Review us</span>
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${c.label} — find & review us`}
                title={c.label}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-soft transition-all duration-300 hover:text-white sm:h-9 sm:w-9 ${c.hover}`}
              >
                <c.Icon />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
