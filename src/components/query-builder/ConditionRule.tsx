"use client";

import React, { useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CloseCircle } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { ruleVariants } from "@/lib/motion";
import { DragHandle } from "./DragHandle";
import { RuleField } from "./RuleField";
import { RuleOperator } from "./RuleOperator";
import { RuleValue } from "./RuleValue";
import { IconButton } from "../shared/IconButton";
import { useQueryActions, useQueryStore } from "@/store/query-store";
import { getSchema } from "@/lib/schemas";
import type { Rule, RuleValue as RuleValueType } from "@/lib/query-engine/types";

interface ConditionRuleProps {
  rule: Rule;
  groupId: string;
  error?: string;
  dragListeners?: Record<string, unknown>;
  dragAttributes?: Record<string, unknown>;
}

function ConditionRuleComponent({
  rule,
  groupId,
  error,
  dragListeners,
  dragAttributes,
}: ConditionRuleProps) {
  const { removeRule, updateRule } = useQueryActions();
  const schemaId = useQueryStore((s) => s.schemaId);
  const schema = getSchema(schemaId);
  const selectedField = schema.fields.find((f) => f.name === rule.field) ?? null;

  const handleFieldChange = useCallback(
    (field: string) => updateRule(groupId, rule.id, { field }),
    [groupId, rule.id, updateRule],
  );

  const handleOperatorChange = useCallback(
    (operator: Rule["operator"]) => updateRule(groupId, rule.id, { operator }),
    [groupId, rule.id, updateRule],
  );

  const handleValueChange = useCallback(
    (value: RuleValueType) => updateRule(groupId, rule.id, { value }),
    [groupId, rule.id, updateRule],
  );

  const handleRemove = useCallback(
    () => removeRule(groupId, rule.id),
    [groupId, rule.id, removeRule],
  );

  const hasError = !!error;

  return (
    <motion.div variants={ruleVariants} initial="hidden" animate="visible" exit="exit" layout>
      <div
        className={cn(
          "group/rule flex flex-wrap items-center gap-2 rounded-md border px-3 py-2",
          hasError
            ? "border-destructive bg-destructive-muted"
            : "border-border-default bg-bg-elevated",
        )}
      >
        <DragHandle listeners={dragListeners} attributes={dragAttributes} />

        <RuleField value={rule.field} onChange={handleFieldChange} fields={schema.fields} />

        <RuleOperator
          value={rule.operator}
          onChange={handleOperatorChange}
          fieldType={selectedField?.type ?? null}
          disabled={!rule.field}
        />

        <div className="flex min-w-0 flex-1 basis-full items-center sm:basis-auto">
          <RuleValue
            field={selectedField}
            operator={rule.operator}
            value={rule.value}
            onChange={handleValueChange}
          />
        </div>

        <IconButton
          tooltip="Remove rule"
          aria-label="Remove rule"
          onClick={handleRemove}
          className="text-text-muted hover:bg-destructive/10 hover:text-destructive ml-auto shrink-0"
        >
          <CloseCircle size={14} />
        </IconButton>
      </div>

      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            role="alert"
            aria-live="polite"
            className="border-destructive bg-destructive-muted text-destructive rounded-b-md px-3 py-1.5 text-xs font-medium"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function areEqual(prev: ConditionRuleProps, next: ConditionRuleProps) {
  return (
    prev.rule.id === next.rule.id &&
    prev.rule.field === next.rule.field &&
    prev.rule.operator === next.rule.operator &&
    prev.rule.value === next.rule.value &&
    prev.error === next.error
  );
}

export const ConditionRule = React.memo(ConditionRuleComponent, areEqual);
