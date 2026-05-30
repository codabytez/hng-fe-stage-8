import type { Group, Rule, Schema } from "../types";

// schema param kept for API consistency with SQL/GraphQL generators
export function generateMongo(group: Group, schema?: Schema): object {
  void schema;
  return generateGroupMongo(group);
}

function generateGroupMongo(group: Group): object {
  const parts = group.conditions
    .map((condition) => {
      if (condition.type === "rule") return generateRuleMongo(condition as Rule);
      if (condition.type === "group") return generateGroupMongo(condition as Group);
      return null;
    })
    .filter((p): p is object => p !== null && Object.keys(p).length > 0);

  if (parts.length === 0) return {};
  if (parts.length === 1) return parts[0];
  return { [group.logic === "AND" ? "$and" : "$or"]: parts };
}

function generateRuleMongo(rule: Rule): object {
  const { field, operator, value } = rule;
  if (!field || !operator) return {};

  switch (operator) {
    case "eq": return { [field]: { $eq: value } };
    case "neq": return { [field]: { $ne: value } };
    case "contains": return { [field]: { $regex: value, $options: "i" } };
    case "not_contains": return { [field]: { $not: { $regex: value, $options: "i" } } };
    case "starts_with": return { [field]: { $regex: `^${value}`, $options: "i" } };
    case "ends_with": return { [field]: { $regex: `${value}$`, $options: "i" } };
    case "gt": return { [field]: { $gt: value } };
    case "gte": return { [field]: { $gte: value } };
    case "lt": return { [field]: { $lt: value } };
    case "lte": return { [field]: { $lte: value } };
    case "between": {
      const [a, b] = value as [unknown, unknown];
      return { [field]: { $gte: a, $lte: b } };
    }
    case "not_between": {
      const [a, b] = value as [unknown, unknown];
      return { [field]: { $not: { $gte: a, $lte: b } } };
    }
    case "in": return { [field]: { $in: value } };
    case "not_in": return { [field]: { $nin: value } };
    case "is_null": return { [field]: { $eq: null } };
    case "is_not_null": return { [field]: { $ne: null } };
    case "is_empty": return { [field]: { $eq: "" } };
    case "is_not_empty": return { [field]: { $ne: "" } };
    case "is_true": return { [field]: true };
    case "is_false": return { [field]: false };
    case "regex": return { [field]: { $regex: value } };
    case "before": return { [field]: { $lt: value } };
    case "after": return { [field]: { $gt: value } };
    case "is_today": {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return { [field]: { $gte: today.toISOString(), $lt: tomorrow.toISOString() } };
    }
    case "array_contains": return { [field]: { $elemMatch: { $eq: value } } };
    case "array_not_contains": return { [field]: { $not: { $elemMatch: { $eq: value } } } };
    case "array_is_empty": return { [field]: { $size: 0 } };
    case "array_is_not_empty": return { [field]: { $not: { $size: 0 } } };
    default: return {};
  }
}
