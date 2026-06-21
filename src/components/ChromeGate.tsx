"use client";

import { usePathname } from "next/navigation";

// Hides public-site chrome (navbar, footer, preloader, cursor) on /admin routes,
// without forcing the public pages out of static rendering.
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide site chrome on /admin and on the public quote/pay page (/q/<token>),
  // which should read as a clean, focused document, not the marketing site.
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/q/")) return null;
  return <>{children}</>;
}
