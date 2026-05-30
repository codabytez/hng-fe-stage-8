import type { Schema } from "@/lib/query-engine/types";

export const incidentsSchema: Schema = {
  id: "incidents",
  name: "Incidents",
  description: "System anomaly and event log",
  recordCount: 203,
  fields: [
    { name: "title", type: "string", label: "Title" },
    {
      name: "severity",
      type: "enum",
      label: "Severity",
      enumValues: ["critical", "high", "medium", "low", "info"],
    },
    { name: "reportedAt", type: "date", label: "Reported At" },
    { name: "resolvedAt", type: "date", label: "Resolved At" },
    { name: "affectedSystems", type: "array", label: "Affected Systems" },
    { name: "reporter", type: "string", label: "Reporter" },
    {
      name: "status",
      type: "enum",
      label: "Status",
      enumValues: ["open", "investigating", "resolved", "closed", "wontfix"],
    },
    { name: "responseTime", type: "number", label: "Response Time (mins)", min: 0 },
    { name: "isEscalated", type: "boolean", label: "Escalated" },
  ],
};
