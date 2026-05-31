"use client";

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

export function AppLayout() {
  const { run, isRunning } = useQueryExecution();
  useKeyboardShortcuts({ onRunQuery: run });

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-base">
      <Header onRunQuery={run} isRunning={isRunning} />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
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
