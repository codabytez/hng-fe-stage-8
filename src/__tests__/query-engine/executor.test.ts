import { describe, it, expect } from "vitest";
import { executeQuery } from "@/lib/query-engine/executor";
import { buildGroup, buildRule } from "../utils/builders";

const mockData = [
  { id: "1", codename: "Ghost", status: "active", missionsCompleted: 47, compromised: false, lastSeen: "2024-01-12", languages: ["English", "French"] },
  { id: "2", codename: "Cipher", status: "inactive", missionsCompleted: 23, compromised: false, lastSeen: "2023-11-08", languages: ["Russian"] },
  { id: "3", codename: "Viper", status: "compromised", missionsCompleted: 5, compromised: true, lastSeen: "2023-06-01", languages: ["English"] },
  { id: "4", codename: "Shadow", status: "active", missionsCompleted: 100, compromised: false, lastSeen: "2024-03-15", languages: ["Mandarin", "English"] },
  { id: "5", codename: "Raven", status: "retired", missionsCompleted: 0, compromised: false, lastSeen: "2022-01-01", languages: [] },
];

describe("Executor", () => {
  it("returns all records for empty group", () => {
    expect(executeQuery(buildGroup({ conditions: [] }), mockData)).toHaveLength(5);
  });

  it("filters by equals", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "eq", value: "Ghost" })],
    });
    const result = executeQuery(tree, mockData);
    expect(result).toHaveLength(1);
    expect(result[0].codename).toBe("Ghost");
  });

  it("filters by not equals", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "status", operator: "neq", value: "active" })],
    });
    const result = executeQuery(tree, mockData);
    expect(result.every((r) => r.status !== "active")).toBe(true);
  });

  it("filters by contains (case-insensitive)", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "contains", value: "iper" })],
    });
    const result = executeQuery(tree, mockData);
    expect(result).toHaveLength(1);
    expect(result[0].codename).toBe("Viper");
  });

  it("filters by greater than", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "missionsCompleted", operator: "gt", value: 40 })],
    });
    const result = executeQuery(tree, mockData);
    expect(result.every((r) => Number(r.missionsCompleted) > 40)).toBe(true);
  });

  it("filters by between (inclusive)", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "missionsCompleted", operator: "between", value: [10, 50] })],
    });
    const result = executeQuery(tree, mockData);
    expect(result.every((r) => Number(r.missionsCompleted) >= 10 && Number(r.missionsCompleted) <= 50)).toBe(true);
  });

  it("filters by in array", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "status", operator: "in", value: ["active", "retired"] })],
    });
    const result = executeQuery(tree, mockData);
    expect(result.every((r) => ["active", "retired"].includes(r.status as string))).toBe(true);
  });

  it("filters by is_null", () => {
    const dataWithNull = [...mockData, { id: "6", codename: null, status: "active", missionsCompleted: 0, compromised: false, lastSeen: "2024-01-01", languages: [] }];
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "is_null", value: null })],
    });
    expect(executeQuery(tree, dataWithNull as typeof mockData)).toHaveLength(1);
  });

  it("filters by is_true", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "compromised", operator: "is_true", value: null })],
    });
    const result = executeQuery(tree, mockData);
    expect(result).toHaveLength(1);
    expect(result[0].compromised).toBe(true);
  });

  it("filters by regex", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "regex", value: "^G" })],
    });
    const result = executeQuery(tree, mockData);
    expect(result).toHaveLength(1);
    expect(result[0].codename).toBe("Ghost");
  });

  it("applies AND logic (all conditions must match)", () => {
    const tree = buildGroup({
      logic: "AND",
      conditions: [
        buildRule({ id: "r1", field: "status", operator: "eq", value: "active" }),
        buildRule({ id: "r2", field: "missionsCompleted", operator: "gt", value: 50 }),
      ],
    });
    const result = executeQuery(tree, mockData);
    expect(result).toHaveLength(1);
    expect(result[0].codename).toBe("Shadow");
  });

  it("applies OR logic (any condition must match)", () => {
    const tree = buildGroup({
      logic: "OR",
      conditions: [
        buildRule({ id: "r1", field: "status", operator: "eq", value: "compromised" }),
        buildRule({ id: "r2", field: "missionsCompleted", operator: "eq", value: 0 }),
      ],
    });
    const result = executeQuery(tree, mockData);
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it("handles nested AND inside OR correctly", () => {
    const inner = buildGroup({
      id: "g2",
      logic: "AND",
      conditions: [
        buildRule({ id: "r1", field: "status", operator: "eq", value: "active" }),
        buildRule({ id: "r2", field: "missionsCompleted", operator: "gt", value: 40 }),
      ],
    });
    const tree = buildGroup({ logic: "OR", conditions: [inner] });
    const result = executeQuery(tree, mockData);
    expect(result.every((r) => r.status === "active" && Number(r.missionsCompleted) > 40)).toBe(true);
  });

  it("returns empty array when no records match", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "eq", value: "Nonexistent" })],
    });
    expect(executeQuery(tree, mockData)).toHaveLength(0);
  });

  it("handles invalid regex without throwing", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "regex", value: "[invalid" })],
    });
    expect(() => executeQuery(tree, mockData)).not.toThrow();
    expect(executeQuery(tree, mockData)).toHaveLength(0);
  });

  it("filters by array_contains", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "languages", operator: "array_contains", value: "French" })],
    });
    const result = executeQuery(tree, mockData);
    expect(result).toHaveLength(1);
    expect(result[0].codename).toBe("Ghost");
  });

  it("filters by array_is_empty", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "languages", operator: "array_is_empty", value: null })],
    });
    const result = executeQuery(tree, mockData);
    expect(result).toHaveLength(1);
    expect(result[0].codename).toBe("Raven");
  });
});
