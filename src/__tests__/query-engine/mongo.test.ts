import { describe, it, expect } from "vitest";
import { generateMongo } from "@/lib/query-engine/generators/mongo";
import { buildGroup, buildRule, buildSchema } from "../utils/builders";

const schema = buildSchema();

describe("MongoDB Generator", () => {
  it("returns empty object with no conditions", () => {
    expect(generateMongo(buildGroup({ conditions: [] }), schema)).toEqual({});
  });

  it("generates $eq for equals", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "eq", value: "Ghost" })],
    });
    expect(generateMongo(tree, schema)).toEqual({ codename: { $eq: "Ghost" } });
  });

  it("wraps AND group in $and array", () => {
    const tree = buildGroup({
      logic: "AND",
      conditions: [
        buildRule({ id: "r1", field: "codename", operator: "eq", value: "Ghost" }),
        buildRule({ id: "r2", field: "missionsCompleted", operator: "gt", value: 10 }),
      ],
    });
    const result = generateMongo(tree, schema) as Record<string, unknown>;
    expect(result).toHaveProperty("$and");
    expect(Array.isArray(result.$and)).toBe(true);
  });

  it("wraps OR group in $or array", () => {
    const tree = buildGroup({
      logic: "OR",
      conditions: [
        buildRule({ id: "r1", field: "codename", operator: "eq", value: "Ghost" }),
        buildRule({ id: "r2", field: "codename", operator: "eq", value: "Cipher" }),
      ],
    });
    const result = generateMongo(tree, schema) as Record<string, unknown>;
    expect(result).toHaveProperty("$or");
  });

  it("generates $regex for contains", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "contains", value: "hos" })],
    });
    const result = generateMongo(tree, schema) as Record<string, unknown>;
    expect((result.codename as Record<string, unknown>).$regex).toBe("hos");
  });

  it("generates $gte/$lte for between", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "missionsCompleted", operator: "between", value: [5, 50] })],
    });
    const result = generateMongo(tree, schema) as Record<string, unknown>;
    const field = result.missionsCompleted as Record<string, unknown>;
    expect(field.$gte).toBe(5);
    expect(field.$lte).toBe(50);
  });

  it("generates $in for in operator", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "status", operator: "in", value: ["active", "inactive"] })],
    });
    const result = generateMongo(tree, schema) as Record<string, unknown>;
    expect((result.status as Record<string, unknown>).$in).toEqual(["active", "inactive"]);
  });

  it("generates null check for is_null", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "is_null", value: null })],
    });
    const result = generateMongo(tree, schema) as Record<string, unknown>;
    expect((result.codename as Record<string, unknown>).$eq).toBeNull();
  });

  it("handles single condition without $and/$or wrapper", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "eq", value: "Ghost" })],
    });
    const result = generateMongo(tree, schema) as Record<string, unknown>;
    expect(result).not.toHaveProperty("$and");
    expect(result).not.toHaveProperty("$or");
    expect(result).toHaveProperty("codename");
  });

  it("handles nested groups producing nested $and/$or", () => {
    const inner = buildGroup({
      id: "g2",
      logic: "OR",
      conditions: [
        buildRule({ id: "r1", field: "codename", operator: "eq", value: "Ghost" }),
        buildRule({ id: "r2", field: "codename", operator: "eq", value: "Cipher" }),
      ],
    });
    const tree = buildGroup({ logic: "AND", conditions: [inner] });
    const result = generateMongo(tree, schema) as Record<string, unknown>;
    expect(result).toHaveProperty("$or");
  });
});
