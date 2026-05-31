"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ResultsHeader } from "./ResultsHeader";
import { ResultsTable } from "./ResultsTable";
import { ResultsPagination } from "./ResultsPagination";
import { ResultsLoadingState } from "./ResultsLoadingState";
import { ResultsEmptyState } from "./ResultsEmptyState";
import { useUIStore } from "@/store/ui-store";
import type { QueryResults, PageSize } from "@/hooks/useQueryExecution";

interface ResultsDrawerProps {
  isRunning: boolean;
  results: QueryResults | null;
  sortField: string | null;
  sortDir: "asc" | "desc";
  page: number;
  pageSize: PageSize;
  goToPage: (page: number) => void;
  changePageSize: (size: PageSize) => void;
  toggleSort: (field: string) => void;
}

export function ResultsDrawer({
  isRunning,
  results,
  sortField,
  sortDir,
  page,
  pageSize,
  goToPage,
  changePageSize,
  toggleSort,
}: ResultsDrawerProps) {
  const resultsOpen = useUIStore((s) => s.resultsOpen);

  const handleExportCSV = useCallback(() => {
    if (!results?.rows.length) return;
    const cols = Object.keys(results.rows[0]);
    const header = cols.join(",");
    const body = results.rows
      .map((row) => cols.map((c) => JSON.stringify(row[c] ?? "")).join(","))
      .join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexusdb-results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  return (
    <motion.div
      animate={{ height: resultsOpen ? "35vh" : "40px" }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="min-h-10 shrink-0 overflow-hidden border-t border-border-subtle bg-bg-surface"
    >
      <ResultsHeader results={results} onExportCSV={handleExportCSV} />

      <AnimatePresence>
        {resultsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex h-[calc(35vh-40px)] flex-col"
          >
            {isRunning ? (
              <ResultsLoadingState />
            ) : results === null ? (
              <div className="flex flex-1 items-center justify-center text-sm text-text-muted">
                Run a query to see results
              </div>
            ) : results.total === 0 ? (
              <ResultsEmptyState />
            ) : (
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-auto">
                  <ResultsTable
                    rows={results.rows}
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={toggleSort}
                  />
                </div>
                <ResultsPagination
                  page={page}
                  totalPages={results.totalPages}
                  pageSize={pageSize}
                  onPageChange={goToPage}
                  onPageSizeChange={changePageSize}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
