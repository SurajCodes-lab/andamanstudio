import type { NextConfig } from "next";
import { serviceSlugs } from "./src/data/services";

// Preserve SEO from the original static site: every old `.html` URL 301s to the
// matching clean route. Driven from the same slug list as the routes themselves.
const corePairs: Record<string, string> = {
  "/index.html": "/",
  "/home.html": "/",
  "/about.html": "/about",
  "/services.html": "/services",
  "/gallery.html": "/gallery",
  "/contact.html": "/contact",
  "/contacts.html": "/contact",
  "/packages.html": "/packages",
};

const nextConfig: NextConfig = {
  async redirects() {
    const core = Object.entries(corePairs).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));

    const serviceRedirects = serviceSlugs.map((slug) => ({
      source: `/${slug}.html`,
      destination: `/${slug}`,
      permanent: true,
    }));

    return [...core, ...serviceRedirects];
  },
};

export default nextConfig;
