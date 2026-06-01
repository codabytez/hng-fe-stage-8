import { describe, it, expect } from "vitest";
import { inferSchema, parseImportedData } from "@/lib/query-engine/schema-inferrer";

describe("inferFieldType via inferSchema", () => {
  it("infers boolean fields", () => {
    const data = [{ active: true }, { active: false }, { active: true }];
    const schema = inferSchema("Test", data);
    expect(schema.fields[0].type).toBe("boolean");
  });

  it("infers number fields", () => {
    const data = [{ score: 1 }, { score: 2.5 }, { score: 100 }];
    const schema = inferSchema("Test", data);
    expect(schema.fields[0].type).toBe("number");
  });

  it("infers array fields", () => {
    const data = [{ tags: ["a", "b"] }, { tags: ["c"] }, { tags: [] }];
    const schema = inferSchema("Test", data);
    expect(schema.fields[0].type).toBe("array");
  });

  it("infers date fields from ISO strings", () => {
    const data = [
      { createdAt: "2024-01-01" },
      { createdAt: "2024-06-15" },
      { createdAt: "2024-12-31T10:00" },
    ];
    const schema = inferSchema("Test", data);
    expect(schema.fields[0].type).toBe("date");
  });

  it("infers enum when unique values <= 12", () => {
    const data = ["admin", "user", "guest", "admin", "user"].map((role) => ({ role }));
    const schema = inferSchema("Test", data);
    expect(schema.fields[0].type).toBe("enum");
    expect(schema.fields[0].enumValues).toEqual(["admin", "guest", "user"]);
  });

  it("infers string when unique values > 12", () => {
    const data = Array.from({ length: 20 }, (_, i) => ({ name: `user_${i}` }));
    const schema = inferSchema("Test", data);
    expect(schema.fields[0].type).toBe("string");
  });

  it("ignores null/empty values when inferring type", () => {
    const data = [{ val: null }, { val: "" }, { val: 42 }, { val: 7 }];
    const schema = inferSchema("Test", data);
    expect(schema.fields[0].type).toBe("number");
  });

  it("defaults to string for all-null field", () => {
    const data = [{ val: null }, { val: null }];
    const schema = inferSchema("Test", data);
    expect(schema.fields[0].type).toBe("string");
  });

  it("returns empty schema for empty data", () => {
    const schema = inferSchema("Empty", []);
    expect(schema.fields).toHaveLength(0);
    expect(schema.recordCount).toBe(0);
  });

  it("sets schema name and record count correctly", () => {
    const data = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const schema = inferSchema("My Dataset", data);
    expect(schema.name).toBe("My Dataset");
    expect(schema.recordCount).toBe(3);
  });

  it("generates human-readable labels from camelCase keys", () => {
    const data = [{ clearanceLevel: 5 }];
    const schema = inferSchema("Test", data);
    expect(schema.fields[0].label).toBe("Clearance Level");
  });

  it("generates human-readable labels from snake_case keys", () => {
    const data = [{ first_name: "Alice" }];
    const schema = inferSchema("Test", data);
    expect(schema.fields[0].label).toBe("First Name");
  });
});

describe("parseImportedData", () => {
  it("parses a JSON array", () => {
    const raw = JSON.stringify([{ id: 1, name: "Alice" }]);
    const result = parseImportedData(raw);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Alice");
  });

  it("parses NDJSON (newline-delimited JSON)", () => {
    const raw = `{"id":1,"name":"Alice"}\n{"id":2,"name":"Bob"}`;
    const result = parseImportedData(raw);
    expect(result).toHaveLength(2);
    expect(result[1].name).toBe("Bob");
  });

  it("parses a single NDJSON object as one row", () => {
    const result = parseImportedData('{"key":"value"}');
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe("value");
  });

  it("throws on empty JSON array", () => {
    expect(() => parseImportedData("[]")).toThrow("empty");
  });

  it("throws on unsupported format", () => {
    expect(() => parseImportedData("name,age\nAlice,30")).toThrow("Unsupported");
  });

  it("throws when rows are not objects", () => {
    expect(() => parseImportedData("[1, 2, 3]")).toThrow();
  });
});
