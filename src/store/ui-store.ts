import { create } from "zustand";
import type { PreviewFormat } from "@/lib/query-engine/types";

interface UIStoreState {
  sidebarOpen: boolean;
  sidebarSection: "schema" | "history" | "presets";
  activeFormat: PreviewFormat;
  resultsOpen: boolean;
  collapsedGroups: Record<string, boolean>;
  shortcutModalOpen: boolean;
  exportModalOpen: boolean;
  importModalOpen: boolean;
  activeMobileTab: "builder" | "preview";
}

interface UIStoreActions {
  toggleSidebar: () => void;
  setSidebarSection: (section: UIStoreState["sidebarSection"]) => void;
  setActiveFormat: (format: PreviewFormat) => void;
  toggleResults: () => void;
  setResultsOpen: (open: boolean) => void;
  toggleGroupCollapse: (groupId: string) => void;
  collapseAll: (groupIds: string[]) => void;
  expandAll: () => void;
  setShortcutModalOpen: (open: boolean) => void;
  setExportModalOpen: (open: boolean) => void;
  setImportModalOpen: (open: boolean) => void;
  setActiveMobileTab: (tab: "builder" | "preview") => void;
}

type UIStore = UIStoreState & UIStoreActions;

export const useUIStore = create<UIStore>()((set) => ({
  sidebarOpen: true,
  sidebarSection: "schema",
  activeFormat: "SQL",
  resultsOpen: false,
  collapsedGroups: {},
  shortcutModalOpen: false,
  exportModalOpen: false,
  importModalOpen: false,
  activeMobileTab: "builder",

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  setSidebarSection: (section) => set({ sidebarSection: section }),

  setActiveFormat: (format) => set({ activeFormat: format }),

  toggleResults: () => set((s) => ({ resultsOpen: !s.resultsOpen })),

  setResultsOpen: (open) => set({ resultsOpen: open }),

  toggleGroupCollapse: (groupId) =>
    set((s) => ({
      collapsedGroups: {
        ...s.collapsedGroups,
        [groupId]: !s.collapsedGroups[groupId],
      },
    })),

  collapseAll: (groupIds) => {
    const collapsed: Record<string, boolean> = {};
    for (const id of groupIds) collapsed[id] = true;
    set({ collapsedGroups: collapsed });
  },

  expandAll: () => set({ collapsedGroups: {} }),

  setShortcutModalOpen: (open) => set({ shortcutModalOpen: open }),
  setExportModalOpen: (open) => set({ exportModalOpen: open }),
  setImportModalOpen: (open) => set({ importModalOpen: open }),
  setActiveMobileTab: (tab) => set({ activeMobileTab: tab }),
}));

export function useSidebarOpen() {
  return useUIStore((s) => s.sidebarOpen);
}

export function useActiveFormat() {
  return useUIStore((s) => s.activeFormat);
}

export function useResultsOpen() {
  return useUIStore((s) => s.resultsOpen);
}

export function useIsGroupCollapsed(groupId: string) {
  return useUIStore((s) => !!s.collapsedGroups[groupId]);
}

export function useModals() {
  return useUIStore((s) => ({
    shortcutModalOpen: s.shortcutModalOpen,
    exportModalOpen: s.exportModalOpen,
    importModalOpen: s.importModalOpen,
    setShortcutModalOpen: s.setShortcutModalOpen,
    setExportModalOpen: s.setExportModalOpen,
    setImportModalOpen: s.setImportModalOpen,
  }));
}
