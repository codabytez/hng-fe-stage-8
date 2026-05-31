"use client";

import { ArrowUp2, DocumentDownload } from "iconsax-reactjs";
import { motion } from "motion/react";
import { useUIStore } from "@/store/ui-store";
import type { QueryResults } from "@/hooks/useQueryExecution";

interface ResultsHeaderProps {
  results: QueryResults | null;
  onExportCSV: () => void;
}

export function ResultsHeader({ results, onExportCSV }: ResultsHeaderProps) {
  const resultsOpen = useUIStore((s) => s.resultsOpen);
  const toggleResults = useUIStore((s) => s.toggleResults);

  return (
    <div className="flex h-10 shrink-0 items-center justify-between px-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-text-secondary">Results</span>
        {results && (
          <>
            <span className="text-success font-medium">{results.total} matched</span>
            <span className="text-text-muted">from {results.totalRecords} records</span>
          </>
        )}
        {!results && (
          <span className="text-text-muted text-xs">Run a query to see results</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {results && results.total > 0 && (
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary"
            aria-label="Export CSV"
          >
            <DocumentDownload size={13} />
            <span>CSV</span>
          </button>
        )}
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
  );
}
