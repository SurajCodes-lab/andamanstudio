import { site } from "@/data/site";
import Container from "./Container";
import AnimatedCounter from "./AnimatedCounter";

// Brochure cover credentials — a quiet editorial trust band.
export default function TrustStrip() {
  return (
    <section className="bg-tropical relative overflow-hidden">
      <div className="glow glow-gold -right-20 -top-16 h-64 w-64 opacity-30" />
      <Container className="relative">
        <ul className="grid grid-cols-2 sm:grid-cols-4">
          {site.credentials.map((c, i) => (
            <li
              key={c.label}
              className={`flex flex-col items-center justify-center py-10 text-center ${
                i > 0 ? "sm:border-l sm:border-white/20" : ""
              } ${i < 2 ? "border-b border-white/20 sm:border-b-0" : ""} ${
                i % 2 === 1 ? "border-l border-white/20 sm:border-l-0" : ""
              }`}
            >
              <span className="font-serif text-gold-soft text-4xl sm:text-5xl">
                {c.value === "10k+" ? <AnimatedCounter value={10} suffix="k+" /> : c.value}
              </span>
              <span className="mt-1.5 text-[0.66rem] uppercase tracking-[0.2em] text-white/80">
                {c.label}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
