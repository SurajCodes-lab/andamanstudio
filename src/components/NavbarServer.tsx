import Navbar from "./Navbar";
import { getCategoryNav, getCatalog, getServices, getSite } from "@/lib/db/queries";
import { getServiceTheme } from "@/data/serviceThemes";
import { formatINR } from "@/data/catalog";

// Server wrapper: fetches the nav data from the DB (category prices, labels,
// service titles, contact facts) and hands a serializable prop to the client Navbar.
export default async function NavbarServer() {
  const [catNav, catalog, services, site] = await Promise.all([
    getCategoryNav(),
    getCatalog(),
    getServices(),
    getSite(),
  ]);
  const phone = site.phones?.[0] ?? "";
  const contact = {
    phone,
    tel: `tel:${phone.replace(/\s/g, "")}`,
    whatsapp: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Andaman Studio! I'd like to book a shoot.")}`,
  };

  const fromBySlug = new Map(
    catalog.map((c) => [c.id, Math.min(...c.products.map((p) => p.price))])
  );

  const categories = catNav.map((c) => ({
    label: c.label,
    short: c.short,
    href: c.href,
    slug: c.slug,
    fromPrice: formatINR(fromBySlug.get(c.slug) ?? 0),
  }));

  const servicesData = services.map((s) => {
    const t = getServiceTheme(s.slug);
    return { slug: s.slug, title: s.title, icon: t.icon, accent: t.accent };
  });

  return <Navbar data={{ categories, services: servicesData, contact }} />;
}
