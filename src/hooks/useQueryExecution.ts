"use client";

import { useState, useCallback } from "react";
import { executeQuery } from "@/lib/query-engine/executor";
import { agents } from "@/lib/mock-data/agents";
import { cities } from "@/lib/mock-data/cities";
import { incidents } from "@/lib/mock-data/incidents";
import { useQueryStore } from "@/store/query-store";
import { useUIStore } from "@/store/ui-store";
import { useHistoryStore } from "@/store/history-store";
import { useCustomDataStore } from "@/store/custom-data-store";
import { countConditions } from "@/lib/query-engine/tree-utils";

const BUILTIN_DATA: Record<string, Record<string, unknown>[]> = {
  agents: agents as unknown as Record<string, unknown>[],
  cities: cities as unknown as Record<string, unknown>[],
  incidents: incidents as unknown as Record<string, unknown>[],
};

export type PageSize = 10 | 25 | 50;

export interface QueryResults {
  rows: Record<string, unknown>[];
  total: number;
  totalRecords: number;
  page: number;
  pageSize: PageSize;
  totalPages: number;
}

export function useQueryExecution() {
  const tree = useQueryStore((s) => s.tree);
  const schemaId = useQueryStore((s) => s.schemaId);
  const setResultsOpen = useUIStore((s) => s.setResultsOpen);
  const addHistory = useHistoryStore((s) => s.addHistory);
  const customDatasets = useCustomDataStore((s) => s.datasets);

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<QueryResults | null>(null);
  const [allMatched, setAllMatched] = useState<Record<string, unknown>[]>([]);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [page, setPage] = useState(1);

  const run = useCallback(async () => {
    setIsRunning(true);

    // Simulated 600ms delay
    await new Promise((res) => setTimeout(res, 600));

    const data =
      BUILTIN_DATA[schemaId] ??
      customDatasets.find((d) => d.schema.id === schemaId)?.data ??
      [];
    const matched = executeQuery(tree, data);

    setAllMatched(matched);
    setPage(1);

    const totalPages = Math.max(1, Math.ceil(matched.length / pageSize));
    const paginated = matched.slice(0, pageSize);

    setResults({
      rows: paginated,
      total: matched.length,
      totalRecords: data.length,
      page: 1,
      pageSize,
      totalPages,
    });

    setIsRunning(false);
    setResultsOpen(true);

    addHistory({
      tree,
      schemaId,
      timestamp: Date.now(),
      conditionCount: countConditions(tree),
      resultCount: matched.length,
    });
  }, [tree, schemaId, pageSize, setResultsOpen, addHistory, customDatasets]);

  const goToPage = useCallback(
    (newPage: number) => {
      if (!allMatched.length) return;
      const totalPages = Math.max(1, Math.ceil(allMatched.length / pageSize));
      const clamped = Math.min(Math.max(1, newPage), totalPages);
      const start = (clamped - 1) * pageSize;
      setPage(clamped);
      setResults((prev) =>
        prev
          ? {
              ...prev,
              page: clamped,
              totalPages,
              rows: sortRows(allMatched, sortField, sortDir).slice(start, start + pageSize),
            }
          : prev,
      );
    },
    [allMatched, pageSize, sortField, sortDir],
  );

  const changePageSize = useCallback(
    (size: PageSize) => {
      setPageSize(size);
      setPage(1);
      if (allMatched.length) {
        setResults((prev) =>
          prev
            ? {
                ...prev,
                page: 1,
                pageSize: size,
                totalPages: Math.max(1, Math.ceil(allMatched.length / size)),
                rows: sortRows(allMatched, sortField, sortDir).slice(0, size),
              }
            : prev,
        );
      }
    },
    [allMatched, sortField, sortDir],
  );

  const toggleSort = useCallback(
    (field: string) => {
      const newDir = sortField === field && sortDir === "asc" ? "desc" : "asc";
      setSortField(field);
      setSortDir(newDir);
      if (allMatched.length && results) {
        const sorted = sortRows(allMatched, field, newDir);
        const start = (results.page - 1) * results.pageSize;
        setResults((prev) =>
          prev ? { ...prev, rows: sorted.slice(start, start + prev.pageSize) } : prev,
        );
      }
    },
    [sortField, sortDir, allMatched, results],
  );

  return {
    run,
    isRunning,
    results,
    allMatched,
    sortField,
    sortDir,
    pageSize,
    page,
    goToPage,
    changePageSize,
    toggleSort,
  };
}

function sortRows(
  rows: Record<string, unknown>[],
  field: string | null,
  dir: "asc" | "desc",
): Record<string, unknown>[] {
  if (!field) return rows;
  return [...rows].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
    return dir === "asc" ? cmp : -cmp;
  });
}
