import React from "react";
import { calculateComplexity } from "@/lib/query-engine/complexity";
import type { Group } from "@/lib/query-engine/types";

interface ComplexityIndicatorProps {
  group: Group;
}

export const ComplexityIndicator = React.memo(function ComplexityIndicator({ group }: ComplexityIndicatorProps) {
  const { score, label, conditionCount, maxDepth } = calculateComplexity(group);

  const dotColor =
    score <= 2 ? "var(--success)" : score === 3 ? "var(--warning)" : "var(--destructive)";

  return (
    <div className="flex items-center gap-2.5 text-xs">
      <span className="text-text-muted">Complexity</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="inline-block h-2 w-2 rounded-full transition-colors"
            style={{ backgroundColor: i <= score ? dotColor : "var(--border-default)" }}
          />
        ))}
      </div>
      <span className="font-medium" style={{ color: dotColor }}>{label}</span>
      <span className="text-text-muted">
        · {conditionCount} condition{conditionCount !== 1 ? "s" : ""} · max depth: {maxDepth}
      </span>
    </div>
  );
});
