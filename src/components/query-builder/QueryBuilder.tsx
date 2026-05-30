"use client";

import { ArrowRotateLeft, ArrowRotateRight } from "iconsax-reactjs";
import { ConditionGroup } from "./ConditionGroup";
import { AddRuleButton, AddGroupButton } from "./AddRuleButton";
import { ComplexityBanner } from "./ComplexityBanner";
import { IconButton } from "../shared/IconButton";
import { useQueryStore, useQueryActions, useCanUndo, useCanRedo } from "@/store/query-store";
import { useValidation } from "@/hooks/useValidation";

export function QueryBuilder() {
  const tree = useQueryStore((s) => s.tree);
  const { undo, redo, clearTree, addRule, addGroup } = useQueryActions();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const hasConditions = tree.conditions.length > 0;
  const validation = useValidation();

  return (
    <section className="flex flex-1 flex-col gap-3 overflow-y-auto border-r border-border-subtle bg-bg-base p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Query Builder</h2>
        <div className="flex items-center gap-1">
          <IconButton tooltip="Undo (Ctrl+Z)" aria-label="Undo" disabled={!canUndo} onClick={undo}>
            <ArrowRotateLeft size={14} />
          </IconButton>
          <IconButton tooltip="Redo (Ctrl+Shift+Z)" aria-label="Redo" disabled={!canRedo} onClick={redo}>
            <ArrowRotateRight size={14} />
          </IconButton>
          {hasConditions && (
            <button onClick={clearTree} className="ml-2 text-sm text-destructive hover:underline">
              Clear All
            </button>
          )}
        </div>
      </div>

      <ComplexityBanner group={tree} />
      <ConditionGroup group={tree} depth={0} validation={validation} />

      <div className="flex gap-2">
        <AddRuleButton onClick={() => addRule("root")} />
        <AddGroupButton onClick={() => addGroup("root")} />
      </div>

      {hasConditions && !validation.isValid && (
        <p className="text-xs text-destructive">
          {validation.errors.length} error{validation.errors.length !== 1 ? "s" : ""} — fix all rules before running
        </p>
      )}
    </section>
  );
}
