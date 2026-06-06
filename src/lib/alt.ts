// Derive a readable, descriptive alt from an image path. The filenames are
// SEO slugs (e.g. "photoshoot-at-radhanagar-beach.webp"), which make good
// human alt text — far better than one repeated generic string.
export function altFromSrc(src: string): string {
  const file = src.split("/").pop() ?? "";
  const base = file.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim();
  if (!base) return "Andaman Studio photography";
  return base.charAt(0).toUpperCase() + base.slice(1);
}
