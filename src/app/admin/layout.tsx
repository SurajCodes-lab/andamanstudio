import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Andaman Studio",
  robots: { index: false, follow: false },
};

// Admin shell — dark, no public chrome (ChromeGate hides the site nav/footer).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-ink-deep text-on-deep antialiased">{children}</div>;
}
