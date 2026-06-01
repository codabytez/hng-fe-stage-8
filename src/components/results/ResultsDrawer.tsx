"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ResultsHeader } from "./ResultsHeader";
import { ResultsTable } from "./ResultsTable";
import { ResultsPagination } from "./ResultsPagination";
import { ResultsLoadingState } from "./ResultsLoadingState";
import { ResultsEmptyState } from "./ResultsEmptyState";
import { useUIStore } from "@/store/ui-store";
import type { QueryResults, PageSize } from "@/hooks/useQueryExecution";

const HEADER_H = 40;
const MIN_H = 220;
const MAX_H = typeof window !== "undefined" ? Math.round(window.innerHeight * 0.65) : 520;
const DEFAULT_H = typeof window !== "undefined" ? Math.round(window.innerHeight * 0.35) : 280;

interface ResultsDrawerProps {
  isRunning: boolean;
  results: QueryResults | null;
  allMatched: Record<string, unknown>[];
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
  allMatched,
  sortField,
  sortDir,
  page,
  pageSize,
  goToPage,
  changePageSize,
  toggleSort,
}: ResultsDrawerProps) {
  const resultsOpen = useUIStore((s) => s.resultsOpen);
  const setResultsOpen = useUIStore((s) => s.setResultsOpen);
  const [drawerHeight, setDrawerHeight] = useState(DEFAULT_H);
  const [resizing, setResizing] = useState(false);
  const startY = useRef(0);
  const startH = useRef(0);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setResizing(true);
    startY.current = e.clientY;
    startH.current = drawerHeight;

    const onMove = (ev: PointerEvent) => {
      const delta = startY.current - ev.clientY;
      const next = Math.min(MAX_H, Math.max(MIN_H, startH.current + delta));
      setDrawerHeight(next);
      if (!resultsOpen) setResultsOpen(true);
    };

    const onUp = () => {
      setResizing(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [drawerHeight, resultsOpen, setResultsOpen]);

  const handleExportCSV = useCallback(() => {
    if (!allMatched.length) return;
    const cols = Object.keys(allMatched[0]);
    const header = cols.join(",");
    const body = allMatched
      .map((row) => cols.map((c) => JSON.stringify(row[c] ?? "")).join(","))
      .join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexusdb-results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [allMatched]);

  const totalHeight = resultsOpen ? drawerHeight : HEADER_H;

  return (
    <motion.div
      animate={{ height: totalHeight }}
      transition={{ duration: resizing ? 0 : 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="min-h-10 shrink-0 overflow-hidden border-t border-border-subtle bg-bg-surface"
    >
      {/* Drag handle — only when open */}
      {resultsOpen && (
        <div
          onPointerDown={handlePointerDown}
          className="group flex h-1.5 w-full cursor-row-resize touch-none items-center justify-center bg-transparent hover:bg-accent/10"
          aria-label="Resize results panel"
        >
          <div className="h-0.5 w-10 rounded-full bg-border-strong transition-colors group-hover:bg-accent" />
        </div>
      )}

      <ResultsHeader results={results} onExportCSV={handleExportCSV} />

      <AnimatePresence>
        {resultsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ height: drawerHeight - HEADER_H - 6 }}
            className="flex flex-col"
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
