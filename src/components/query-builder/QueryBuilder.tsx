"use client";

import {
  ArrowRotateLeft,
  ArrowRotateRight,
  SearchNormal1,
  Flash,
} from "iconsax-reactjs";
import { ConditionGroup } from "./ConditionGroup";
import { AddRuleButton, AddGroupButton } from "./AddRuleButton";
import { ComplexityBanner } from "./ComplexityBanner";
import { IconButton } from "../shared/IconButton";
import {
  useQueryStore,
  useQueryActions,
  useCanUndo,
  useCanRedo,
} from "@/store/query-store";
import { useValidation } from "@/hooks/useValidation";

export function QueryBuilder() {
  const tree = useQueryStore((s) => s.tree);
  const { undo, redo, clearTree, addRule, addGroup } = useQueryActions();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const hasConditions = tree.conditions.length > 0;
  const validation = useValidation();

  return (
    <section
      aria-label="Query builder"
      className="border-border-subtle bg-bg-base flex flex-1 flex-col gap-3 overflow-y-auto border-r p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-text-primary text-lg font-semibold">
          Query Builder
        </h2>
        <div className="flex items-center gap-1">
          <IconButton
            tooltip="Undo (Ctrl+Z)"
            aria-label="Undo"
            disabled={!canUndo}
            onClick={undo}
          >
            <ArrowRotateLeft size={14} />
          </IconButton>
          <IconButton
            tooltip="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
            disabled={!canRedo}
            onClick={redo}
          >
            <ArrowRotateRight size={14} />
          </IconButton>
          {hasConditions && (
            <button
              onClick={clearTree}
              className="text-destructive ml-2 text-sm hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <ComplexityBanner group={tree} />
      <ConditionGroup group={tree} depth={0} validation={validation} />

      {!hasConditions && (
        <QueryBuilderEmptyState onAddRule={() => addRule("root")} />
      )}

      <div className="flex gap-2">
        <AddRuleButton onClick={() => addRule("root")} />
        <AddGroupButton onClick={() => addGroup("root")} />
      </div>

      {hasConditions && !validation.isValid && (
        <p role="alert" className="text-destructive text-xs">
          {validation.errors.length} error
          {validation.errors.length !== 1 ? "s" : ""} — fix all rules before
          running
        </p>
      )}
    </section>
  );
}

function QueryBuilderEmptyState({ onAddRule }: { onAddRule: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-20 w-20" />
        <div className="bg-bg-elevated shadow-card relative rounded-2xl p-4">
          <SearchNormal1 size={28} className="text-accent" variant="TwoTone" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-md text-text-primary font-semibold">
          No conditions yet
        </p>
        <p className="text-text-muted max-w-55 text-sm">
          Add a rule to start filtering your dataset visually
        </p>
      </div>
      <button
        onClick={onAddRule}
        className="bg-accent hover:bg-accent-hover flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
      >
        <Flash size={14} variant="Bold" />
        Add your first rule
      </button>
    </div>
  );
}
