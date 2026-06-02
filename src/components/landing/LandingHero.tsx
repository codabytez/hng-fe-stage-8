"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Flash, Code } from "iconsax-reactjs";

export function LandingHero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-40 pb-20 text-center md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-border-default bg-bg-elevated mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
      >
        <span className="bg-accent h-1.5 w-1.5 rounded-full" />
        <span className="text-text-accent text-xs font-semibold tracking-widest">
          SQL without the syntax
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="text-text-primary mb-6 text-6xl font-bold tracking-tight md:text-8xl"
      >
        Query anything. <span className="text-accent">Visually.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.16 }}
        className="text-text-muted mx-auto mb-10 max-w-2xl text-base md:text-lg"
      >
        Build complex nested database filters with an intuitive visual editor.
        NexusDB transforms visual logic into SQL, MongoDB, and GraphQL
        instantly.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.24 }}
        className="flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <Link
          href="/app"
          className="bg-accent hover:bg-accent-hover flex items-center gap-2 rounded-md px-6 py-3 text-base font-semibold text-white transition-all active:scale-[0.97]"
        >
          <Flash size={16} variant="Bold" />
          Launch Explorer
        </Link>
        <Link
          href="https://github.com/codabytez/nexusdb-explorer"
          target="_blank"
          rel="noopener noreferrer"
          className="border-border-default bg-bg-elevated text-text-primary hover:bg-bg-overlay flex items-center gap-2 rounded-md border px-6 py-3 text-base font-semibold transition-all"
        >
          <Code size={16} />
          View on GitHub
        </Link>
      </motion.div>
    </section>
  );
}
