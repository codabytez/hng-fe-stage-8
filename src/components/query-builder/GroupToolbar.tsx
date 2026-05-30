"use client";

import { motion } from "motion/react";
import { AddCircle, AddSquare, ArrowDown2, CloseCircle } from "iconsax-react";
import { LogicToggle } from "./LogicToggle";
import { DragHandle } from "./DragHandle";
import { IconButton } from "../shared/IconButton";

import type { LogicOperator } from "@/lib/query-engine/types";

interface GroupToolbarProps {
  groupId: string;
  depth: number;
  logic: LogicOperator;
  isRoot: boolean;
  isCollapsed: boolean;
  conditionCount: number;
  groupLabel: string;
  onLogicChange: (logic: LogicOperator) => void;
  onToggleCollapse: () => void;
  onAddRule: () => void;
  onAddGroup: () => void;
  onRemove: () => void;
  dragListeners?: Record<string, unknown>;
  dragAttributes?: Record<string, unknown>;
}

export function GroupToolbar({
  groupId,
  logic,
  isRoot,
  isCollapsed,
  conditionCount,
  groupLabel,
  onLogicChange,
  onToggleCollapse,
  onAddRule,
  onAddGroup,
  onRemove,
  dragListeners,
  dragAttributes,
}: GroupToolbarProps) {
  return (
    <div className="group/group flex items-center gap-2">
      {!isRoot && (
        <DragHandle listeners={dragListeners} attributes={dragAttributes} />
      )}

      <LogicToggle groupId={groupId} logic={logic} onChange={onLogicChange} />

      <span className="text-xs italic text-text-muted">{groupLabel}</span>

      {isCollapsed && (
        <span className="text-xs text-text-muted">
          · {conditionCount} condition{conditionCount !== 1 ? "s" : ""}
        </span>
      )}

      <div className="ml-auto flex items-center gap-1">
        <IconButton tooltip="Collapse group" onClick={onToggleCollapse} aria-label={isCollapsed ? "Expand group" : "Collapse group"}>
          <motion.span
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            <ArrowDown2 size={12} />
          </motion.span>
        </IconButton>

        <IconButton tooltip="Add rule" aria-label="Add rule" onClick={onAddRule}>
          <AddCircle size={14} />
        </IconButton>

        <IconButton tooltip="Add nested group" aria-label="Add nested group" onClick={onAddGroup}>
          <AddSquare size={14} />
        </IconButton>

        {!isRoot && (
          <IconButton
            tooltip="Remove group"
            aria-label="Remove group"
            onClick={onRemove}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <CloseCircle size={14} />
          </IconButton>
        )}
      </div>
    </div>
  );
}
