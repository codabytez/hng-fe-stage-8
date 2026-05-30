import type { FieldType, OperatorValue } from "./types";

export interface OperatorDef {
  value: OperatorValue;
  label: string;
  noValue?: boolean;
  isBetween?: boolean;
  isArray?: boolean;
}

const STRING_OPS: OperatorDef[] = [
  { value: "eq", label: "Equals" },
  { value: "neq", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does Not Contain" },
  { value: "starts_with", label: "Starts With" },
  { value: "ends_with", label: "Ends With" },
  { value: "is_empty", label: "Is Empty", noValue: true },
  { value: "is_not_empty", label: "Is Not Empty", noValue: true },
  { value: "is_null", label: "Is Null", noValue: true },
  { value: "is_not_null", label: "Is Not Null", noValue: true },
  { value: "regex", label: "Matches Regex" },
];

const NUMBER_OPS: OperatorDef[] = [
  { value: "eq", label: "Equals" },
  { value: "neq", label: "Not Equals" },
  { value: "gt", label: "Greater Than" },
  { value: "gte", label: "Greater Than or Equal" },
  { value: "lt", label: "Less Than" },
  { value: "lte", label: "Less Than or Equal" },
  { value: "between", label: "Between", isBetween: true },
  { value: "not_between", label: "Not Between", isBetween: true },
  { value: "is_null", label: "Is Null", noValue: true },
  { value: "is_not_null", label: "Is Not Null", noValue: true },
];

const ENUM_OPS: OperatorDef[] = [
  { value: "eq", label: "Equals" },
  { value: "neq", label: "Not Equals" },
  { value: "in", label: "In", isArray: true },
  { value: "not_in", label: "Not In", isArray: true },
  { value: "is_null", label: "Is Null", noValue: true },
  { value: "is_not_null", label: "Is Not Null", noValue: true },
];

const BOOLEAN_OPS: OperatorDef[] = [
  { value: "is_true", label: "Is True", noValue: true },
  { value: "is_false", label: "Is False", noValue: true },
  { value: "is_null", label: "Is Null", noValue: true },
  { value: "is_not_null", label: "Is Not Null", noValue: true },
];

const DATE_OPS: OperatorDef[] = [
  { value: "eq", label: "Equals" },
  { value: "neq", label: "Not Equals" },
  { value: "before", label: "Before" },
  { value: "after", label: "After" },
  { value: "between", label: "Between", isBetween: true },
  { value: "is_today", label: "Is Today", noValue: true },
  { value: "is_this_week", label: "Is This Week", noValue: true },
  { value: "is_this_month", label: "Is This Month", noValue: true },
  { value: "is_null", label: "Is Null", noValue: true },
  { value: "is_not_null", label: "Is Not Null", noValue: true },
];

const ARRAY_OPS: OperatorDef[] = [
  { value: "array_contains", label: "Contains" },
  { value: "array_not_contains", label: "Does Not Contain" },
  { value: "array_is_empty", label: "Is Empty", noValue: true },
  { value: "array_is_not_empty", label: "Is Not Empty", noValue: true },
  { value: "is_null", label: "Is Null", noValue: true },
  { value: "is_not_null", label: "Is Not Null", noValue: true },
];

const OPERATOR_MAP: Record<FieldType, OperatorDef[]> = {
  string: STRING_OPS,
  number: NUMBER_OPS,
  enum: ENUM_OPS,
  boolean: BOOLEAN_OPS,
  date: DATE_OPS,
  array: ARRAY_OPS,
};

export function getOperatorsForType(type: FieldType): OperatorDef[] {
  return OPERATOR_MAP[type] ?? STRING_OPS;
}

export function getOperatorDef(type: FieldType, value: OperatorValue): OperatorDef | undefined {
  return getOperatorsForType(type).find((op) => op.value === value);
}

export const NO_VALUE_OPERATORS = new Set<OperatorValue>([
  "is_null","is_not_null","is_empty","is_not_empty",
  "is_true","is_false","is_today","is_this_week","is_this_month",
  "array_is_empty","array_is_not_empty",
]);
