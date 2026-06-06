import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <section data-hero className="relative flex min-h-[80svh] items-center justify-center overflow-hidden bg-ink-deep text-center">
      <Image
        src="/img/sunset/havelock-island-radhanagar-beach-sunset-shoot.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-50"
      />
      <div className="grain absolute inset-0" />
      <div className="relative z-10 px-5">
        <span className="text-[0.72rem] uppercase tracking-[0.32em] text-gold-soft">
          Lost at sea
        </span>
        <h1 className="display mt-4 text-6xl text-white sm:text-8xl">404</h1>
        <p className="mx-auto mt-5 max-w-md text-white/80">
          This page has drifted off the map. Let&apos;s get you back to the islands.
        </p>
        <Link
          href="/"
          className="bg-gold text-ink-deep hover:bg-gold-soft mt-9 inline-block rounded-full px-8 py-3.5 text-sm uppercase tracking-[0.16em] transition-colors duration-300"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
