import { create } from "zustand";
import type { Schema } from "@/lib/query-engine/types";

export interface CustomDataset {
  schema: Schema;
  data: Record<string, unknown>[];
}

interface CustomDataStore {
  datasets: CustomDataset[];
  addDataset: (dataset: CustomDataset) => void;
  removeDataset: (schemaId: string) => void;
}

export const useCustomDataStore = create<CustomDataStore>()((set) => ({
  datasets: [],

  addDataset: (dataset) =>
    set((s) => ({
      datasets: [
        ...s.datasets.filter((d) => d.schema.id !== dataset.schema.id),
        dataset,
      ],
    })),

  removeDataset: (schemaId) =>
    set((s) => ({
      datasets: s.datasets.filter((d) => d.schema.id !== schemaId),
    })),
}));
