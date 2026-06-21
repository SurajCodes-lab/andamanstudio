"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "▤", module: null },
  { href: "/admin/leads", label: "Leads & pipeline", icon: "✦", module: "leads" },
  { href: "/admin/quotes", label: "Quotes & proposals", icon: "❡", module: "quotes" },
  { href: "/admin/bookings", label: "Bookings & payments", icon: "₹", module: "bookings" },
  { href: "/admin/coupons", label: "Coupons & offers", icon: "%", module: "coupons" },
  { href: "/admin/calendar", label: "Calendar", icon: "◷", module: "calendar" },
  { href: "/admin/tasks", label: "Tasks & reminders", icon: "☑", module: "tasks" },
  { href: "/admin/clients", label: "Clients", icon: "♟", module: "bookings" },
  { href: "/admin/images", label: "Images", icon: "▦", module: "content" },
  { href: "/admin/media", label: "Media library", icon: "❒", module: "content" },
  { href: "/admin/categories", label: "Packages & categories", icon: "❖", module: "content" },
  { href: "/admin/services", label: "Services", icon: "✦", module: "content" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "❝", module: "content" },
  { href: "/admin/legal", label: "Legal pages", icon: "§", module: "content" },
  { href: "/admin/settings", label: "Site settings", icon: "⚙", module: "settings" },
  { href: "/admin/users", label: "Users & roles", icon: "⚇", module: "users" },
] as const;

export default function AdminNav({ allowed, isOwner }: { allowed: string[]; isOwner: boolean }) {
  const pathname = usePathname();
  const items = NAV.filter((n) => n.module === null || isOwner || allowed.includes(n.module));
  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((n) => {
        const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active ? "bg-gold/15 text-gold" : "text-on-deep/70 hover:bg-on-deep/5 hover:text-on-deep"
            }`}
          >
            <span className={`text-xs ${active ? "text-gold" : "text-on-deep/35"}`}>{n.icon}</span>
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
