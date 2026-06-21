// Seasonal pricing resolver — shared by the public booking widget and admin.

export type Tier = { label: string; startOn: string; endOn: string; price: number };

/** Resolve the price for a given ISO date (yyyy-mm-dd): the first matching tier, else the base price. */
export function priceForDate(basePrice: number, tiers: Tier[], date: string): { price: number; tier: Tier | null } {
  for (const t of tiers) {
    if (date >= t.startOn && date <= t.endOn) return { price: t.price, tier: t };
  }
  return { price: basePrice, tier: null };
}

/** A compact human label for a tier's date window, e.g. "20 Dec – 05 Jan". */
export function tierRange(t: Pick<Tier, "startOn" | "endOn">): string {
  const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  return `${fmt(t.startOn)} – ${fmt(t.endOn)}`;
}
