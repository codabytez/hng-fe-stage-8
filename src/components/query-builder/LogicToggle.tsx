"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { LogicOperator } from "@/lib/query-engine/types";

interface LogicToggleProps {
  groupId: string;
  logic: LogicOperator;
  onChange: (logic: LogicOperator) => void;
}

export function LogicToggle({ groupId, logic, onChange }: LogicToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Logic operator"
      className="relative flex h-7 items-center rounded-full border border-border-default bg-bg-overlay px-0.5"
    >
      {(["AND", "OR"] as const).map((op) => {
        const isActive = logic === op;
        return (
          <button
            key={op}
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(op)}
            className={cn(
              "relative z-10 px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-colors duration-100",
              isActive
                ? op === "AND"
                  ? "text-white"
                  : "text-bg-base"
                : "text-text-muted hover:text-text-secondary",
            )}
          >
            {isActive && (
              <motion.div
                layoutId={`logic-indicator-${groupId}`}
                className={cn(
                  "absolute inset-0 rounded-full",
                  op === "AND" ? "bg-accent" : "bg-accent-2",
                )}
                style={{ zIndex: -1 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            {op}
          </button>
        );
      })}
    </div>
  );
}
