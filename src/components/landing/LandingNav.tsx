"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { HamburgerMenu, CloseCircle } from "iconsax-reactjs";
import { motion, AnimatePresence } from "motion/react";

const ThemeToggle = dynamic(
  () => import("@/components/layout/ThemeToggle").then((m) => m.ThemeToggle),
  { ssr: false },
);

function HexLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 1.5L17.794 6V14L10 18.5L2.206 14V6L10 1.5Z"
        fill="var(--accent)"
        fillOpacity="0.2"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <path
        d="M10 5.5L14.5 8V13L10 15.5L5.5 13V8L10 5.5Z"
        fill="var(--accent)"
      />
    </svg>
  );
}

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Schemas", href: "#schemas" },
  { label: "Docs", href: "/docs" },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-border-subtle/40 bg-bg-surface/80 fixed top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <HexLogo />
          <span className="text-text-primary text-base font-bold">NexusDB</span>
          <span className="text-text-muted text-sm">Explorer</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-text-muted hover:text-text-primary text-sm transition-colors"
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
          <Link
            href="/app"
            className="bg-accent hover:bg-accent-hover rounded-md px-4 py-2 text-sm font-semibold text-white transition-all active:scale-95"
          >
            Launch App
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="text-text-muted hover:bg-bg-elevated flex h-9 w-9 items-center justify-center rounded-md transition-colors md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <CloseCircle size={20} /> : <HamburgerMenu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-border-subtle bg-bg-surface overflow-hidden border-t md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-text-muted hover:bg-bg-elevated hover:text-text-primary rounded-md px-3 py-2 text-sm transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-1 flex items-center gap-2 px-3 py-2">
                <span className="text-text-muted text-sm">Theme</span>
                <ThemeToggle />
              </div>
              <Link
                href="/app"
                className="bg-accent mt-2 rounded-md px-4 py-2.5 text-center text-sm font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                Launch App
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
