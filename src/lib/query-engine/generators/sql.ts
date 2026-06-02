import type { Group, Rule, Schema } from "../types";

export function generateSQL(group: Group, schema: Schema): string {
  const tableName = schema.id;
  const where = generateGroupSQL(group, 0);
  if (!where) return `SELECT *\nFROM ${tableName}`;
  return `SELECT *\nFROM ${tableName}\nWHERE\n${where}`;
}

function generateGroupSQL(group: Group, depth: number): string {
  const childIndent = "  ".repeat(depth + 1);

  const parts = group.conditions
    .map((condition) => {
      if (condition.type === "rule") return generateRuleSQL(condition as Rule);
      if (condition.type === "group") return generateGroupSQL(condition as Group, depth + 1);
      return null;
    })
    .filter(Boolean) as string[];

  if (parts.length === 0) return "";
  if (parts.length === 1) return `${childIndent}${parts[0]}`;

  const op = group.logic;
  const joined = parts.join(`\n${childIndent}${op}\n${childIndent}`);

  if (depth === 0) return `${childIndent}${joined}`;
  const indent = "  ".repeat(depth);
  return `${indent}(\n${childIndent}${joined}\n${indent})`;
}

function generateRuleSQL(rule: Rule): string {
  const { field, operator, value } = rule;
  if (!field || !operator) return "/* incomplete rule */";

  switch (operator) {
    case "eq": return `${field} = ${sqlVal(value)}`;
    case "neq": return `${field} != ${sqlVal(value)}`;
    case "contains": return `${field} LIKE '%${value}%'`;
    case "not_contains": return `${field} NOT LIKE '%${value}%'`;
    case "starts_with": return `${field} LIKE '${value}%'`;
    case "ends_with": return `${field} LIKE '%${value}'`;
    case "gt": return `${field} > ${sqlVal(value)}`;
    case "gte": return `${field} >= ${sqlVal(value)}`;
    case "lt": return `${field} < ${sqlVal(value)}`;
    case "lte": return `${field} <= ${sqlVal(value)}`;
    case "between": {
      if (!Array.isArray(value)) return `/* incomplete rule */`;
      const [a, b] = value as [unknown, unknown];
      return `${field} BETWEEN ${sqlVal(a)} AND ${sqlVal(b)}`;
    }
    case "not_between": {
      if (!Array.isArray(value)) return `/* incomplete rule */`;
      const [a, b] = value as [unknown, unknown];
      return `${field} NOT BETWEEN ${sqlVal(a)} AND ${sqlVal(b)}`;
    }
    case "in": {
      const items = Array.isArray(value) ? value : [];
      return `${field} IN (${items.map(sqlVal).join(", ") || "NULL"})`;
    }
    case "not_in": {
      const items = Array.isArray(value) ? value : [];
      return `${field} NOT IN (${items.map(sqlVal).join(", ") || "NULL"})`;
    }
    case "is_null": return `${field} IS NULL`;
    case "is_not_null": return `${field} IS NOT NULL`;
    case "is_empty": return `${field} = ''`;
    case "is_not_empty": return `${field} != ''`;
    case "is_true": return `${field} = TRUE`;
    case "is_false": return `${field} = FALSE`;
    case "regex": return `${field} REGEXP '${value}'`;
    case "before": return `${field} < ${sqlVal(value)}`;
    case "after": return `${field} > ${sqlVal(value)}`;
    case "is_today": return `DATE(${field}) = CURDATE()`;
    case "is_this_week": return `YEARWEEK(${field}) = YEARWEEK(NOW())`;
    case "is_this_month": return `MONTH(${field}) = MONTH(NOW()) AND YEAR(${field}) = YEAR(NOW())`;
    case "array_contains": return `JSON_CONTAINS(${field}, '${JSON.stringify(value)}')`;
    case "array_not_contains": return `NOT JSON_CONTAINS(${field}, '${JSON.stringify(value)}')`;
    case "array_is_empty": return `JSON_LENGTH(${field}) = 0`;
    case "array_is_not_empty": return `JSON_LENGTH(${field}) > 0`;
    default: return `/* unsupported: ${operator} */`;
  }
}

function sqlVal(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  return `'${String(value)}'`;
}
