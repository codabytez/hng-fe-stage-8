"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Home2, PlayCircle } from "iconsax-reactjs";

function SqlLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function NotFound() {
  return (
    <div className="bg-bg-base flex min-h-screen flex-col items-center justify-center px-6">
      {/* Browser chrome */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-border-default w-full max-w-lg overflow-hidden rounded-xl border shadow-md"
      >
        {/* Title bar */}
        <div className="border-border-subtle bg-bg-elevated flex items-center gap-3 border-b px-4 py-3">
          <div className="flex gap-1.5">
            <span className="bg-destructive/60 h-3 w-3 rounded-full" />
            <span className="bg-warning/60 h-3 w-3 rounded-full" />
            <span className="bg-accent/60 h-3 w-3 rounded-full" />
          </div>
          <span className="text-text-muted flex-1 text-center text-xs">
            nexusdb — query_executor.sql
          </span>
        </div>

        {/* Code panel */}
        <div className="bg-bg-base p-6 text-sm leading-7">
          <SqlLine delay={0.1}>
            <span className="text-code-keyword">SELECT</span>
            <span className="text-code-text"> * </span>
          </SqlLine>
          <SqlLine delay={0.2}>
            <span className="text-code-keyword">FROM</span>
            <span className="text-code-field"> pages</span>
          </SqlLine>
          <SqlLine delay={0.3}>
            <span className="text-code-keyword">WHERE</span>
            <span className="text-code-text"> path = </span>
            <span className="text-code-string">&apos;/???&apos;</span>
          </SqlLine>

          <div className="border-border-subtle my-3 border-t" />

          <SqlLine delay={0.55}>
            <span className="text-text-muted">-- Executed in 0.003ms</span>
          </SqlLine>
          <SqlLine delay={0.7}>
            <motion.span
              className="text-destructive"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              -- 0 rows returned
            </motion.span>
          </SqlLine>
        </div>

        {/* Results bar */}
        <div className="border-border-subtle bg-bg-surface flex items-center justify-between border-t px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="bg-destructive h-1.5 w-1.5 rounded-full" />
            <span className="text-text-muted text-xs">
              No page matched the condition
            </span>
          </div>
          <span className="text-destructive text-xs font-bold">404</span>
        </div>
      </motion.div>

      {/* Message + actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-text-primary mb-1 text-lg font-semibold">
          Query returned no results
        </p>
        <p className="text-text-muted mb-6 text-sm">
          The page you&apos;re looking for doesn&apos;t exist in this dataset.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="border-border-default bg-bg-elevated text-text-primary hover:bg-bg-overlay flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            <Home2 size={15} />
            Back to Home
          </Link>
          <Link
            href="/app"
            className="bg-accent hover:bg-accent-hover flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-all"
          >
            <PlayCircle size={15} variant="Bold" />
            Open Query Builder
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
