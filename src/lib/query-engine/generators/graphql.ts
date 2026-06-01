import { capitalize } from "@/lib/utils";
import type { Group, Rule, Schema } from "../types";

export function generateGraphQL(group: Group, schema: Schema): string {
  const where = generateGroupGQL(group, 2);
  const fields = schema.fields.map((f) => `    ${f.name}`).join("\n");

  if (!where) {
    return `query Filter${capitalize(schema.id)} {\n  ${schema.id} {\n${fields}\n  }\n}`;
  }

  return `query Filter${capitalize(schema.id)} {\n  ${schema.id}(\n    where: {\n${where}\n    }\n  ) {\n${fields}\n  }\n}`;
}

function generateGroupGQL(group: Group, depth: number): string {
  const indent = "  ".repeat(depth);
  const childIndent = "  ".repeat(depth + 1);
  const key = group.logic === "AND" ? "_and" : "_or";

  const parts = group.conditions
    .map((condition) => {
      if (condition.type === "rule") {
        const r = generateRuleGQL(condition as Rule);
        return r ? `${childIndent}  ${r}` : null;
      }
      if (condition.type === "group") return generateGroupGQL(condition as Group, depth + 1);
      return null;
    })
    .filter(Boolean) as string[];

  if (parts.length === 0) return "";
  return `${indent}${key}: [\n${indent}  {\n${parts.join("\n")}\n${indent}  }\n${indent}]`;
}

function generateRuleGQL(rule: Rule): string {
  const { field, operator, value } = rule;
  if (!field || !operator) return "";

  switch (operator) {
    case "eq": return `${field}: { _eq: ${gqlVal(value)} }`;
    case "neq": return `${field}: { _neq: ${gqlVal(value)} }`;
    case "contains": return `${field}: { _ilike: "%${value}%" }`;
    case "not_contains": return `${field}: { _nilike: "%${value}%" }`;
    case "starts_with": return `${field}: { _ilike: "${value}%" }`;
    case "ends_with": return `${field}: { _ilike: "%${value}" }`;
    case "gt": return `${field}: { _gt: ${gqlVal(value)} }`;
    case "gte": return `${field}: { _gte: ${gqlVal(value)} }`;
    case "lt": return `${field}: { _lt: ${gqlVal(value)} }`;
    case "lte": return `${field}: { _lte: ${gqlVal(value)} }`;
    case "between": {
      const [a, b] = value as [unknown, unknown];
      return `${field}: { _gte: ${gqlVal(a)}, _lte: ${gqlVal(b)} }`;
    }
    case "in": return `${field}: { _in: [${(Array.isArray(value) ? value : []).map(gqlVal).join(", ")}] }`;
    case "not_in": return `${field}: { _nin: [${(Array.isArray(value) ? value : []).map(gqlVal).join(", ")}] }`;
    case "is_null": return `${field}: { _is_null: true }`;
    case "is_not_null": return `${field}: { _is_null: false }`;
    case "is_true": return `${field}: { _eq: true }`;
    case "is_false": return `${field}: { _eq: false }`;
    case "before": return `${field}: { _lt: ${gqlVal(value)} }`;
    case "after": return `${field}: { _gt: ${gqlVal(value)} }`;
    case "regex": return `${field}: { _regex: ${gqlVal(value)} }`;
    default: return `# unsupported: ${operator}`;
  }
}

function gqlVal(value: unknown): string {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "null";
  return String(value);
}
