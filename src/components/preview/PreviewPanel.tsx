"use client";

export function PreviewPanel() {
  return (
    <aside className="flex w-90 shrink-0 flex-col border-l border-border-subtle bg-bg-surface p-4">
      <h2 className="text-lg font-semibold text-text-primary">Query Preview</h2>
      <div className="mt-3 flex-1 rounded-md border border-code-border bg-code-bg p-4 font-mono text-sm text-code-comment">
        {`-- No conditions added yet\n-- Add rules above to generate a query`}
      </div>
    </aside>
  );
}
