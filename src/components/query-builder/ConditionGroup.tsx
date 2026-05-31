"use client";

import React, { useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "motion/react";
import { getDepthColor, groupBodyVariants, groupVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { countConditions } from "@/lib/query-engine/tree-utils";
import { GroupToolbar } from "./GroupToolbar";
import { SortableCondition } from "./SortableCondition";
import { AddRuleButton, AddGroupButton } from "./AddRuleButton";
import { useQueryActions } from "@/store/query-store";
import { useUIStore } from "@/store/ui-store";
import type { Group, Condition } from "@/lib/query-engine/types";

interface ValidationContext {
  getError: (id: string) => string | undefined;
}

const GROUP_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface ConditionGroupProps {
  group: Group;
  depth: number;
  parentGroupId?: string;
  groupIndex?: number;
  validation?: ValidationContext;
  dragListeners?: Record<string, unknown>;
  dragAttributes?: Record<string, unknown>;
}

export const ConditionGroup = React.memo(function ConditionGroup({
  group,
  depth,
  parentGroupId,
  groupIndex = 0,
  validation,
  dragListeners,
  dragAttributes,
}: ConditionGroupProps) {
  const { addRule, addGroup, removeGroup, updateGroupLogic, reorderCondition } =
    useQueryActions();
  const isCollapsed = useUIStore((s) => !!s.collapsedGroups[group.id]);
  const toggleGroupCollapse = useUIStore((s) => s.toggleGroupCollapse);

  const isRoot = depth === 0;
  const depthColor = useMemo(() => getDepthColor(depth), [depth]);
  const conditionCount = useMemo(() => countConditions(group), [group]);
  const groupLabel = `Group ${GROUP_LABELS[groupIndex % 26]}`;
  const conditionIds = useMemo(
    () => group.conditions.map((c) => c.id),
    [group.conditions],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleAddRule = useCallback(
    () => addRule(group.id),
    [group.id, addRule],
  );
  const handleAddGroup = useCallback(
    () => addGroup(group.id),
    [group.id, addGroup],
  );
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

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const fromIndex = group.conditions.findIndex((c) => c.id === active.id);
      const toIndex = group.conditions.findIndex((c) => c.id === over.id);
      if (fromIndex !== -1 && toIndex !== -1) {
        reorderCondition(group.id, fromIndex, toIndex);
      }
    },
    [group.conditions, group.id, reorderCondition],
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
      className={cn("rounded-md border border-l-[3px] p-3", "mb-2 last:mb-0")}
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
        dragListeners={dragListeners}
        dragAttributes={dragAttributes}
      />

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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={conditionIds}
                  strategy={verticalListSortingStrategy}
                >
                  <AnimatePresence mode="popLayout">
                    {group.conditions.map((condition: Condition, i: number) => (
                      <SortableCondition
                        key={condition.id}
                        condition={condition}
                        groupId={group.id}
                        index={i}
                        depth={depth}
                        validation={validation}
                      />
                    ))}
                  </AnimatePresence>
                </SortableContext>
              </DndContext>

              {validation?.getError(group.id) && (
                <p
                  role="alert"
                  className="border-destructive bg-destructive-muted text-destructive rounded-sm border-l-2 px-3 py-1.5 text-xs font-medium"
                >
                  {validation.getError(group.id)}
                </p>
              )}

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
