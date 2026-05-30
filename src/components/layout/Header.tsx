"use client";

import dynamic from "next/dynamic";
import { PlayCircle } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { IconButton } from "../shared/IconButton";
import { Kbd } from "../shared/Kbd";
import { Spinner } from "../shared/Spinner";
import { useQueryStore, useQueryActions } from "@/store/query-store";
import { useUIStore } from "@/store/ui-store";

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
  const { setSchema } = useQueryActions();
  const setShortcutModalOpen = useUIStore((s) => s.setShortcutModalOpen);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-subtle bg-bg-surface px-5">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <HexLogo />
        <div className="flex flex-col leading-none">
          <span className="font-mono text-lg font-bold text-text-primary">NexusDB</span>
          <span className="text-sm text-text-muted">Explorer</span>
        </div>
      </div>

      {/* Schema selector pill */}
      <div className="flex items-center gap-1 rounded-full border border-border-default bg-bg-surface px-1 py-1">
        {SCHEMAS.map((schema) => {
          const isActive = schemaId === schema.id;
          return (
            <button
              key={schema.id}
              onClick={() => setSchema(schema.id)}
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
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Run Query */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            onClick={onRunQuery}
            disabled={isRunning}
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

function HexLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 1.5L17.794 6V14L10 18.5L2.206 14V6L10 1.5Z"
        fill="var(--accent)"
        fillOpacity="0.2"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <path
        d="M10 5.5L14.5 8V13L10 15.5L5.5 13V8L10 5.5Z"
        fill="var(--accent)"
      />
    </svg>
  );
}
