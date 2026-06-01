"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Flash, Book1 } from "iconsax-reactjs";

export function LandingCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="mx-auto mb-32 max-w-7xl px-6 md:px-8" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-accent/20 bg-linear-to-br from-accent/10 via-bg-surface to-bg-base p-12 text-center md:p-20"
      >
        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(110,86,207,0.15),transparent)]" />

        <h2 className="relative mb-4 text-4xl font-bold tracking-tight text-text-primary md:text-6xl">
          Ready to query visually?
        </h2>
        <p className="relative mx-auto mb-8 max-w-lg text-base text-text-muted">
          No syntax. No guesswork. Build, preview, and execute complex queries in seconds.
        </p>
        <div className="relative flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/app"
            className="flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-base font-semibold text-white transition-all hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.97]"
          >
            <Flash size={16} variant="Bold" />
            Start Exploring Now
          </Link>
          <a
            href="https://github.com/codabytez/hng-fe-stage-8#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md border border-border-default bg-transparent px-6 py-3 text-base font-semibold text-text-primary transition-all hover:bg-bg-elevated"
          >
            <Book1 size={16} />
            Read Documentation
          </a>
        </div>
      </motion.div>
    </section>
  );
}
