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
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-default bg-bg-elevated px-4 py-1.5"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="font-mono text-xs font-semibold tracking-widest text-text-accent">
          SQL without the syntax
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="mb-6 text-6xl font-bold tracking-tight text-text-primary md:text-8xl"
      >
        Query anything.{" "}
        <span className="text-accent">Visually.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.16 }}
        className="mx-auto mb-10 max-w-2xl text-base text-text-muted md:text-lg"
      >
        Build complex nested database filters with an intuitive visual editor.
        NexusDB transforms visual logic into SQL, MongoDB, and GraphQL instantly.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.24 }}
        className="flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <Link
          href="/app"
          className="flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-base font-semibold text-white transition-all hover:bg-accent-hover active:scale-[0.97]"
        >
          <Flash size={16} variant="Bold" />
          Launch Explorer
        </Link>
        <a
          href="https://github.com/codabytez/nexusdb-explorer"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md border border-border-default bg-bg-elevated px-6 py-3 text-base font-semibold text-text-primary transition-all hover:bg-bg-overlay"
        >
          <Code size={16} />
          View on GitHub
        </a>
      </motion.div>
    </section>
  );
}
