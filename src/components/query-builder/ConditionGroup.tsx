"use client";

import React, { useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getDepthColor, groupBodyVariants, groupVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { countConditions } from "@/lib/query-engine/tree-utils";
import { GroupToolbar } from "./GroupToolbar";
import { ConditionRule } from "./ConditionRule";
import { AddRuleButton, AddGroupButton } from "./AddRuleButton";
import { useQueryActions } from "@/store/query-store";
import { useUIStore } from "@/store/ui-store";
import type { Group, Rule, Condition } from "@/lib/query-engine/types";

const GROUP_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface ConditionGroupProps {
  group: Group;
  depth: number;
  parentGroupId?: string;
  groupIndex?: number;
}

export const ConditionGroup = React.memo(function ConditionGroup({
  group,
  depth,
  parentGroupId,
  groupIndex = 0,
}: ConditionGroupProps) {
  const {
    addRule,
    addGroup,
    removeGroup,
    updateGroupLogic,
  } = useQueryActions();

  const isCollapsed = useUIStore((s) => !!s.collapsedGroups[group.id]);
  const toggleGroupCollapse = useUIStore((s) => s.toggleGroupCollapse);

  const isRoot = depth === 0;
  const depthColor = useMemo(() => getDepthColor(depth), [depth]);
  const conditionCount = useMemo(() => countConditions(group), [group]);
  const groupLabel = `Group ${GROUP_LABELS[groupIndex % 26]}`;

  const handleAddRule = useCallback(() => addRule(group.id), [group.id, addRule]);
  const handleAddGroup = useCallback(() => addGroup(group.id), [group.id, addGroup]);
  const handleRemove = useCallback(
    () => parentGroupId && removeGroup(parentGroupId, group.id),
    [parentGroupId, group.id, removeGroup],
  );
  const handleLogicChange = useCallback(
    (logic: "AND" | "OR") => updateGroupLogic(group.id, logic),
    [group.id, updateGroupLogic],
  );
  const handleToggleCollapse = useCallback(
    () => toggleGroupCollapse(group.id),
    [group.id, toggleGroupCollapse],
  );

  const containerStyle = {
    borderLeftColor: depthColor,
    backgroundColor: `color-mix(in srgb, ${depthColor} 5%, transparent)`,
    borderColor: `color-mix(in srgb, ${depthColor} 20%, var(--border-subtle))`,
  };

  return (
    <motion.div
      variants={isRoot ? undefined : groupVariants}
      initial={isRoot ? undefined : "hidden"}
      animate={isRoot ? undefined : "visible"}
      exit={isRoot ? undefined : "exit"}
      layout
      className={cn(
        "rounded-md border border-l-[3px] p-3",
        "mb-2 last:mb-0",
      )}
      style={containerStyle}
    >
      <GroupToolbar
        groupId={group.id}
        depth={depth}
        logic={group.logic}
        isRoot={isRoot}
        isCollapsed={isCollapsed}
        conditionCount={conditionCount}
        groupLabel={groupLabel}
        onLogicChange={handleLogicChange}
        onToggleCollapse={handleToggleCollapse}
        onAddRule={handleAddRule}
        onAddGroup={handleAddGroup}
        onRemove={handleRemove}
      />

      {/* Group body */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            variants={groupBodyVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="overflow-hidden"
          >
            <div className="mt-2 flex flex-col gap-2">
              <AnimatePresence mode="popLayout">
                {group.conditions.map((condition: Condition, i: number) => {
                  if (condition.type === "rule") {
                    return (
                      <ConditionRule
                        key={condition.id}
                        rule={condition as Rule}
                        groupId={group.id}
                      />
                    );
                  }
                  return (
                    <ConditionGroup
                      key={condition.id}
                      group={condition as Group}
                      depth={depth + 1}
                      parentGroupId={group.id}
                      groupIndex={i}
                    />
                  );
                })}
              </AnimatePresence>

              {/* Footer add buttons */}
              <div className="flex gap-2">
                <AddRuleButton onClick={handleAddRule} size="sm" />
                <AddGroupButton onClick={handleAddGroup} size="sm" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
