import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className = "",
  light = false,
  index,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean; // legacy — colour now follows section context
  index?: string; // e.g. "01" — magazine-style section index
}) {
  void light;
  const alignment =
    align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <Reveal>
          <div className={`mb-5 flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
            {index && <span className="mono text-gold text-[0.72rem]">{index}</span>}
            <span className="h-px w-10 bg-ink/25" />
            <span className="eyebrow">{eyebrow}</span>
          </div>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="display text-ink text-[clamp(2.25rem,4.5vw,3.75rem)] tracking-[-0.02em]">
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p
            className={`text-ink-soft mt-6 max-w-[58ch] text-base leading-relaxed sm:text-lg ${
              align === "center" ? "mx-auto" : ""
            }`}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
