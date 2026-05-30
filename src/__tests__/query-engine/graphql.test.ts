import { describe, it, expect } from "vitest";
import { generateGraphQL } from "@/lib/query-engine/generators/graphql";
import { buildGroup, buildRule, buildSchema } from "../utils/builders";

const schema = buildSchema();

describe("GraphQL Generator", () => {
  it("generates query with schema name", () => {
    expect(generateGraphQL(buildGroup({ conditions: [] }), schema)).toContain("FilterAgents");
  });

  it("includes all schema fields in selection", () => {
    const gql = generateGraphQL(buildGroup({ conditions: [] }), schema);
    for (const field of schema.fields) {
      expect(gql).toContain(field.name);
    }
  });

  it("generates _eq for equals", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "eq", value: "Ghost" })],
    });
    expect(generateGraphQL(tree, schema)).toContain('codename: { _eq: "Ghost" }');
  });

  it("wraps AND in _and array", () => {
    const tree = buildGroup({
      logic: "AND",
      conditions: [
        buildRule({ id: "r1", field: "codename", operator: "eq", value: "Ghost" }),
        buildRule({ id: "r2", field: "missionsCompleted", operator: "gt", value: 10 }),
      ],
    });
    expect(generateGraphQL(tree, schema)).toContain("_and:");
  });

  it("wraps OR in _or array", () => {
    const tree = buildGroup({
      logic: "OR",
      conditions: [
        buildRule({ id: "r1", field: "codename", operator: "eq", value: "Ghost" }),
        buildRule({ id: "r2", field: "codename", operator: "eq", value: "Cipher" }),
      ],
    });
    expect(generateGraphQL(tree, schema)).toContain("_or:");
  });

  it("generates _ilike for contains", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "contains", value: "hos" })],
    });
    expect(generateGraphQL(tree, schema)).toContain("_ilike");
  });

  it("generates _in array syntax", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "status", operator: "in", value: ["active", "inactive"] })],
    });
    expect(generateGraphQL(tree, schema)).toContain("_in: [");
  });

  it("generates _is_null: true for is_null", () => {
    const tree = buildGroup({
      conditions: [buildRule({ field: "codename", operator: "is_null", value: null })],
    });
    expect(generateGraphQL(tree, schema)).toContain("_is_null: true");
  });

  it("handles empty conditions gracefully", () => {
    const gql = generateGraphQL(buildGroup({ conditions: [] }), schema);
    expect(gql).not.toContain("where:");
    expect(gql).toContain("FilterAgents");
  });

  it("handles nested groups", () => {
    const inner = buildGroup({
      id: "g2",
      logic: "AND",
      conditions: [
        buildRule({ id: "r1", field: "codename", operator: "eq", value: "Ghost" }),
      ],
    });
    const tree = buildGroup({ logic: "OR", conditions: [inner] });
    const gql = generateGraphQL(tree, schema);
    expect(gql).toContain("_and:");
  });
});
