import PageHero from "./PageHero";
import Container from "./Container";
import CTASection from "./CTASection";

export default function LegalView({ page }: { page: { title: string; body: string } }) {
  const paras = page.body.split(/\n\s*\n/).filter(Boolean);
  return (
    <>
      <PageHero
        eyebrow="Andaman Studio"
        title={page.title}
        image="/img/sunset/perfect-sunset-shoots-at-havelock.webp"
        height="short"
      />
      <section className="sec-paper py-16 sm:py-24">
        <Container size="narrow">
          <div className="space-y-5 leading-relaxed text-ink-soft">
            {paras.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
