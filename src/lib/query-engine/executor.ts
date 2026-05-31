import type { Group, Rule, Condition, OperatorValue } from "./types";

export function executeQuery<T extends Record<string, unknown>>(
  group: Group,
  data: T[],
): T[] {
  return data.filter((record) => matchesGroup(record, group));
}

function matchesGroup<T extends Record<string, unknown>>(
  record: T,
  group: Group,
): boolean {
  if (group.conditions.length === 0) return true;
  if (group.logic === "AND") {
    return group.conditions.every((c) => matchesCondition(record, c));
  }
  return group.conditions.some((c) => matchesCondition(record, c));
}

function matchesCondition<T extends Record<string, unknown>>(
  record: T,
  condition: Condition,
): boolean {
  if (condition.type === "group") return matchesGroup(record, condition as Group);
  return matchesRule(record, condition as Rule);
}

function matchesRule<T extends Record<string, unknown>>(
  record: T,
  rule: Rule,
): boolean {
  if (!rule.field || !rule.operator) return true;

  const recordValue = record[rule.field];
  const { operator, value } = rule;

  switch (operator as OperatorValue) {
    case "eq": return recordValue === value;
    case "neq": return recordValue !== value;
    case "contains":
      return String(recordValue).toLowerCase().includes(String(value).toLowerCase());
    case "not_contains":
      return !String(recordValue).toLowerCase().includes(String(value).toLowerCase());
    case "starts_with":
      return String(recordValue).toLowerCase().startsWith(String(value).toLowerCase());
    case "ends_with":
      return String(recordValue).toLowerCase().endsWith(String(value).toLowerCase());
    case "gt": return Number(recordValue) > Number(value);
    case "gte": return Number(recordValue) >= Number(value);
    case "lt": return Number(recordValue) < Number(value);
    case "lte": return Number(recordValue) <= Number(value);
    case "between": {
      const [min, max] = value as [number, number];
      return Number(recordValue) >= Number(min) && Number(recordValue) <= Number(max);
    }
    case "not_between": {
      const [min, max] = value as [number, number];
      return Number(recordValue) < Number(min) || Number(recordValue) > Number(max);
    }
    case "in": return (value as unknown[]).includes(recordValue);
    case "not_in": return !(value as unknown[]).includes(recordValue);
    case "is_null": return recordValue === null || recordValue === undefined;
    case "is_not_null": return recordValue !== null && recordValue !== undefined;
    case "is_empty": return String(recordValue).trim() === "";
    case "is_not_empty": return String(recordValue).trim() !== "";
    case "is_true": return recordValue === true;
    case "is_false": return recordValue === false;
    case "regex": {
      try { return new RegExp(String(value)).test(String(recordValue)); }
      catch { return false; }
    }
    case "before":
      return new Date(String(recordValue)) < new Date(String(value));
    case "after":
      return new Date(String(recordValue)) > new Date(String(value));
    case "is_today": {
      const d = new Date(String(recordValue));
      const today = new Date();
      return d.toDateString() === today.toDateString();
    }
    case "is_this_week": {
      const d = new Date(String(recordValue));
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      return d >= start;
    }
    case "is_this_month": {
      const d = new Date(String(recordValue));
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    case "array_contains":
      return Array.isArray(recordValue) && (recordValue as unknown[]).includes(value);
    case "array_not_contains":
      return Array.isArray(recordValue) && !(recordValue as unknown[]).includes(value);
    case "array_is_empty":
      return Array.isArray(recordValue) && recordValue.length === 0;
    case "array_is_not_empty":
      return Array.isArray(recordValue) && recordValue.length > 0;
    default: return true;
  }
}
