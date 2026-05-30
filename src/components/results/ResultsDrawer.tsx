"use client";

import { ArrowUp2 } from "iconsax-react";
import { motion } from "motion/react";

import { useUIStore } from "@/store/ui-store";

export function ResultsDrawer() {
  const resultsOpen = useUIStore((s) => s.resultsOpen);
  const toggleResults = useUIStore((s) => s.toggleResults);

  return (
    <motion.div
      animate={{ height: resultsOpen ? "35vh" : "40px" }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="shrink-0 overflow-hidden border-t border-border-subtle bg-bg-surface"
    >
      <div className="flex h-10 items-center justify-between px-4">
        <span className="text-sm text-text-secondary">Results</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">
            {resultsOpen ? "" : "Run a query to see results"}
          </span>
          <button
            onClick={toggleResults}
            aria-label={resultsOpen ? "Collapse results" : "Expand results"}
            className="text-text-muted hover:text-text-primary"
          >
            <motion.span
              animate={{ rotate: resultsOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              <ArrowUp2 size={14} />
            </motion.span>
          </button>
        </div>
      </div>
      {resultsOpen && (
        <div className="flex items-center justify-center py-8 text-sm text-text-muted">
          Run a query to see results
        </div>
      )}
    </motion.div>
  );
}
