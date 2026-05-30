import { describe, it, expect } from "vitest";
import { validateTree } from "@/lib/query-engine/validator";
import { buildGroup, buildRule, buildSchema } from "../utils/builders";

const schema = buildSchema();

describe("Validator", () => {
  it("returns valid for empty root group", () => {
    const result = validateTree(buildGroup({ conditions: [] }), schema);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns error for nested empty group", () => {
    const tree = buildGroup({
      conditions: [buildGroup({ id: "g2", conditions: [] })],
    });
    const result = validateTree(tree, schema);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].conditionId).toBe("g2");
    expect(result.errors[0].type).toBe("group");
  });

  it("returns error when field not selected", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: null, operator: null, value: null })],
    });
    const result = validateTree(tree, schema);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe("Select a field to continue");
  });

  it("returns error when operator not selected", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: null, value: null })],
    });
    const result = validateTree(tree, schema);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe("Select an operator");
  });

  it("returns error when value empty for eq operator", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "eq", value: "" })],
    });
    expect(validateTree(tree, schema).isValid).toBe(false);
  });

  it("returns no error for is_null (no value needed)", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "is_null", value: null })],
    });
    expect(validateTree(tree, schema).isValid).toBe(true);
  });

  it("returns no error for is_today (no value needed)", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "lastSeen", operator: "is_today", value: null })],
    });
    expect(validateTree(tree, schema).isValid).toBe(true);
  });

  it("returns error for contains on number field", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "missionsCompleted", operator: "contains", value: "5" })],
    });
    const result = validateTree(tree, schema);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toContain("'contains' is only valid for text fields");
  });

  it("returns error for regex on date field", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "lastSeen", operator: "regex", value: ".*" })],
    });
    expect(validateTree(tree, schema).isValid).toBe(false);
    expect(validateTree(tree, schema).errors[0].message).toContain("Regex is only valid for text fields");
  });

  it("returns error for between with one value missing", () => {
    const tree = buildGroup({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      conditions: [buildRule({ field: "missionsCompleted", operator: "between", value: [5, null] as any })],
    });
    expect(validateTree(tree, schema).isValid).toBe(false);
    expect(validateTree(tree, schema).errors[0].message).toContain("Both values are required");
  });

  it("returns error for between with min > max on number", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "missionsCompleted", operator: "between", value: [50, 5] })],
    });
    const result = validateTree(tree, schema);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toBe("First value must be less than second");
  });

  it("returns error for in operator with empty array", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "status", operator: "in", value: [] })],
    });
    expect(validateTree(tree, schema).isValid).toBe(false);
    expect(validateTree(tree, schema).errors[0].message).toBe("Add at least one value");
  });

  it("returns valid for in operator with values", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "status", operator: "in", value: ["active"] })],
    });
    expect(validateTree(tree, schema).isValid).toBe(true);
  });

  it("returns multiple errors for multiple invalid rules", () => {
    const tree = buildGroup({
      conditions: [
        buildRule({ id: "r1", field: null, operator: null, value: null }),
        buildRule({ id: "r2", field: null, operator: null, value: null }),
      ],
    });
    expect(validateTree(tree, schema).errors).toHaveLength(2);
  });

  it("recurses into nested groups to validate all rules", () => {
    const inner = buildGroup({
      id: "g2",
      conditions: [buildRule({ id: "r1", field: null, operator: null, value: null })],
    });
    const tree = buildGroup({ conditions: [inner] });
    expect(validateTree(tree, schema).isValid).toBe(false);
  });

  it("returns isValid: false when any error exists", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "eq", value: "" })],
    });
    expect(validateTree(tree, schema).isValid).toBe(false);
  });

  it("returns isValid: true when all rules are valid", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "eq", value: "Ghost" })],
    });
    expect(validateTree(tree, schema).isValid).toBe(true);
  });
});
