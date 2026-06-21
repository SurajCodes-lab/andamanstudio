import Link from "next/link";
import { categoryNav } from "@/data/categories";
import Container from "./Container";
import { getSite } from "@/lib/db/queries";

const explore = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default async function Footer() {
  // Contact facts / social / stat all read from the DB so admin Settings edits reflect.
  const site = await getSite();
  const whatsappLink = () => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Andaman Studio! I'd like to book a shoot.")}`;
  const mailLink = `mailto:${site.email}`;
  return (
    <footer className="relative overflow-hidden text-on-deep">
      {/* Ink-deep anchor — the page's single grounding dark band */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(165deg, #11201d 0%, #0c1513 100%)" }}
      />
      <div className="gold-rule absolute inset-x-0 top-0 h-px opacity-60" />

      <Container className="relative">
        {/* Statement line */}
        <div className="flex flex-col items-start gap-6 border-b border-on-deep/12 py-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo.svg" alt="Andaman Studio" className="h-16 w-auto" />
            <span className="mt-4 text-[0.72rem] uppercase tracking-[0.4em] text-on-deep/55">
              The Best at Havelock
            </span>
          </div>
          <p className="font-serif max-w-md text-2xl leading-snug text-gold-soft sm:text-right sm:text-[1.7rem]">
            Capturing the Andamans, one frame at a time.
          </p>
        </div>

        {/* Link columns */}
        <div className="grid gap-12 py-16 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <p className="max-w-xs text-sm leading-relaxed text-on-deep/65">{site.shortDesc}</p>
            <div className="mt-8 flex items-baseline gap-3">
              <span className="font-serif text-6xl text-gold-soft">{site.stat.value}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-on-deep/55">{site.stat.label}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-sm uppercase tracking-[0.16em] text-ink-deep transition-all duration-300 hover:bg-gold-soft"
              >
                Book a shoot
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a
                href={site.brochureUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-on-deep/30 px-6 py-3.5 text-sm uppercase tracking-[0.16em] text-on-deep transition-colors duration-300 hover:border-gold-soft hover:text-gold-soft"
              >
                Brochure ↓
              </a>
            </div>
          </div>

          <div>
            <h4 className="eyebrow mb-5 text-gold-soft">Categories</h4>
            <ul className="space-y-3">
              {categoryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline text-sm text-on-deep/75 hover:text-on-deep">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-5 text-gold-soft">Explore</h4>
            <ul className="space-y-3">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline text-sm text-on-deep/75 hover:text-on-deep">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-5 text-gold-soft">Visit & Connect</h4>
            <address className="space-y-1 text-sm not-italic leading-relaxed text-on-deep/75">
              <p>{site.address.line1}</p>
              <p>{site.address.line2}</p>
              <p>{site.address.line3}</p>
            </address>
            <div className="mt-5 space-y-2 text-sm">
              {site.phones.map((p) => (
                <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block text-on-deep/75 hover:text-on-deep">
                  {p}
                </a>
              ))}
              <a href={mailLink} className="block break-all text-on-deep/75 hover:text-on-deep">
                {site.email}
              </a>
            </div>
            <div className="mt-6 flex gap-3">
              {[
                { label: "Instagram", href: site.social.instagram },
                { label: "YouTube", href: site.social.youtube },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-on-deep/25 px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] text-on-deep/80 transition-colors hover:border-gold-soft hover:text-gold-soft"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-on-deep/12 py-8 text-xs text-on-deep/45 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="hover:text-on-deep">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-on-deep">Terms &amp; Conditions</Link>
          </div>
          <p className="uppercase tracking-[0.24em]">Havelock Island · Andaman & Nicobar</p>
        </div>
      </Container>
    </footer>
  );
}
