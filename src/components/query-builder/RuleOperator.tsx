"use client";

import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOperatorsForType } from "@/lib/query-engine/operators";
import type { FieldType, OperatorValue } from "@/lib/query-engine/types";

interface RuleOperatorProps {
  value: OperatorValue | null;
  onChange: (op: OperatorValue) => void;
  fieldType: FieldType | null;
  disabled?: boolean;
}

export function RuleOperator({ value, onChange, fieldType, disabled }: RuleOperatorProps) {
  const operators = fieldType ? getOperatorsForType(fieldType) : [];
  const isDisabled = disabled || !fieldType;

  return (
    <Select
      value={value ?? ""}
      onValueChange={(v) => onChange(v as OperatorValue)}
      disabled={isDisabled}
    >
      <SelectTrigger className={cn("w-36 shrink-0", isDisabled && "cursor-not-allowed opacity-50")}>
        <SelectValue placeholder="Operator…" />
      </SelectTrigger>
      <SelectContent>
        {operators.map((op) => (
          <SelectItem key={op.value} value={op.value}>
            {op.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
