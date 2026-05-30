export type FieldType =
  | "string"
  | "number"
  | "enum"
  | "boolean"
  | "date"
  | "array";

export type LogicOperator = "AND" | "OR";

export type OperatorValue =
  | "eq"
  | "neq"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "not_between"
  | "in"
  | "not_in"
  | "is_null"
  | "is_not_null"
  | "is_empty"
  | "is_not_empty"
  | "is_true"
  | "is_false"
  | "regex"
  | "before"
  | "after"
  | "is_today"
  | "is_this_week"
  | "is_this_month"
  | "array_contains"
  | "array_not_contains"
  | "array_is_empty"
  | "array_is_not_empty";

export type RuleValue =
  | string
  | number
  | boolean
  | string[]
  | [string, string]
  | [number, number]
  | null;

export interface Rule {
  id: string;
  type: "rule";
  field: string | null;
  operator: OperatorValue | null;
  value: RuleValue;
}

export interface Group {
  id: string;
  type: "group";
  logic: LogicOperator;
  conditions: Condition[];
}

export type Condition = Rule | Group;

export interface SchemaField {
  name: string;
  type: FieldType;
  label: string;
  enumValues?: string[];
  min?: number;
  max?: number;
}

export interface Schema {
  id: string;
  name: string;
  emoji: string;
  description: string;
  recordCount: number;
  fields: SchemaField[];
}

export interface ValidationError {
  conditionId: string;
  message: string;
  type: "rule" | "group";
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ComplexityScore {
  score: 1 | 2 | 3 | 4 | 5;
  label: "Simple" | "Low" | "Moderate" | "High" | "Very High";
  conditionCount: number;
  groupCount: number;
  maxDepth: number;
}

export type PreviewFormat = "SQL" | "MongoDB" | "GraphQL";
