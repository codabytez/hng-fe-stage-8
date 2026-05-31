"use client";

import { useMemo, useCallback, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CodeBlock } from "@/components/preview/CodeBlock";
import { useUIStore } from "@/store/ui-store";
import { useQueryStore } from "@/store/query-store";
import { Copy, DocumentDownload } from "iconsax-reactjs";

export function ExportModal() {
  const open = useUIStore((s) => s.exportModalOpen);
  const setOpen = useUIStore((s) => s.setExportModalOpen);
  const tree = useQueryStore((s) => s.tree);
  const schemaId = useQueryStore((s) => s.schemaId);
  const [copied, setCopied] = useState(false);

  const json = useMemo(
    () => JSON.stringify({ schemaId, tree }, null, 2),
    [schemaId, tree],
  );

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [json]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexusdb-query-${schemaId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [json, schemaId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-border-default bg-bg-elevated max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-text-primary">Export Query</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-text-muted -mt-1">
          Copy or download the query tree as JSON to save or share it.
        </p>
        <div className="max-h-64 overflow-auto">
          <CodeBlock code={json} language="json" />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleCopy}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border-default bg-bg-surface py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <Copy size={14} />
            {copied ? "Copied ✓" : "Copy JSON"}
          </button>
          <button
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-accent py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            <DocumentDownload size={14} />
            Download .json
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
