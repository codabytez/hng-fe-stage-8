"use client";

import { motion } from "motion/react";
import { Header } from "./Header";
import { Sidebar } from "../sidebar/Sidebar";
import { QueryBuilder } from "../query-builder/QueryBuilder";
import { PreviewPanel } from "../preview/PreviewPanel";
import { ResultsDrawer } from "../results/ResultsDrawer";
import { ShortcutsModal } from "../modals/ShortcutsModal";
import { ExportModal } from "../modals/ExportModal";
import { ImportModal } from "../modals/ImportModal";
import { useQueryExecution } from "@/hooks/useQueryExecution";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useUIStore } from "@/store/ui-store";

export function AppLayout() {
  const { run, isRunning } = useQueryExecution();
  useKeyboardShortcuts({ onRunQuery: run });
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Sidebar — own header row + sections */}
      <motion.div
        animate={{ width: sidebarOpen ? 240 : 48 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="shrink-0 overflow-hidden"
      >
        <Sidebar />
      </motion.div>

      {/* Right column — header sits only here, aligned with sidebar logo row */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onRunQuery={run} isRunning={isRunning} />

        <main
          id="main-content"
          tabIndex={-1}
          aria-label="Query workspace"
          className="flex min-h-0 flex-1 flex-col overflow-hidden focus:outline-none"
        >
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <QueryBuilder />
            <PreviewPanel />
          </div>
          <ResultsDrawer />
        </main>
      </div>

      <ShortcutsModal />
      <ExportModal />
      <ImportModal />
    </div>
  );
}
