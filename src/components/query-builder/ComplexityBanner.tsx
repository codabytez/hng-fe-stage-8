"use client";

import React, { useMemo } from "react";

import { countConditions, countGroups, getMaxDepth } from "@/lib/query-engine/tree-utils";
import type { Group } from "@/lib/query-engine/types";
import type { ComplexityScore } from "@/lib/query-engine/types";

function calculateComplexity(group: Group): ComplexityScore {
  const conditionCount = countConditions(group);
  const groupCount = countGroups(group);
  const maxDepth = getMaxDepth(group);
  const raw = conditionCount * 1 + groupCount * 2 + maxDepth * 3;
  const score = Math.max(1, Math.min(5, Math.ceil(raw / 5))) as 1 | 2 | 3 | 4 | 5;
  const labels = ["Simple", "Low", "Moderate", "High", "Very High"] as const;
  return { score, label: labels[score - 1], conditionCount, groupCount, maxDepth };
}

interface ComplexityBannerProps {
  group: Group;
}

export const ComplexityBanner = React.memo(function ComplexityBanner({ group }: ComplexityBannerProps) {
  const complexity = useMemo(() => calculateComplexity(group), [group]);
  const { score, label, conditionCount, groupCount, maxDepth } = complexity;

  const dotColor =
    score <= 2 ? "var(--success)" : score === 3 ? "var(--warning)" : "var(--destructive)";

  return (
    <div className="flex items-center gap-3 rounded-md bg-bg-surface px-3 py-1.5">
      <span className="text-xs text-text-muted">Complexity</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="inline-block h-2 w-2 rounded-full transition-colors"
            style={{
              backgroundColor: i <= score ? dotColor : "var(--border-default)",
            }}
          />
        ))}
      </div>
      <span className="text-xs font-medium" style={{ color: dotColor }}>
        {label}
      </span>
      <span className="text-xs text-text-muted">
        · {conditionCount} condition{conditionCount !== 1 ? "s" : ""} · {groupCount} group{groupCount !== 1 ? "s" : ""} · max depth: {maxDepth}
      </span>
    </div>
  );
});
