"use client";

import dynamic from "next/dynamic";
import { PlayCircle, HamburgerMenu } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { IconButton } from "../shared/IconButton";
import { Kbd } from "../shared/Kbd";
import { Spinner } from "../shared/Spinner";
import { useQueryStore, useQueryActions } from "@/store/query-store";
import { useUIStore } from "@/store/ui-store";
import { useValidation } from "@/hooks/useValidation";

const ThemeToggle = dynamic(
  () => import("./ThemeToggle").then((m) => m.ThemeToggle),
  { ssr: false },
);

const SCHEMAS = [
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
  const { isValid } = useValidation();
  const canRun = hasConditions && isValid && !isRunning;

  return (
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
      <nav aria-label="Dataset selector" className="flex items-center gap-1 rounded-full border border-border-default bg-bg-surface px-1 py-1 max-sm:scale-90">
        {SCHEMAS.map((schema) => {
          const isActive = schemaId === schema.id;
          return (
            <button
              key={schema.id}
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
          );
        })}
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

        {/* Theme toggle — dynamic import (ssr: false) avoids hydration mismatch */}
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
  );
}
