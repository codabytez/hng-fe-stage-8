"use client";

import { TextInput } from "@/components/inputs/TextInput";
import { NumberInput } from "@/components/inputs/NumberInput";
import { NumberRangeInput } from "@/components/inputs/NumberRangeInput";
import { DateInput } from "@/components/inputs/DateInput";
import { DateRangeInput } from "@/components/inputs/DateRangeInput";
import { EnumSelect } from "@/components/inputs/EnumSelect";
import { BooleanToggle } from "@/components/inputs/BooleanToggle";
import { TagInput } from "@/components/inputs/TagInput";
import { RegexInput } from "@/components/inputs/RegexInput";
import { NO_VALUE_OPERATORS, getOperatorDef } from "@/lib/query-engine/operators";
import type { SchemaField, OperatorValue, RuleValue as RuleValueType } from "@/lib/query-engine/types";

interface RuleValueProps {
  field: SchemaField | null;
  operator: OperatorValue | null;
  value: RuleValueType;
  onChange: (v: RuleValueType) => void;
}

export function RuleValue({ field, operator, value, onChange }: RuleValueProps) {
  if (!field || !operator) return null;
  if (NO_VALUE_OPERATORS.has(operator)) return null;

  const opDef = getOperatorDef(field.type, operator);

  // Array operators (in / not_in)
  if (opDef?.isArray) {
    return (
      <TagInput
        value={(value as string[]) ?? []}
        onChange={(v) => onChange(v)}
      />
    );
  }

  // Between operators
  if (opDef?.isBetween) {
    if (field.type === "date") {
      return (
        <DateRangeInput
          value={(value as [string, string]) ?? ["", ""]}
          onChange={(v) => onChange(v)}
        />
      );
    }
    return (
      <NumberRangeInput
        value={(value as [number | string, number | string]) ?? ["", ""]}
        onChange={(v) => onChange(v as RuleValueType)}
        min={field.min}
        max={field.max}
      />
    );
  }

  // Per field type
  switch (field.type) {
    case "string":
      if (operator === "regex") {
        return <RegexInput value={(value as string) ?? ""} onChange={(v) => onChange(v)} />;
      }
      return <TextInput value={(value as string) ?? ""} onChange={(v) => onChange(v)} />;

    case "number":
      return (
        <NumberInput
          value={(value as number | string) ?? ""}
          onChange={(v) => onChange(v)}
          min={field.min}
          max={field.max}
        />
      );

    case "enum":
      return (
        <EnumSelect
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
          options={field.enumValues ?? []}
        />
      );

    case "boolean":
      return (
        <BooleanToggle
          value={!!value}
          onChange={(v) => onChange(v)}
        />
      );

    case "date":
      return (
        <DateInput
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
        />
      );

    case "array":
      return (
        <TextInput
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
          placeholder="Enter value…"
        />
      );

    default:
      return <TextInput value={(value as string) ?? ""} onChange={(v) => onChange(v)} />;
  }
}
