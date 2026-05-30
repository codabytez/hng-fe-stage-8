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
      className="w-full rounded-md px-2 py-1.5 text-left hover:bg-bg-hover"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-accent">{entry.conditionCount} conditions</span>
        <span className="text-xs text-text-muted">{formatDate(new Date(entry.timestamp))}</span>
      </div>
      <p className="truncate font-mono text-xs text-text-secondary">
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
      <p className="py-2 text-center text-xs text-text-muted">No queries run yet</p>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {history.map((entry) => (
        <HistoryItem key={entry.id} entry={entry} />
      ))}
      <button
        onClick={clearHistory}
        className={cn("mt-1 text-left text-xs text-destructive hover:underline")}
      >
        Clear history
      </button>
    </div>
  );
}
