import { agentsSchema } from "./agents";
import { citiesSchema } from "./cities";
import { incidentsSchema } from "./incidents";
import { useCustomDataStore } from "@/store/custom-data-store";
import type { Schema } from "@/lib/query-engine/types";

export { agentsSchema, citiesSchema, incidentsSchema };

export const BUILTIN_SCHEMAS: Record<string, Schema> = {
  agents: agentsSchema,
  cities: citiesSchema,
  incidents: incidentsSchema,
};

export const SCHEMAS = BUILTIN_SCHEMAS;

export function getSchema(id: string): Schema {
  const builtin = BUILTIN_SCHEMAS[id];
  if (builtin) return builtin;

  // Zustand vanilla API — safe to call outside React
  const custom = useCustomDataStore
    .getState()
    .datasets.find((d) => d.schema.id === id);
  if (custom) return custom.schema;

  return BUILTIN_SCHEMAS.agents;
}
