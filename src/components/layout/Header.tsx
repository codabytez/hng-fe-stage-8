"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PlayCircle, HamburgerMenu, DocumentUpload, Trash } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { IconButton } from "../shared/IconButton";
import { Kbd } from "../shared/Kbd";
import { Spinner } from "../shared/Spinner";
import { ImportDataModal } from "../modals/ImportDataModal";
import { useQueryStore, useQueryActions } from "@/store/query-store";
import { useUIStore } from "@/store/ui-store";
import { useCustomDataStore } from "@/store/custom-data-store";
import { useValidation } from "@/hooks/useValidation";

const ThemeToggle = dynamic(
  () => import("./ThemeToggle").then((m) => m.ThemeToggle),
  { ssr: false },
);

const BUILTIN_SCHEMAS = [
  { id: "agents", label: "Agents" },
  { id: "cities", label: "Cities" },
  { id: "incidents", label: "Incidents" },
] as const;

interface HeaderProps {
  onRunQuery?: () => void;
  isRunning?: boolean;
}

export function Header({ onRunQuery, isRunning = false }: HeaderProps) {
  const schemaId = useQueryStore((s) => s.schemaId);
  const hasConditions = useQueryStore((s) => s.tree.conditions.length > 0);
  const { setSchema } = useQueryActions();
  const setShortcutModalOpen = useUIStore((s) => s.setShortcutModalOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const customDatasets = useCustomDataStore((s) => s.datasets);
  const removeDataset = useCustomDataStore((s) => s.removeDataset);
  const { isValid } = useValidation();
  const canRun = hasConditions && isValid && !isRunning;
  const [importDataOpen, setImportDataOpen] = useState(false);

  const allSchemas = [
    ...BUILTIN_SCHEMAS,
    ...customDatasets.map((d) => ({ id: d.schema.id, label: d.schema.name })),
  ];

  return (
    <>
      <header
        role="banner"
        className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-border-subtle bg-bg-surface px-4 md:px-5"
      >
        {/* Left — hamburger on mobile, spacer on desktop */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-secondary md:hidden"
          >
            <HamburgerMenu size={18} />
          </button>
        </div>

        {/* Schema selector pill — centered */}
        <nav
          aria-label="Dataset selector"
          className="flex items-center gap-1 rounded-full border border-border-default bg-bg-surface px-1 py-1 max-sm:scale-90"
        >
          {allSchemas.map((schema) => {
            const isActive = schemaId === schema.id;
            const isCustom = !BUILTIN_SCHEMAS.some((b) => b.id === schema.id);
            return (
              <span key={schema.id} className="flex items-center">
                <button
                  onClick={() => setSchema(schema.id)}
                  aria-pressed={isActive}
                  aria-label={`Switch to ${schema.label} dataset`}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition-all duration-150",
                    isActive
                      ? "bg-bg-elevated text-text-primary"
                      : "text-text-muted hover:text-text-secondary",
                  )}
                >
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  <span>{schema.label}</span>
                </button>
                {isCustom && (
                  <button
                    onClick={() => {
                      removeDataset(schema.id);
                      if (schemaId === schema.id) setSchema("agents");
                    }}
                    aria-label={`Remove ${schema.label}`}
                    className="ml-0.5 rounded-full p-0.5 text-text-muted hover:text-destructive transition-colors"
                  >
                    <Trash size={10} />
                  </button>
                )}
              </span>
            );
          })}

          {/* Import data button */}
          <button
            onClick={() => setImportDataOpen(true)}
            aria-label="Import your data"
            className="ml-1 flex items-center gap-1 rounded-full border border-dashed border-border-default px-2.5 py-1 text-xs text-text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <DocumentUpload size={11} />
            <span className="hidden sm:inline">Import</span>
          </button>
        </nav>

        {/* Right controls */}
        <div className="flex items-center justify-end gap-3">
          {/* Run Query */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={onRunQuery}
              disabled={!canRun}
              aria-label={isRunning ? "Query is running" : "Run query"}
              aria-busy={isRunning}
              className={cn(
                "flex h-8 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white transition-all",
                "hover:bg-accent-hover active:scale-[0.97]",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {isRunning ? (
                <>
                  <Spinner size="sm" className="border-t-white" />
                  <span>Running…</span>
                </>
              ) : (
                <>
                  <PlayCircle size={14} variant="Bold" />
                  <span>Run Query</span>
                </>
              )}
            </button>
            <Kbd className="text-2xs">Ctrl+↵</Kbd>
          </div>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Help */}
          <IconButton
            tooltip="Keyboard shortcuts"
            aria-label="Keyboard shortcuts"
            onClick={() => setShortcutModalOpen(true)}
            className="rounded-full"
          >
            <span className="text-sm font-medium">?</span>
          </IconButton>
        </div>
      </header>

      <ImportDataModal open={importDataOpen} onClose={() => setImportDataOpen(false)} />
    </>
  );
}
