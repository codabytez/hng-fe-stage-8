"use client";

import Link from "next/link";
import { useState } from "react";
import { HamburgerMenu, CloseCircle } from "iconsax-reactjs";
import { motion, AnimatePresence } from "motion/react";

function HexLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 1.5L17.794 6V14L10 18.5L2.206 14V6L10 1.5Z" fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="1.5" />
      <path d="M10 5.5L14.5 8V13L10 15.5L5.5 13V8L10 5.5Z" fill="var(--accent)" />
    </svg>
  );
}

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Schemas", href: "#schemas" },
  { label: "Docs", href: "#docs" },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border-subtle/40 bg-bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <HexLogo />
          <span className="font-mono text-base font-bold text-text-primary">NexusDB</span>
          <span className="text-sm text-text-muted">Explorer</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-text-muted transition-colors hover:text-text-primary">
              {l.label}
            </a>
          ))}
          <Link
            href="/app"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-hover active:scale-95"
          >
            Launch App
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-elevated md:hidden"
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
            className="overflow-hidden border-t border-border-subtle bg-bg-surface md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/app"
                className="mt-2 rounded-md bg-accent px-4 py-2.5 text-center text-sm font-semibold text-white"
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
