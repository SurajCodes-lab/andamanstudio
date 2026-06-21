import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import ParallaxImage from "@/components/ParallaxImage";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import { site } from "@/data/site";
import { tips } from "@/data/info";
import { getTestimonials } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Andaman Studio is a collective of photographers, videographers and editors based on Havelock Island, capturing cinematic island stories with high-end kit and a top editing team.",
  alternates: { canonical: "/about" },
};

const equipment = [
  "Professional DSLR & mirrorless bodies",
  "Cinematic gimbals & stabilisers",
  "Studio-grade lighting & modifiers",
  "Drones for aerial coverage",
  "Manual colour grading suite",
  "Backup storage for every shoot",
];

export default async function AboutPage() {
  const testimonials = await getTestimonials();
  return (
    <>
      <PageHero
        eyebrow="The Studio — est. Havelock"
        title="About Andaman Studio"
        intro="A collective of photographers, videographers and editors who came together to capture moments from your journey across the Andaman Islands."
        image="/img/post-wedding/premium-post-wedding-shoots.webp"
        icon="aperture"
        accent="#d8a82f"
      />

      {/* Story */}
      <section className="sec-paper py-24 sm:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                index="A · 01"
                eyebrow="Our story"
                title={<>Island-born, <em className="font-serif text-gold">cinematic</em> at heart.</>}
                intro="Introducing our elite crew, where creativity meets precision. We transform your vision into captivating images with high-end cameras and lighting, bringing your concepts to life with unparalleled finesse. Your moments, our expertise — together, we craft photographic masterpieces."
              />
              <Reveal delay={0.15}>
                <div className="mt-10 grid grid-cols-3 gap-6">
                  {[
                    { v: site.stat.value, l: "Customers served" },
                    { v: "Top", l: "Editing team" },
                    { v: "Top", l: "Camera kit" },
                  ].map((s) => (
                    <div key={s.l}>
                      <p className="font-serif text-gold text-4xl">{s.v}</p>
                      <p className="text-ink-mute mt-1 text-xs uppercase tracking-[0.16em]">{s.l}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal direction="left">
              <div className="grid grid-cols-2 gap-4">
                <ParallaxImage src="/img/candid/couple-candid-shoot-in-andaman.webp" alt="Candid couple shoot" className="aspect-[3/4] rounded-sm" sizes="40vw" amount={40} frame caption="CANDID · 50MM" />
                <ParallaxImage src="/img/forest/honeymoon-couple-forest-shoot-andaman-islands.webp" alt="Forest shoot" className="mt-12 aspect-[3/4] rounded-sm" sizes="40vw" amount={70} frame caption="FOREST · ƒ/2.0" />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Equipment — light break */}
      <section className="sec-ivory py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <Reveal direction="right">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-[0_30px_70px_-40px_rgba(22,32,30,0.4)]">
                <Image
                  src="/img/cld/professional-candle-light-dinner-shoot.webp"
                  alt="Andaman Studio on a shoot"
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
                <div className="glass absolute bottom-4 left-4 right-4 rounded-lg px-5 py-4">
                  <p className="font-serif text-xl text-ink">Top kit, top edit team</p>
                  <p className="text-ink-mute text-[0.7rem] uppercase tracking-[0.18em]">
                    Every shoot, fully backed up
                  </p>
                </div>
              </div>
            </Reveal>

            <div>
              <SectionHeading index="A · 02" eyebrow="The kit" title="Built for the cinematic" />
              <p className="text-ink-soft mt-5 max-w-lg leading-relaxed">
                From capture to colour grade, we run a professional pipeline so every frame
                holds up — on a phone, a print, or the big screen.
              </p>
              <div className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {equipment.map((e, i) => (
                  <Reveal key={e} delay={i * 0.05}>
                    <div className="flex items-start gap-4 border-t border-line pt-5">
                      <span className="font-serif text-gold text-lg leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-ink-soft text-sm leading-relaxed">{e}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Tips & tricks */}
      <section className="sec-paper py-24 sm:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <Reveal direction="right">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <Image src="/img/sunset/perfect-sunset-shoots-at-havelock.webp" alt="Sunset styling" fill sizes="50vw" className="object-cover" />
              </div>
            </Reveal>
            <div>
              <SectionHeading index="A · 03" eyebrow="Before your shoot" title="Tips & tricks" className="mb-10" />
              <ul className="space-y-5">
                {tips.map((t, i) => (
                  <Reveal key={i} delay={i * 0.05}>
                    <li className="flex gap-4">
                      <span className="font-serif text-gold text-xl">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-ink-soft leading-relaxed">{t}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <Testimonials items={testimonials} />

      <CTASection />
    </>
  );
}
