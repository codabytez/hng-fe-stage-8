"use client";

import { formatDate } from "@/lib/utils";
import { useHistoryStore, type QueryHistoryEntry } from "@/store/history-store";
import { useQueryActions } from "@/store/query-store";
import { cn } from "@/lib/utils";

interface HistoryItemProps {
  entry: QueryHistoryEntry;
}

export function HistoryItem({ entry }: HistoryItemProps) {
  const { replaceTree, setSchema } = useQueryActions();

  function handleRestore() {
    setSchema(entry.schemaId);
    replaceTree(entry.tree);
  }

  return (
    <button
      onClick={handleRestore}
      className="hover:bg-bg-hover w-full rounded-md px-2 py-1.5 text-left"
    >
      <div className="flex items-center justify-between">
        <span className="text-text-accent text-xs">
          {entry.conditionCount} conditions
        </span>
        <span className="text-text-muted text-xs">
          {formatDate(new Date(entry.timestamp))}
        </span>
      </div>
      <p className="text-text-secondary truncate text-xs">
        {entry.schemaId} · {entry.resultCount} results
      </p>
    </button>
  );
}

export function HistorySection() {
  const history = useHistoryStore((s) => s.history);
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  if (history.length === 0) {
    return (
      <p className="text-text-muted py-2 text-center text-xs">
        No queries run yet
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="max-h-48 overflow-y-auto">
        {history.map((entry) => (
          <HistoryItem key={entry.id} entry={entry} />
        ))}
      </div>
      <button
        onClick={clearHistory}
        className={cn(
          "text-destructive mt-1 text-left text-xs hover:underline",
        )}
      >
        Clear history
      </button>
    </div>
  );
}
