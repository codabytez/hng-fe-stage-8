import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/lib/utils";
import type { Group, PreviewFormat } from "@/lib/query-engine/types";

const MAX_HISTORY = 20;
const MAX_PRESETS = 50;

export interface QueryHistoryEntry {
  id: string;
  tree: Group;
  schemaId: string;
  timestamp: number;
  conditionCount: number;
  resultCount: number;
}

export interface SavedPreset {
  id: string;
  name: string;
  tree: Group;
  schemaId: string;
  format: PreviewFormat;
  createdAt: number;
}

interface HistoryStoreState {
  history: QueryHistoryEntry[];
  presets: SavedPreset[];
}

interface HistoryStoreActions {
  addHistory: (entry: Omit<QueryHistoryEntry, "id">) => void;
  clearHistory: () => void;
  savePreset: (
    name: string,
    tree: Group,
    schemaId: string,
    format: PreviewFormat,
  ) => { success: boolean; error?: string };
  deletePreset: (id: string) => void;
  getPreset: (id: string) => SavedPreset | null;
}

type HistoryStore = HistoryStoreState & HistoryStoreActions;

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      history: [],
      presets: [],

      addHistory: (entry) =>
        set((s) => {
          const newEntry: QueryHistoryEntry = { ...entry, id: generateId() };
          const updated = [newEntry, ...s.history];
          return { history: updated.slice(0, MAX_HISTORY) };
        }),

      clearHistory: () => set({ history: [] }),

      savePreset: (name, tree, schemaId, format) => {
        const existing = get().presets.find((p) => p.name === name);
        if (existing) {
          return {
            success: false,
            error: "A preset with this name already exists",
          };
        }
        if (get().presets.length >= MAX_PRESETS) {
          return { success: false, error: "Maximum of 50 presets reached" };
        }
        const preset: SavedPreset = {
          id: generateId(),
          name,
          tree,
          schemaId,
          format,
          createdAt: Date.now(),
        };
        set((s) => ({ presets: [...s.presets, preset] }));
        return { success: true };
      },

      deletePreset: (id) =>
        set((s) => ({ presets: s.presets.filter((p) => p.id !== id) })),

      getPreset: (id) => get().presets.find((p) => p.id === id) ?? null,
    }),
    {
      name: "nexusdb-history",
      partialize: (state) => ({
        history: state.history,
        presets: state.presets,
      }),
    },
  ),
);

export function useHistory() {
  return useHistoryStore((s) => s.history);
}

export function usePresets() {
  return useHistoryStore((s) => s.presets);
}
