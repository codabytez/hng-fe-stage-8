"use client";

import { useMemo, useState, useCallback } from "react";
import { Copy, DocumentDownload } from "iconsax-reactjs";
import { motion } from "motion/react";
import { CodeBlock } from "./CodeBlock";
import { ComplexityIndicator } from "./ComplexityIndicator";
import { useQueryStore } from "@/store/query-store";
import { useUIStore } from "@/store/ui-store";
import { getSchema } from "@/lib/schemas";
import { generateSQL } from "@/lib/query-engine/generators/sql";
import { generateMongo } from "@/lib/query-engine/generators/mongo";
import { generateGraphQL } from "@/lib/query-engine/generators/graphql";
import { cn } from "@/lib/utils";
import type { PreviewFormat } from "@/lib/query-engine/types";

const TABS: { id: PreviewFormat; label: string }[] = [
  { id: "SQL", label: "SQL" },
  { id: "MongoDB", label: "MongoDB" },
  { id: "GraphQL", label: "GraphQL" },
];

export function PreviewPanel() {
  const tree = useQueryStore((s) => s.tree);
  const schemaId = useQueryStore((s) => s.schemaId);
  const activeFormat = useUIStore((s) => s.activeFormat);
  const setActiveFormat = useUIStore((s) => s.setActiveFormat);
  const [copied, setCopied] = useState(false);

  const schema = getSchema(schemaId);

  const sqlOutput = useMemo(() => generateSQL(tree, schema), [tree, schema]);
  const mongoOutput = useMemo(
    () => JSON.stringify(generateMongo(tree, schema), null, 2),
    [tree, schema],
  );
  const graphqlOutput = useMemo(() => generateGraphQL(tree, schema), [tree, schema]);

  const currentCode =
    activeFormat === "SQL" ? sqlOutput : activeFormat === "MongoDB" ? mongoOutput : graphqlOutput;
  const currentLang =
    activeFormat === "SQL" ? "sql" : activeFormat === "MongoDB" ? "json" : "graphql";

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [currentCode]);

  const handleExport = useCallback(() => {
    const blob = new Blob([currentCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexusdb-query-${schemaId}.${activeFormat === "SQL" ? "sql" : activeFormat === "MongoDB" ? "json" : "graphql"}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [currentCode, schemaId, activeFormat]);

  return (
    <aside className="flex w-[360px] shrink-0 flex-col gap-3 overflow-y-auto border-l border-border-subtle bg-bg-surface p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Query Preview</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handleExport}
            className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-text-secondary hover:text-text-primary"
            aria-label="Export query"
          >
            <DocumentDownload size={13} />
            <span>Export</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-text-secondary hover:text-text-primary"
            aria-label="Copy to clipboard"
          >
            <Copy size={13} />
            <motion.span
              key={copied ? "copied" : "copy"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {copied ? "Copied ✓" : "Copy"}
            </motion.span>
          </button>
        </div>
      </div>

      {/* Format tabs */}
      <div className="flex rounded-md bg-bg-elevated p-1 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFormat(tab.id)}
            className={cn(
              "flex-1 rounded-sm px-3 py-1 text-sm transition-colors",
              activeFormat === tab.id
                ? "bg-bg-surface text-text-primary shadow-card"
                : "text-text-muted hover:text-text-secondary",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code block */}
      <motion.div
        key={activeFormat + schemaId}
        animate={{ opacity: [0.6, 1] }}
        transition={{ duration: 0.15 }}
        className="flex-1"
      >
        <CodeBlock
          code={currentCode}
          language={currentLang}
          className="min-h-[200px] flex-1"
        />
      </motion.div>

      {/* Complexity */}
      <ComplexityIndicator group={tree} />
    </aside>
  );
}
