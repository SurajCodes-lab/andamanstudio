import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { serviceSlugs } from "@/data/services";
import { categorySlugs } from "@/data/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const core = ["", "/services", "/packages", "/gallery", "/about", "/contact"];
  const routes = [
    ...core,
    ...categorySlugs.map((s) => `/category/${s}`),
    ...serviceSlugs.map((s) => `/${s}`),
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:
      path === "" ? 1 : path.startsWith("/category") || path.startsWith("/packages") ? 0.9 : 0.8,
  }));
}
