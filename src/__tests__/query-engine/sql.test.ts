import { describe, it, expect } from "vitest";
import { generateSQL } from "@/lib/query-engine/generators/sql";
import { buildGroup, buildRule, buildSchema } from "../utils/builders";

const schema = buildSchema();

describe("SQL Generator", () => {
  it("generates SELECT * with no conditions", () => {
    const tree = buildGroup({ conditions: [] });
    expect(generateSQL(tree, schema)).toBe("SELECT *\nFROM agents");
  });

  it("generates single equals rule", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "eq", value: "Ghost" })],
    });
    expect(generateSQL(tree, schema)).toContain("codename = 'Ghost'");
  });

  it("generates AND group with multiple rules", () => {
    const tree = buildGroup({
      logic: "AND",
      conditions: [
        buildRule({ id: "r1", field: "codename", operator: "eq", value: "Ghost" }),
        buildRule({ id: "r2", field: "missionsCompleted", operator: "gt", value: 10 }),
      ],
    });
    const sql = generateSQL(tree, schema);
    expect(sql).toContain("codename = 'Ghost'");
    expect(sql).toContain("AND");
    expect(sql).toContain("missionsCompleted > 10");
  });

  it("generates OR group with multiple rules", () => {
    const tree = buildGroup({
      logic: "OR",
      conditions: [
        buildRule({ id: "r1", field: "codename", operator: "eq", value: "Ghost" }),
        buildRule({ id: "r2", field: "codename", operator: "eq", value: "Cipher" }),
      ],
    });
    expect(generateSQL(tree, schema)).toContain("OR");
  });

  it("generates nested AND inside OR", () => {
    const inner = buildGroup({
      id: "g2",
      logic: "AND",
      conditions: [
        buildRule({ id: "r1", field: "codename", operator: "eq", value: "Ghost" }),
        buildRule({ id: "r2", field: "missionsCompleted", operator: "gt", value: 5 }),
      ],
    });
    const tree = buildGroup({ logic: "OR", conditions: [inner] });
    const sql = generateSQL(tree, schema);
    expect(sql).toContain("AND");
    expect(sql).toContain("codename = 'Ghost'");
  });

  it("handles contains operator", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "contains", value: "hos" })],
    });
    expect(generateSQL(tree, schema)).toContain("LIKE '%hos%'");
  });

  it("handles between operator with two values", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "missionsCompleted", operator: "between", value: [5, 50] })],
    });
    expect(generateSQL(tree, schema)).toContain("BETWEEN 5 AND 50");
  });

  it("handles in operator with array", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "status", operator: "in", value: ["active", "inactive"] })],
    });
    const sql = generateSQL(tree, schema);
    expect(sql).toContain("IN (");
    expect(sql).toContain("'active'");
    expect(sql).toContain("'inactive'");
  });

  it("handles is_null operator with no value", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "is_null", value: null })],
    });
    expect(generateSQL(tree, schema)).toContain("IS NULL");
  });

  it("escapes single quotes in string values", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "eq", value: "O'Brien" })],
    });
    expect(generateSQL(tree, schema)).toContain("'O''Brien'");
  });

  it("skips incomplete rules (no field/operator)", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: null, operator: null, value: null })],
    });
    expect(generateSQL(tree, schema)).toContain("/* incomplete rule */");
  });

  it("handles number values without quotes", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "missionsCompleted", operator: "gt", value: 42 })],
    });
    expect(generateSQL(tree, schema)).toContain("missionsCompleted > 42");
    expect(generateSQL(tree, schema)).not.toContain("'42'");
  });
});
