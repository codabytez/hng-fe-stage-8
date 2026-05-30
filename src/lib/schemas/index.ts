import { agentsSchema } from "./agents";
import { citiesSchema } from "./cities";
import { incidentsSchema } from "./incidents";
import type { Schema } from "@/lib/query-engine/types";

export { agentsSchema, citiesSchema, incidentsSchema };

export const SCHEMAS: Record<string, Schema> = {
  agents: agentsSchema,
  cities: citiesSchema,
  incidents: incidentsSchema,
};

export function getSchema(id: string): Schema {
  const schema = SCHEMAS[id];
  if (!schema) throw new Error(`Unknown schema: ${id}`);
  return schema;
}
