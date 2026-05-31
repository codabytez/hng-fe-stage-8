"use client";

import { AnimatePresence, motion } from "motion/react";
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
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-base">
      <Header onRunQuery={run} isRunning={isRunning} />
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Mobile overlay backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-20 bg-black/50 md:hidden"
              aria-hidden
              onClick={toggleSidebar}
            />
          )}
        </AnimatePresence>

        {/* Sidebar — slides in/out */}
        <motion.div
          id="app-sidebar"
          animate={{ width: sidebarOpen ? 240 : 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="shrink-0 overflow-hidden max-md:absolute max-md:inset-y-0 max-md:left-0 max-md:z-30"
          aria-hidden={!sidebarOpen}
        >
          <Sidebar />
        </motion.div>

        <main
          id="main-content"
          tabIndex={-1}
          aria-label="Query workspace"
          className="flex min-w-0 flex-1 flex-col overflow-hidden focus:outline-none"
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
