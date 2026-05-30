import type { Condition, Group, Rule } from "./types";

export function findGroup(tree: Group, groupId: string): Group | null {
  if (tree.id === groupId) return tree;
  for (const condition of tree.conditions) {
    if (condition.type === "group") {
      const found = findGroup(condition, groupId);
      if (found) return found;
    }
  }
  return null;
}

export function findParentGroup(
  tree: Group,
  conditionId: string,
): Group | null {
  for (const condition of tree.conditions) {
    if (condition.id === conditionId) return tree;
    if (condition.type === "group") {
      const found = findParentGroup(condition, conditionId);
      if (found) return found;
    }
  }
  return null;
}

export function findCondition(
  tree: Group,
  conditionId: string,
): Condition | null {
  for (const condition of tree.conditions) {
    if (condition.id === conditionId) return condition;
    if (condition.type === "group") {
      const found = findCondition(condition, conditionId);
      if (found) return found;
    }
  }
  return null;
}

export function countConditions(group: Group): number {
  let count = 0;
  for (const condition of group.conditions) {
    if (condition.type === "rule") {
      count += 1;
    } else {
      count += countConditions(condition);
    }
  }
  return count;
}

export function countGroups(group: Group): number {
  let count = 0;
  for (const condition of group.conditions) {
    if (condition.type === "group") {
      count += 1 + countGroups(condition);
    }
  }
  return count;
}

export function getMaxDepth(group: Group, depth = 0): number {
  let max = depth;
  for (const condition of group.conditions) {
    if (condition.type === "group") {
      max = Math.max(max, getMaxDepth(condition, depth + 1));
    }
  }
  return max;
}

export function isGroupEmpty(group: Group): boolean {
  return group.conditions.length === 0;
}

export function getRuleCount(group: Group): number {
  return countConditions(group);
}

export function collectAllGroupIds(group: Group): string[] {
  const ids: string[] = [group.id];
  for (const condition of group.conditions) {
    if (condition.type === "group") {
      ids.push(...collectAllGroupIds(condition));
    }
  }
  return ids;
}

export function makeEmptyRule(id: string): Rule {
  return { id, type: "rule", field: null, operator: null, value: null };
}

export function makeEmptyGroup(id: string): Group {
  return { id, type: "group", logic: "AND", conditions: [] };
}
