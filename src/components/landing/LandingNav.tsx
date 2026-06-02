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
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-4 z-50 w-full px-4 md:px-8"
    >
      <div
        className="border-border-default/60 bg-bg-surface/80 mx-auto flex h-14 max-w-4xl items-center justify-between rounded-2xl border px-5 backdrop-blur-xl"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <HexLogo />
            <span className="text-text-primary text-base font-bold">NexusDB</span>
            <span className="text-text-muted text-sm">Explorer</span>
          </Link>
        </motion.div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.07 }}
              className="text-text-muted hover:text-text-primary group relative text-sm transition-colors"
            >
              {l.label}
              {/* Underline slide-in */}
              <span className="bg-accent absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-200 group-hover:w-full" />
            </motion.a>
          ))}

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.36 }}
          >
            <ThemeToggle />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link
              href="/app"
              className="bg-accent hover:bg-accent-hover rounded-md px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.03] active:scale-95"
            >
              Launch App
            </Link>
          </motion.div>
        </div>

        {/* Mobile hamburger */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-text-muted hover:bg-bg-elevated flex h-9 w-9 items-center justify-center rounded-md transition-colors md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <CloseCircle size={20} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <HamburgerMenu size={20} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile drawer — pill card below the nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-border-default/60 bg-bg-surface/90 mx-auto mt-2 max-w-4xl overflow-hidden rounded-2xl border backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="text-text-muted hover:bg-bg-elevated hover:text-text-primary rounded-md px-3 py-2 text-sm transition-colors"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.15 }}
                className="mt-1 flex items-center gap-2 px-3 py-2"
              >
                <span className="text-text-muted text-sm">Theme</span>
                <ThemeToggle />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <Link
                  href="/app"
                  className="bg-accent mt-2 block rounded-md px-4 py-2.5 text-center text-sm font-semibold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Launch App
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
