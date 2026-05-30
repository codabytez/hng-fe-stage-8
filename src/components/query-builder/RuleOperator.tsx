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

  return (
    <Select
      value={value ?? ""}
      onValueChange={(v) => onChange(v as OperatorValue)}
      disabled={disabled || !fieldType}
    >
      <SelectTrigger
        className={cn(
          "h-[30px] w-36 shrink-0 border-border-default bg-bg-surface text-sm",
          "focus:border-accent focus:ring-2 focus:ring-accent-muted",
          (!fieldType || disabled) && "cursor-not-allowed opacity-50",
        )}
      >
        <SelectValue placeholder="Operator…" />
      </SelectTrigger>
      <SelectContent className="border-border-default bg-bg-elevated">
        {operators.map((op) => (
          <SelectItem
            key={op.value}
            value={op.value}
            className="text-sm text-text-primary focus:bg-bg-hover focus:text-text-primary"
          >
            {op.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
