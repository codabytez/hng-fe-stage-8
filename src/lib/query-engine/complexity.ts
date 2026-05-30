import { countConditions, countGroups, getMaxDepth } from "./tree-utils";
import type { Group, ComplexityScore, OperatorValue } from "./types";

const COMPLEX_OPS = new Set<OperatorValue>(["regex", "between", "not_between"]);

function scoreOperators(group: Group): number {
  let score = 0;
  for (const condition of group.conditions) {
    if (condition.type === "rule" && condition.operator && COMPLEX_OPS.has(condition.operator)) {
      score += 1;
    } else if (condition.type === "group") {
      score += scoreOperators(condition);
    }
  }
  return score;
}

export function calculateComplexity(group: Group): ComplexityScore {
  const conditionCount = countConditions(group);
  const groupCount = countGroups(group);
  const maxDepth = getMaxDepth(group);
  const operatorScore = scoreOperators(group);

  const raw = conditionCount * 1 + groupCount * 2 + maxDepth * 3 + operatorScore;
  const score = Math.max(1, Math.min(5, Math.ceil(raw / 5))) as 1 | 2 | 3 | 4 | 5;
  const labels = ["Simple", "Low", "Moderate", "High", "Very High"] as const;

  return { score, label: labels[score - 1], conditionCount, groupCount, maxDepth };
}
