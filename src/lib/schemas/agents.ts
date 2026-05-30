import type { Schema } from "@/lib/query-engine/types";

export const agentsSchema: Schema = {
  id: "agents",
  name: "Agents",
  description: "Covert intelligence operatives",
  recordCount: 87,
  fields: [
    { name: "codename", type: "string", label: "Codename" },
    {
      name: "clearanceLevel",
      type: "enum",
      label: "Clearance Level",
      enumValues: ["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4", "LEVEL_5"],
    },
    { name: "lastSeen", type: "date", label: "Last Seen" },
    { name: "missionsCompleted", type: "number", label: "Missions Completed", min: 0, max: 200 },
    {
      name: "status",
      type: "enum",
      label: "Status",
      enumValues: ["active", "inactive", "compromised", "retired"],
    },
    {
      name: "region",
      type: "enum",
      label: "Region",
      enumValues: ["EMEA", "APAC", "Americas", "MENA", "Global"],
    },
    { name: "compromised", type: "boolean", label: "Compromised" },
    {
      name: "specialization",
      type: "enum",
      label: "Specialization",
      enumValues: ["Infiltration", "Surveillance", "Combat", "Cyber", "Extraction", "Analysis"],
    },
    { name: "languages", type: "array", label: "Languages" },
  ],
};
