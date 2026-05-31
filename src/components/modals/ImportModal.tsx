"use client";

import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUIStore } from "@/store/ui-store";
import { useQueryActions } from "@/store/query-store";
import { useToast } from "@/components/shared/ToastContainer";
import type { Group } from "@/lib/query-engine/types";

export function ImportModal() {
  const open = useUIStore((s) => s.importModalOpen);
  const setOpen = useUIStore((s) => s.setImportModalOpen);
  const { replaceTree, setSchema } = useQueryActions();
  const { toast } = useToast();
  const [raw, setRaw] = useState("");
  const [error, setError] = useState("");

  const handleImport = useCallback(() => {
    try {
      const parsed = JSON.parse(raw) as { tree?: Group; schemaId?: string };
      if (!parsed.tree || typeof parsed.tree !== "object") {
        throw new Error("Missing or invalid 'tree' field");
      }
      if (parsed.schemaId) setSchema(parsed.schemaId);
      replaceTree(parsed.tree);
      setOpen(false);
      setRaw("");
      setError("");
      toast({ message: "Query imported", description: "Tree replaced from JSON" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  }, [raw, replaceTree, setSchema, setOpen, toast]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setRaw(String(ev.target?.result ?? ""));
      reader.readAsText(file);
    },
    [],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-border-default bg-bg-elevated max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-text-primary">Import Query</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-text-muted -mt-1">
          Paste or upload a previously exported NexusDB query JSON.
        </p>

        <textarea
          value={raw}
          onChange={(e) => { setRaw(e.target.value); setError(""); }}
          placeholder={`{\n  "schemaId": "agents",\n  "tree": { ... }\n}`}
          rows={8}
          className="w-full rounded-md border border-border-default bg-bg-surface px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none resize-none"
        />

        {error && (
          <p className="text-xs text-destructive -mt-1">{error}</p>
        )}

        <div className="flex gap-2 pt-1">
          <label className="flex flex-1 cursor-pointer items-center justify-center rounded-md border border-border-default bg-bg-surface py-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
            Upload file
            <input type="file" accept=".json" onChange={handleFileUpload} className="sr-only" />
          </label>
          <button
            onClick={handleImport}
            disabled={!raw.trim()}
            className="flex flex-1 items-center justify-center rounded-md bg-accent py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            Import
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
