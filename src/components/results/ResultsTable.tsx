"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowUp2, ArrowDown2 } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface ResultsTableProps {
  rows: Record<string, unknown>[];
  sortField: string | null;
  sortDir: "asc" | "desc";
  onSort: (field: string) => void;
}

function formatCell(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-text-disabled italic">null</span>;
  }
  if (typeof value === "boolean") {
    return (
      <span
        className={cn(
          "text-2xs rounded-sm px-1.5 py-0.5 font-medium",
          value
            ? "bg-success-muted text-success"
            : "bg-destructive-muted text-destructive",
        )}
      >
        {String(value)}
      </span>
    );
  }
  if (Array.isArray(value)) {
    return (
      <span className="text-text-muted">
        [{value.slice(0, 3).join(", ")}
        {value.length > 3 ? "…" : ""}]
      </span>
    );
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return <span className="font-mono text-xs">{formatDate(value)}</span>;
  }
  if (typeof value === "number") {
    return <span className="font-mono text-sm">{value.toLocaleString()}</span>;
  }
  if (typeof value === "string" && value.length > 30) {
    return (
      <span title={value} className="block max-w-50 truncate">
        {value}
      </span>
    );
  }
  return String(value);
}

export const ResultsTable = React.memo(function ResultsTable({
  rows,
  sortField,
  sortDir,
  onSort,
}: ResultsTableProps) {
  if (rows.length === 0) return null;
  const columns = Object.keys(rows[0]);

  return (
    <div className="overflow-auto">
      <table className="min-w-full w-max border-collapse text-sm">
        <thead>
          <tr className="bg-bg-elevated">
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => onSort(col)}
                className="text-text-muted hover:text-text-primary cursor-pointer px-3 py-2 text-left text-xs font-medium tracking-wide select-none"
              >
                <span className="flex items-center gap-1">
                  {col}
                  {sortField === col ? (
                    sortDir === "asc" ? (
                      <ArrowUp2 size={10} className="text-accent" />
                    ) : (
                      <ArrowDown2 size={10} className="text-accent" />
                    )
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={String(row.id ?? i)}
              custom={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i, 10) * 0.03, duration: 0.15 }}
              className="border-border-subtle hover:bg-bg-hover border-b"
            >
              {columns.map((col) => (
                <td key={col} className="text-text-primary px-3 py-2 text-sm">
                  {formatCell(row[col])}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
