import { nanoid } from "nanoid";
import type { Schema, SchemaField, FieldType } from "./types";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?/;
const ENUM_THRESHOLD = 12;

function inferFieldType(
  values: unknown[],
): { type: FieldType; enumValues?: string[] } {
  const nonNull = values.filter((v) => v != null && v !== "");
  if (nonNull.length === 0) return { type: "string" };

  if (nonNull.every((v) => typeof v === "boolean"))
    return { type: "boolean" };

  if (nonNull.every((v) => typeof v === "number"))
    return { type: "number" };

  if (nonNull.every((v) => Array.isArray(v)))
    return { type: "array" };

  const allStrings = nonNull.every((v) => typeof v === "string");

  if (allStrings && nonNull.every((v) => ISO_DATE_RE.test(v as string)))
    return { type: "date" };

  if (allStrings) {
    const unique = [...new Set(nonNull as string[])];
    if (unique.length <= ENUM_THRESHOLD)
      return { type: "enum", enumValues: unique.sort() };
  }

  return { type: "string" };
}

function toLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export function inferSchema(
  name: string,
  data: Record<string, unknown>[],
): Schema {
  if (data.length === 0) {
    return {
      id: `custom_${nanoid(6)}`,
      name,
      description: "Custom imported dataset",
      recordCount: 0,
      fields: [],
    };
  }

  const keys = Object.keys(data[0]);
  const sample = data.slice(0, 100);

  const fields: SchemaField[] = keys.map((key) => {
    const values = sample.map((row) => row[key]);
    const { type, enumValues } = inferFieldType(values);
    return {
      name: key,
      label: toLabel(key),
      type,
      ...(enumValues ? { enumValues } : {}),
    };
  });

  return {
    id: `custom_${nanoid(6)}`,
    name,
    description: `Custom dataset — ${data.length} records`,
    recordCount: data.length,
    fields,
  };
}

export function parseImportedData(
  raw: string,
): Record<string, unknown>[] {
  const trimmed = raw.trim();

  // JSON array
  if (trimmed.startsWith("[")) {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!Array.isArray(parsed))
      throw new Error("Expected a JSON array of objects");
    if (parsed.length === 0) throw new Error("Dataset is empty");
    if (typeof parsed[0] !== "object" || parsed[0] === null)
      throw new Error("Each row must be an object");
    return parsed as Record<string, unknown>[];
  }

  // NDJSON (newline-delimited JSON)
  if (trimmed.startsWith("{")) {
    const rows = trimmed
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => JSON.parse(l) as Record<string, unknown>);
    if (rows.length === 0) throw new Error("Dataset is empty");
    return rows;
  }

  throw new Error("Unsupported format. Paste a JSON array [ {...}, ... ] or NDJSON.");
}
