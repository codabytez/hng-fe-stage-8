"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ConditionRule } from "./ConditionRule";
import { ConditionGroup } from "./ConditionGroup";
import type { Condition, Rule, Group } from "@/lib/query-engine/types";

interface SortableConditionProps {
  condition: Condition;
  groupId: string;
  index: number;
  depth: number;
  validation?: { getError: (id: string) => string | undefined };
}

export function SortableCondition({
  condition,
  groupId,
  index,
  depth,
  validation,
}: SortableConditionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: condition.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 10 : undefined,
  };

  if (condition.type === "rule") {
    return (
      <div ref={setNodeRef} style={style}>
        <ConditionRule
          rule={condition as Rule}
          groupId={groupId}
          error={validation?.getError(condition.id)}
          dragListeners={listeners as Record<string, unknown>}
          dragAttributes={attributes as unknown as Record<string, unknown>}
        />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style}>
      <ConditionGroup
        group={condition as Group}
        depth={depth + 1}
        parentGroupId={groupId}
        groupIndex={index}
        validation={validation}
        dragListeners={listeners as Record<string, unknown>}
        dragAttributes={attributes as unknown as Record<string, unknown>}
      />
    </div>
  );
}
