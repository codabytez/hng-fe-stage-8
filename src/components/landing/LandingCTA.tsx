"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Flash, Book1 } from "iconsax-reactjs";

type Particle = { left: string; top: string; size: number; dur: number; delay: number; dx: number[]; dy: number[] };

const PARTICLES: Particle[] = [
  { left: "8%",  top: "20%", size: 3, dur: 4.0, delay: 0.0, dx: [0,  12, -8,  0], dy: [0, -18, 10,  0] },
  { left: "18%", top: "70%", size: 2, dur: 5.5, delay: 0.6, dx: [0, -10, 15,  0], dy: [0,  12, -20, 0] },
  { left: "30%", top: "15%", size: 2, dur: 3.8, delay: 1.2, dx: [0,   8, -5,  0], dy: [0, -10,  8,  0] },
  { left: "50%", top: "80%", size: 3, dur: 6.0, delay: 0.3, dx: [0, -14, 10,  0], dy: [0,  16, -12, 0] },
  { left: "65%", top: "25%", size: 2, dur: 4.5, delay: 1.8, dx: [0,  10, -15, 0], dy: [0,  -8,  14, 0] },
  { left: "75%", top: "65%", size: 3, dur: 5.0, delay: 0.9, dx: [0,  -8, 12,  0], dy: [0, -14,   8, 0] },
  { left: "88%", top: "35%", size: 2, dur: 3.5, delay: 2.1, dx: [0,  14, -10, 0], dy: [0,  10, -16, 0] },
  { left: "92%", top: "75%", size: 2, dur: 4.8, delay: 0.5, dx: [0, -12,   8, 0], dy: [0,  -6,  14, 0] },
];

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
        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] bg-size-[24px_24px] opacity-[0.05]" />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            aria-hidden
            className="bg-accent pointer-events-none absolute rounded-full"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{
              x: p.dx,
              y: p.dy,
              opacity: [0.15, 0.6, 0.15],
              scale: [1, 1.4, 1],
            }}
            transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}

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
            href="/docs"
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
