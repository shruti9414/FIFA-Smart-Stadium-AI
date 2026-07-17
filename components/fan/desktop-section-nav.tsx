"use client";

import Link from "next/link";
import { Home, Navigation, UtensilsCrossed, Sparkles, Trophy } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "#stadium", label: "Navigate", icon: Navigation },
  { href: "#amenities", label: "Amenities", icon: UtensilsCrossed },
  { href: "#suggestions", label: "AI Suggestions", icon: Sparkles },
  { href: "#match", label: "Match Center", icon: Trophy },
];

/** Sticky anchor nav for the desktop long-scroll layout — "Home" leaves /fan for the landing page; the rest are same-page section jumps. */
export function DesktopSectionNav() {
  return (
    <div className="glass sticky top-0 z-30 hidden items-center justify-center gap-1 border-b border-border-subtle px-4 py-2.5 md:flex">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-glass-elevated hover:text-accent-cyan"
        >
          <link.icon size={13} />
          {link.label}
        </Link>
      ))}
    </div>
  );
}
