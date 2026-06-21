const WORDS = [
  "Beach Portraits",
  "Cinematic Films",
  "Candle-Light Dinners",
  "Drone Aerials",
  "Sunset Sessions",
  "Pre / Post Wedding",
  "Forest Shoots",
  "Memory Maker",
];

const PLACES = [
  "Radhanagar",
  "Kalapathar",
  "Havelock Island",
  "Beach No. 5",
  "The Forest",
  "Andaman & Nicobar",
];

export default function Marquee() {
  const row = [...WORDS, ...WORDS];
  const places = [...PLACES, ...PLACES];
  return (
    <div aria-hidden className="relative overflow-hidden border-y border-line bg-paper py-7">
      {/* big serif row */}
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-serif text-4xl text-ink sm:text-6xl">{w}</span>
            <span className="text-gold text-2xl sm:text-3xl">✦</span>
          </span>
        ))}
      </div>
      {/* thin mono row, reverse direction */}
      <div className="mt-4 flex w-max animate-marquee-reverse gap-6 whitespace-nowrap">
        {places.map((p, i) => (
          <span key={i} className="flex items-center gap-6">
            <span className="mono text-[0.7rem] uppercase tracking-[0.28em] text-ink-mute">{p}</span>
            <span className="text-gold/60 text-xs">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
