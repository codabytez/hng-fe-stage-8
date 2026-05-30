import type {
  Group,
  Rule,
  Schema,
  ValidationError,
  ValidationResult,
  OperatorValue,
} from "./types";

const NO_VALUE_OPERATORS = new Set<OperatorValue>([
  "is_null", "is_not_null", "is_empty", "is_not_empty",
  "is_true", "is_false", "is_today", "is_this_week", "is_this_month",
  "array_is_empty", "array_is_not_empty",
]);

export function validateTree(group: Group, schema: Schema): ValidationResult {
  const errors: ValidationError[] = [];
  validateGroup(group, schema, errors, true);
  return { isValid: errors.length === 0, errors };
}

function validateGroup(
  group: Group,
  schema: Schema,
  errors: ValidationError[],
  isRoot = false,
): void {
  if (group.conditions.length === 0) {
    if (!isRoot) {
      errors.push({
        conditionId: group.id,
        type: "group",
        message: "This group has no conditions. Add a rule or remove the group.",
      });
    }
    return;
  }

  for (const condition of group.conditions) {
    if (condition.type === "rule") {
      validateRule(condition as Rule, schema, errors);
    } else {
      validateGroup(condition as Group, schema, errors);
    }
  }
}

function validateRule(rule: Rule, schema: Schema, errors: ValidationError[]): void {
  if (!rule.field) {
    errors.push({ conditionId: rule.id, type: "rule", message: "Select a field to continue" });
    return;
  }

  if (!rule.operator) {
    errors.push({ conditionId: rule.id, type: "rule", message: "Select an operator" });
    return;
  }

  const field = schema.fields.find((f) => f.name === rule.field);
  if (!field) return;

  if (NO_VALUE_OPERATORS.has(rule.operator)) return;

  // Type-operator compatibility
  if (rule.operator === "contains" && field.type !== "string") {
    errors.push({ conditionId: rule.id, type: "rule", message: "Operator 'contains' is only valid for text fields" });
    return;
  }
  if (rule.operator === "regex" && field.type !== "string") {
    errors.push({ conditionId: rule.id, type: "rule", message: "Regex is only valid for text fields" });
    return;
  }

  // Between validation
  if (["between", "not_between"].includes(rule.operator)) {
    const [a, b] = (rule.value as [unknown, unknown] | undefined) ?? [undefined, undefined];
    if (a === undefined || a === null || a === "") {
      errors.push({ conditionId: rule.id, type: "rule", message: "Both values are required for 'between'" });
    } else if (b === undefined || b === null || b === "") {
      errors.push({ conditionId: rule.id, type: "rule", message: "Both values are required for 'between'" });
    } else if (field.type === "number" && Number(a) > Number(b)) {
      errors.push({ conditionId: rule.id, type: "rule", message: "First value must be less than second" });
    }
    return;
  }

  // In/not_in array validation
  if (["in", "not_in"].includes(rule.operator)) {
    if (!Array.isArray(rule.value) || rule.value.length === 0) {
      errors.push({ conditionId: rule.id, type: "rule", message: "Add at least one value" });
    }
    return;
  }

  // Empty value check
  if (rule.value === null || rule.value === undefined || rule.value === "") {
    errors.push({ conditionId: rule.id, type: "rule", message: "A value is required" });
  }
}
