import type { Rule, Group, Schema } from "@/lib/query-engine/types";

export function buildRule(overrides?: Partial<Rule>): Rule {
  return {
    id: "rule-test-1",
    type: "rule",
    field: "codename",
    operator: "eq",
    value: "Ghost",
    ...overrides,
  };
}

export function buildGroup(overrides?: Partial<Group>): Group {
  return {
    id: "group-test-1",
    type: "group",
    logic: "AND",
    conditions: [],
    ...overrides,
  };
}

export function buildSchema(): Schema {
  return {
    id: "agents",
    name: "Agents",
    emoji: "🛸",
    description: "Covert intelligence operatives",
    recordCount: 87,
    fields: [
      { name: "codename", type: "string", label: "Codename" },
      { name: "missionsCompleted", type: "number", label: "Missions", min: 0, max: 200 },
      {
        name: "status",
        type: "enum",
        label: "Status",
        enumValues: ["active", "inactive", "compromised"],
      },
      { name: "compromised", type: "boolean", label: "Compromised" },
      { name: "lastSeen", type: "date", label: "Last Seen" },
      { name: "languages", type: "array", label: "Languages" },
    ],
  };
}
