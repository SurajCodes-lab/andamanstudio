"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav } from "@/data/site";
import SubjectIcon, { type IconName } from "./SubjectIcon";

const primary = nav.filter((n) => n.href !== "/");

type NavData = {
  categories: { label: string; short: string; href: string; slug: string; fromPrice: string }[];
  services: { slug: string; title: string; icon: IconName; accent: string }[];
  contact: { phone: string; tel: string; whatsapp: string };
};

export default function Navbar({ data }: { data: NavData }) {
  const categoryNav = data.categories;
  const services = data.services;
  const contact = data.contact; // phone/tel/whatsapp from the DB (admin Settings)
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null); // open dropdown href
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    // Lets global CSS hide the floating book bar / social cluster while the
    // full-screen menu is open (they sit above the drawer otherwise).
    document.documentElement.classList.toggle("menu-open", open);
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.classList.remove("menu-open");
    };
  }, [open]);

  const linkBase =
    "font-syne text-[0.8rem] font-bold uppercase tracking-[0.1em] transition-colors";

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`glass-nav fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "h-[68px] shadow-[0_14px_44px_-26px_rgba(0,0,0,0.7)]" : "h-[84px]"
        }`}
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />
        <nav className="mx-auto flex h-full max-w-[1640px] items-center justify-between gap-4 px-5 sm:px-8">
          {/* Logo */}
          <Link href="/" aria-label="Andaman Studio — home" className="group shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/logo.svg"
              alt="Andaman Studio"
              className="h-10 w-auto transition-opacity group-hover:opacity-70 sm:h-12"
            />
          </Link>

          {/* Centre nav */}
          <ul className="hidden items-center gap-8 lg:flex">
            {primary.map((item) => {
              const active =
                item.href === "/packages"
                  ? pathname === "/packages" || pathname.startsWith("/category/")
                  : item.href === "/services"
                    ? pathname === "/services"
                    : pathname === item.href;
              const hasMenu = item.href === "/packages" || item.href === "/services";
              const isOpen = menu === item.href;
              return (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => hasMenu && setMenu(item.href)}
                  onMouseLeave={() => hasMenu && setMenu(null)}
                  onFocus={() => hasMenu && setMenu(item.href)}
                  onBlur={(e) => {
                    if (hasMenu && !e.currentTarget.contains(e.relatedTarget as Node)) setMenu(null);
                  }}
                >
                  <Link
                    href={item.href}
                    className={`group/nav relative flex items-center gap-1.5 ${linkBase} ${
                      active ? "text-gold" : "text-on-deep hover:text-gold"
                    }`}
                  >
                    {item.label}
                    {hasMenu && (
                      <span className={`text-[0.6rem] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>▾</span>
                    )}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-[2px] bg-gold transition-all duration-300 ${
                        active ? "w-full" : "w-0 group-hover/nav:w-full"
                      }`}
                    />
                  </Link>

                  <AnimatePresence>
                    {isOpen && item.href === "/packages" && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        style={{ background: "#100d08" }}
                        className="absolute left-1/2 top-[calc(100%+1.1rem)] w-[42rem] max-w-[92vw] -translate-x-1/2 rounded-2xl border border-line p-5 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.95)]"
                      >
                        <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
                          <span className="eyebrow">All packages · pricing</span>
                          <Link href="/packages" className="mono text-[0.66rem] uppercase tracking-[0.16em] text-gold hover:text-gold-soft">View all →</Link>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {categoryNav.map((c, i) => (
                            <Link key={c.href} href={c.href} className="group/item flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 transition-colors hover:bg-gold/10">
                              <span className="flex items-center gap-3">
                                <span className="mono text-[0.62rem] text-gold">{String(i + 1).padStart(2, "0")}</span>
                                <span className="font-serif text-xl font-semibold text-on-deep transition-colors group-hover/item:text-gold">{c.label}</span>
                              </span>
                              <span className="mono text-[0.72rem] font-medium text-gold-soft">from {c.fromPrice}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {isOpen && item.href === "/services" && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        style={{ background: "#100d08" }}
                        className="absolute left-1/2 top-[calc(100%+1.1rem)] w-[44rem] max-w-[92vw] -translate-x-1/2 rounded-2xl border border-line p-5 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.95)]"
                      >
                        <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
                          <span className="eyebrow">All sessions · the work</span>
                          <Link href="/services" className="mono text-[0.66rem] uppercase tracking-[0.16em] text-gold hover:text-gold-soft">View all →</Link>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                          {services.map((s) => (
                            <Link key={s.slug} href={`/${s.slug}`} className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-gold/10">
                              <span style={{ color: s.accent }}><SubjectIcon name={s.icon} className="h-4 w-4" /></span>
                              <span className="font-serif text-base text-on-deep transition-colors group-hover/item:text-gold">{s.title}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* Right: phone + CTA + mobile toggle */}
          <div className="flex shrink-0 items-center gap-4">
            <a
              href={contact.tel}
              className="mono hidden items-center gap-1.5 text-[0.74rem] tracking-[0.08em] text-on-deep transition-colors hover:text-gold xl:inline-flex"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold" fill="currentColor" aria-hidden>
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.05-.24 11.36 11.36 0 003.55.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.55 1 1 0 01-.24 1.05l-2.2 2.2z" />
              </svg>
              {contact.phone}
            </a>
            <span aria-hidden className="hidden h-5 w-px bg-line xl:block" />
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="font-syne group hidden items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-ink-deep transition-colors duration-300 hover:bg-gold-soft sm:inline-flex"
            >
              Book a shoot
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </a>

            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center lg:hidden"
            >
              <div className="flex flex-col gap-[5px]">
                <span className={`h-[2px] w-6 bg-on-deep transition-all duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`h-[2px] w-6 bg-on-deep transition-all duration-300 ${open ? "opacity-0" : ""}`} />
                <span className={`h-[2px] w-6 bg-on-deep transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </div>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile / tablet drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ background: "#100d08" }}
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto px-8 pb-16 pt-28 lg:hidden"
          >
            {/* Ambient gold glow */}
            <span aria-hidden className="glow glow-gold pointer-events-none absolute -right-20 -top-10 h-64 w-64 opacity-25" />

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
              className="eyebrow mb-2 text-gold/80"
            >
              Menu
            </motion.p>

            {/* Primary nav — numbered, editorial, with dividers */}
            <ul className="flex flex-col border-t border-line/40">
              {primary.map((item, i) => {
                const active =
                  item.href === "/packages"
                    ? pathname === "/packages" || pathname.startsWith("/category/")
                    : pathname === item.href;
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between border-b border-line/40 py-3.5"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="mono text-[0.7rem] text-gold/60">{String(i + 1).padStart(2, "0")}</span>
                        <span className={`font-serif text-4xl leading-none transition-colors duration-300 group-hover:text-gold ${active ? "text-gold" : "text-on-deep"}`}>
                          {item.label}
                        </span>
                      </span>
                      <span className={`text-xl text-gold transition-all duration-300 ${active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}>
                        →
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            {/* By package — pill chips */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * primary.length + 0.1, duration: 0.45 }}
            >
              <p className="eyebrow mb-3 mt-8 text-on-deep/50">By package</p>
              <ul className="flex flex-wrap gap-2">
                {categoryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-block rounded-full border border-line px-3.5 py-1.5 text-[0.72rem] uppercase tracking-[0.12em] text-on-deep/70 transition-colors duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold"
                    >
                      {item.short}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Pinned footer: CTA + phone */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.08 * primary.length + 0.2, duration: 0.5 }}
              className="mt-auto pt-10"
            >
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="font-syne group flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-ink-deep transition-colors duration-300 hover:bg-gold-soft"
              >
                Book a shoot
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href={contact.tel}
                className="mono mt-5 flex items-center justify-center gap-2 text-sm text-on-deep/70 transition-colors hover:text-gold"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold" fill="currentColor" aria-hidden>
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.05-.24 11.36 11.36 0 003.55.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.55 1 1 0 01-.24 1.05l-2.2 2.2z" />
                </svg>
                {contact.phone}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
