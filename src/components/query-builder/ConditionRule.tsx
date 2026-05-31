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
import type {
  Rule,
  RuleValue as RuleValueType,
} from "@/lib/query-engine/types";

interface ConditionRuleProps {
  rule: Rule;
  groupId: string;
  error?: string;
  dragListeners?: Record<string, unknown>;
  dragAttributes?: Record<string, unknown>;
}

export const ConditionRule = React.memo(
  function ConditionRule({
    rule,
    groupId,
    error,
    dragListeners,
    dragAttributes,
  }: ConditionRuleProps) {
    const { removeRule, updateRule } = useQueryActions();
    const schemaId = useQueryStore((s) => s.schemaId);
    const schema = getSchema(schemaId);
    const selectedField =
      schema.fields.find((f) => f.name === rule.field) ?? null;

    const handleFieldChange = useCallback(
      (field: string) => updateRule(groupId, rule.id, { field }),
      [groupId, rule.id, updateRule],
    );

    const handleOperatorChange = useCallback(
      (
        operator: RuleValueType extends never
          ? never
          : Parameters<typeof updateRule>[2]["operator"],
      ) =>
        updateRule(groupId, rule.id, {
          operator: operator as Rule["operator"],
        }),
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
      <motion.div
        variants={ruleVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
      >
        <div
          className={cn(
            "group/rule flex items-center gap-2 rounded-md border px-3 py-2",
            hasError
              ? "border-destructive bg-destructive-muted"
              : "border-border-default bg-bg-elevated",
          )}
        >
          <DragHandle listeners={dragListeners} attributes={dragAttributes} />

          <RuleField
            value={rule.field}
            onChange={handleFieldChange}
            fields={schema.fields}
          />

          <RuleOperator
            value={rule.operator}
            onChange={handleOperatorChange as (op: Rule["operator"]) => void}
            fieldType={selectedField?.type ?? null}
            disabled={!rule.field}
          />

          <div className="flex flex-1 items-center">
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
  },
  (prev, next) =>
    prev.rule.id === next.rule.id &&
    prev.rule.field === next.rule.field &&
    prev.rule.operator === next.rule.operator &&
    prev.rule.value === next.rule.value &&
    prev.error === next.error,
);
