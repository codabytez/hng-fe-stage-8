"use client";

import { AnimatePresence, motion } from "motion/react";
import { Header } from "./Header";
import { MobileTabBar } from "./MobileTabBar";
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
  const {
    run,
    isRunning,
    results,
    allMatched,
    sortField,
    sortDir,
    page,
    pageSize,
    goToPage,
    changePageSize,
    toggleSort,
  } = useQueryExecution();

  useKeyboardShortcuts({ onRunQuery: run });
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const activeMobileTab = useUIStore((s) => s.activeMobileTab);

  return (
    <div className="bg-bg-base flex h-screen overflow-hidden">
      {/* ── Desktop sidebar: in-flow, width animation ── */}
      <motion.div
        animate={{ width: sidebarOpen ? 240 : 48 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="hidden shrink-0 overflow-hidden lg:block"
      >
        <Sidebar />
      </motion.div>

      {/* ── Mobile sidebar: full overlay + backdrop ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              aria-hidden
              onClick={toggleSidebar}
            />
            <motion.div
              key="mobile-sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Right column ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onRunQuery={run} isRunning={isRunning} />

        {/* Mobile tab switcher — hidden on desktop */}
        <MobileTabBar />

        <main
          id="main-content"
          tabIndex={-1}
          aria-label="Query workspace"
          className="flex min-h-0 flex-1 flex-col overflow-hidden focus:outline-none"
        >
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* QueryBuilder: always on desktop, only on builder tab on mobile */}
            <div
              className={
                activeMobileTab === "preview"
                  ? "hidden min-h-0 flex-1 md:flex"
                  : "flex min-h-0 flex-1"
              }
            >
              <QueryBuilder />
            </div>

            {/* PreviewPanel: always on desktop, only on preview tab on mobile */}
            <div
              className={
                activeMobileTab === "builder"
                  ? "hidden md:flex"
                  : "flex min-h-0 flex-1 md:flex-none"
              }
            >
              <PreviewPanel />
            </div>
          </div>

          <ResultsDrawer
            isRunning={isRunning}
            results={results}
            allMatched={allMatched}
            sortField={sortField}
            sortDir={sortDir}
            page={page}
            pageSize={pageSize}
            goToPage={goToPage}
            changePageSize={changePageSize}
            toggleSort={toggleSort}
          />
        </main>
      </div>

      <ShortcutsModal />
      <ExportModal />
      <ImportModal />
    </div>
  );
}
