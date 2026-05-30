"use client";

import { Header } from "./Header";
import { Sidebar } from "../sidebar/Sidebar";
import { QueryBuilder } from "../query-builder/QueryBuilder";
import { PreviewPanel } from "../preview/PreviewPanel";
import { ResultsDrawer } from "../results/ResultsDrawer";

export function AppLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-base">
      <Header />
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
    </div>
  );
}
