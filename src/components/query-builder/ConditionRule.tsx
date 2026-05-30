"use client";

import React, { useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CloseCircle } from "iconsax-react";
import { cn } from "@/lib/utils";
import { ruleVariants } from "@/lib/motion";
import { DragHandle } from "./DragHandle";
import { IconButton } from "../shared/IconButton";
import { useQueryActions } from "@/store/query-store";
import type { Rule } from "@/lib/query-engine/types";

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
    const { removeRule } = useQueryActions();

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

          {/* Field selector placeholder */}
          <div className="border-border-default bg-bg-surface text-text-muted flex h-7.5 w-40 shrink-0 items-center rounded-md border px-2 text-sm">
            {rule.field ?? "Select field…"}
          </div>

          {/* Operator selector placeholder */}
          <div
            className={cn(
              "border-border-default bg-bg-surface flex h-7.5 w-36 shrink-0 items-center rounded-md border px-2 text-sm",
              !rule.field ? "opacity-50" : "text-text-muted",
            )}
          >
            {rule.operator ?? "Operator…"}
          </div>

          {/* Value input placeholder */}
          {rule.operator !== "is_null" && rule.operator !== "is_not_null" && (
            <div className="border-border-default bg-bg-surface text-text-muted flex h-7.5 flex-1 items-center rounded-md border px-2 text-sm">
              {rule.value !== null && rule.value !== undefined
                ? String(rule.value)
                : "Value…"}
            </div>
          )}

          {/* Remove */}
          <IconButton
            tooltip="Remove rule"
            aria-label="Remove rule"
            onClick={handleRemove}
            className={cn(
              "ml-auto shrink-0 opacity-0 transition-opacity group-hover/rule:opacity-100",
              "hover:bg-destructive/10 hover:text-destructive",
            )}
          >
            <CloseCircle size={14} />
          </IconButton>
        </div>

        {/* Inline error */}
        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              role="alert"
              aria-live="polite"
              className="border-destructive bg-destructive-muted text-destructive rounded-b-md border-l-2 px-3 py-1.5 text-xs font-medium"
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
