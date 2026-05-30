"use client";

import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import type { PageSize } from "@/hooks/useQueryExecution";

const PAGE_SIZES = [10, 25, 50] as const;

interface ResultsPaginationProps {
  page: number;
  totalPages: number;
  pageSize: PageSize;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: PageSize) => void;
}

export function ResultsPagination({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: ResultsPaginationProps) {
  return (
    <div className="flex h-9 items-center justify-between border-t border-border-subtle bg-bg-elevated px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft2 size={12} /> Prev
        </button>
        <span className="text-xs text-text-secondary">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next <ArrowRight2 size={12} />
        </button>
      </div>

      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSize)}
        className="rounded-sm border border-border-default bg-bg-surface px-1.5 py-0.5 text-xs text-text-primary"
        aria-label="Rows per page"
      >
        {PAGE_SIZES.map((s) => (
          <option key={s} value={s}>
            {s} per page
          </option>
        ))}
      </select>
    </div>
  );
}
