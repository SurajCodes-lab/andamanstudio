import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { site, whatsappLink, telLink, mailLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Book your Andaman Studio shoot. Call, WhatsApp or email us — based at Govind Nagar 3, Havelock Island, Andaman Islands.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.address.mapsQuery)}&output=embed`;

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact Us"
        intro="Tell us your dates and the story you'd like to capture — we'll take care of the rest. We usually reply within a couple of hours on WhatsApp."
        image="/img/cld/best-honeymoon-couple-cld-photoshoot.webp"
        height="short"
        icon="flame"
        accent="#e6a23c"
      />

      <section className="sec-paper relative overflow-hidden py-16 sm:py-24">
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            {/* Details */}
            <div>
              <span className="eyebrow">Studio</span>
              <h2 className="display text-ink mt-3 text-4xl sm:text-5xl">Let&apos;s talk</h2>
              <p className="text-ink-soft mt-5 max-w-md leading-relaxed">
                {site.shortDesc}
              </p>

              <div className="mt-12 space-y-8">
                <Reveal>
                  <div>
                    <p className="eyebrow mb-2">Call / WhatsApp</p>
                    {site.phones.map((p) => (
                      <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block font-serif text-2xl text-ink hover:text-gold">
                        {p}
                      </a>
                    ))}
                  </div>
                </Reveal>
                <Reveal delay={0.05}>
                  <div>
                    <p className="eyebrow mb-2">Email</p>
                    <a href={mailLink} className="font-serif text-2xl text-ink hover:text-gold break-all">
                      {site.email}
                    </a>
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <div>
                    <p className="eyebrow mb-2">Visit the studio</p>
                    <address className="not-italic text-ink-soft leading-relaxed">
                      {site.address.line1}
                      <br />
                      {site.address.line2}
                      <br />
                      {site.address.line3}
                    </address>
                  </div>
                </Reveal>
                <Reveal delay={0.15}>
                  <div className="flex gap-6 text-sm uppercase tracking-[0.18em]">
                    <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="link-underline text-gold">
                      Instagram
                    </a>
                    <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" className="link-underline text-gold">
                      YouTube
                    </a>
                    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="link-underline text-gold">
                      WhatsApp
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* Form */}
            <div className="ctx-light bg-surface border border-line rounded-2xl p-8 sm:p-10 shadow-[0_30px_80px_-50px_rgba(22,32,30,0.3)]">
              <span className="eyebrow">Enquiry</span>
              <h3 className="font-serif text-ink mt-3 mb-8 text-3xl">Plan your shoot</h3>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      {/* Map */}
      <section className="border-t border-line">
        <div className="relative h-[460px] w-full bg-ink-deep" data-cursor-label="Govind Nagar · 11.98°N">
          <iframe
            src={mapSrc}
            title="Andaman Studio location"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full grayscale-[0.15]"
          />
          {/* Floating directions card */}
          <div className="glass ctx-light pointer-events-auto absolute bottom-6 left-1/2 w-[90%] max-w-md -translate-x-1/2 rounded-xl px-7 py-6 sm:left-8 sm:translate-x-0">
            <span className="eyebrow">Find us</span>
            <p className="font-serif text-ink mt-2 text-xl">{site.address.line2}</p>
            <p className="text-ink-soft mt-1 text-sm">
              {site.address.line1}, {site.address.line3}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.mapsQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-syne bg-gold text-ink-deep hover:bg-gold-soft mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.78rem] font-bold uppercase tracking-[0.12em] transition-colors"
            >
              Get directions →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
