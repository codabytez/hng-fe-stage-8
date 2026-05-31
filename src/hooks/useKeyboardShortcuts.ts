"use client";

import { useEffect, useCallback } from "react";
import { useQueryActions, useCanUndo, useCanRedo } from "@/store/query-store";
import { useUIStore } from "@/store/ui-store";

export interface ShortcutDef {
  keys: string;
  label: string;
  description: string;
}

export const SHORTCUTS: ShortcutDef[] = [
  { keys: "Ctrl+Z", label: "Undo", description: "Undo last action" },
  { keys: "Ctrl+Shift+Z", label: "Redo", description: "Redo last undone action" },
  { keys: "Ctrl+Enter", label: "Run Query", description: "Execute the current query" },
  { keys: "Ctrl+Shift+C", label: "Clear All", description: "Clear the entire query tree" },
  { keys: "Ctrl+Shift+E", label: "Export Query", description: "Export query as JSON" },
  { keys: "Ctrl+Shift+I", label: "Import Query", description: "Import query from JSON" },
  { keys: "?", label: "Shortcuts", description: "Show keyboard shortcuts" },
];

interface UseKeyboardShortcutsOptions {
  onRunQuery?: () => void;
}

export function useKeyboardShortcuts({ onRunQuery }: UseKeyboardShortcutsOptions = {}) {
  const { undo, redo, clearTree } = useQueryActions();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const setShortcutModalOpen = useUIStore((s) => s.setShortcutModalOpen);
  const setExportModalOpen = useUIStore((s) => s.setExportModalOpen);
  const setImportModalOpen = useUIStore((s) => s.setImportModalOpen);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);

      // ? — only when not in an input
      if (e.key === "?" && !isInput && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShortcutModalOpen(true);
        return;
      }

      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;

      switch (true) {
        case e.key === "z" && !e.shiftKey:
          e.preventDefault();
          if (canUndo) undo();
          break;
        case (e.key === "z" && e.shiftKey) || e.key === "y":
          e.preventDefault();
          if (canRedo) redo();
          break;
        case e.key === "Enter":
          e.preventDefault();
          onRunQuery?.();
          break;
        case e.key === "Z" && e.shiftKey: // Ctrl+Shift+Z already handled above
          break;
        case e.key === "C" && e.shiftKey:
          e.preventDefault();
          clearTree();
          break;
        case e.key === "E" && e.shiftKey:
          e.preventDefault();
          setExportModalOpen(true);
          break;
        case e.key === "I" && e.shiftKey:
          e.preventDefault();
          setImportModalOpen(true);
          break;
      }
    },
    [canUndo, canRedo, undo, redo, clearTree, onRunQuery, setShortcutModalOpen, setExportModalOpen, setImportModalOpen],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
