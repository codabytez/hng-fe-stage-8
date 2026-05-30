import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Draft } from "immer";
import { generateId } from "@/lib/utils";
import {
  findGroup,
  makeEmptyRule,
  makeEmptyGroup,
} from "@/lib/query-engine/tree-utils";
import type { Group, Rule, LogicOperator } from "@/lib/query-engine/types";

const MAX_UNDO_STACK = 50;

interface QueryStoreState {
  tree: Group;
  schemaId: string;
  undoStack: Group[];
  redoStack: Group[];
  canUndo: boolean;
  canRedo: boolean;
}

interface QueryStoreActions {
  addRule: (groupId: string) => void;
  removeRule: (groupId: string, ruleId: string) => void;
  updateRule: (
    groupId: string,
    ruleId: string,
    patch: Partial<Pick<Rule, "field" | "operator" | "value">>,
  ) => void;
  addGroup: (parentGroupId: string) => void;
  removeGroup: (parentGroupId: string, groupId: string) => void;
  updateGroupLogic: (groupId: string, logic: LogicOperator) => void;
  moveCondition: (
    sourceGroupId: string,
    targetGroupId: string,
    conditionId: string,
    targetIndex: number,
  ) => void;
  reorderCondition: (
    groupId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
  clearTree: () => void;
  replaceTree: (tree: Group) => void;
  setSchema: (schemaId: string) => void;
  undo: () => void;
  redo: () => void;
}

type QueryStore = QueryStoreState & QueryStoreActions;

function makeRootGroup(): Group {
  return makeEmptyGroup("root");
}

function snapshot(tree: Group): Group {
  return JSON.parse(JSON.stringify(tree)) as Group;
}

function pushHistory(state: Draft<QueryStoreState>): void {
  state.undoStack.push(snapshot(state.tree as Group));
  if (state.undoStack.length > MAX_UNDO_STACK) state.undoStack.shift();
  state.redoStack = [];
  state.canUndo = true;
  state.canRedo = false;
}

export const useQueryStore = create<QueryStore>()(
  immer((set) => ({
    tree: makeRootGroup(),
    schemaId: "agents",
    undoStack: [],
    redoStack: [],
    canUndo: false,
    canRedo: false,

    addRule: (groupId) =>
      set((state) => {
        pushHistory(state);
        const group = findGroup(state.tree as Group, groupId);
        if (!group) return;
        group.conditions.push(makeEmptyRule(generateId()) as Draft<Rule>);
      }),

    removeRule: (groupId, ruleId) =>
      set((state) => {
        pushHistory(state);
        const group = findGroup(state.tree as Group, groupId);
        if (!group) return;
        const idx = group.conditions.findIndex((c) => c.id === ruleId);
        if (idx !== -1) group.conditions.splice(idx, 1);
      }),

    updateRule: (groupId, ruleId, patch) =>
      set((state) => {
        pushHistory(state);
        const group = findGroup(state.tree as Group, groupId);
        if (!group) return;
        const rule = group.conditions.find(
          (c) => c.id === ruleId && c.type === "rule",
        ) as Draft<Rule> | undefined;
        if (!rule) return;

        if ("field" in patch && patch.field !== rule.field) {
          rule.field = patch.field ?? null;
          rule.operator = null;
          rule.value = null;
          return;
        }
        if ("operator" in patch) {
          rule.operator = patch.operator ?? null;
          if (!("value" in patch)) rule.value = null;
        }
        if ("value" in patch) {
          rule.value = patch.value ?? null;
        }
      }),

    addGroup: (parentGroupId) =>
      set((state) => {
        pushHistory(state);
        const parent = findGroup(state.tree as Group, parentGroupId);
        if (!parent) return;
        parent.conditions.push(makeEmptyGroup(generateId()) as Draft<Group>);
      }),

    removeGroup: (parentGroupId, groupId) =>
      set((state) => {
        if (groupId === "root") return;
        pushHistory(state);
        const parent = findGroup(state.tree as Group, parentGroupId);
        if (!parent) return;
        const idx = parent.conditions.findIndex((c) => c.id === groupId);
        if (idx !== -1) parent.conditions.splice(idx, 1);
      }),

    updateGroupLogic: (groupId, logic) =>
      set((state) => {
        pushHistory(state);
        const group = findGroup(state.tree as Group, groupId);
        if (!group) return;
        group.logic = logic;
      }),

    moveCondition: (sourceGroupId, targetGroupId, conditionId, targetIndex) =>
      set((state) => {
        pushHistory(state);
        const source = findGroup(state.tree as Group, sourceGroupId);
        const target = findGroup(state.tree as Group, targetGroupId);
        if (!source || !target) return;
        const idx = source.conditions.findIndex((c) => c.id === conditionId);
        if (idx === -1) return;
        const [condition] = source.conditions.splice(idx, 1);
        const clamped = Math.min(targetIndex, target.conditions.length);
        target.conditions.splice(clamped, 0, condition);
      }),

    reorderCondition: (groupId, fromIndex, toIndex) =>
      set((state) => {
        pushHistory(state);
        const group = findGroup(state.tree as Group, groupId);
        if (!group) return;
        if (
          fromIndex < 0 ||
          fromIndex >= group.conditions.length ||
          toIndex < 0 ||
          toIndex >= group.conditions.length
        )
          return;
        const [item] = group.conditions.splice(fromIndex, 1);
        group.conditions.splice(toIndex, 0, item);
      }),

    clearTree: () =>
      set((state) => {
        pushHistory(state);
        state.tree = makeRootGroup() as Draft<Group>;
      }),

    replaceTree: (tree) =>
      set((state) => {
        pushHistory(state);
        state.tree = snapshot(tree) as Draft<Group>;
      }),

    setSchema: (schemaId) =>
      set((state) => {
        state.schemaId = schemaId;
        state.tree = makeRootGroup() as Draft<Group>;
        state.undoStack = [];
        state.redoStack = [];
        state.canUndo = false;
        state.canRedo = false;
      }),

    undo: () =>
      set((state) => {
        if (state.undoStack.length === 0) return;
        state.redoStack.push(snapshot(state.tree as Group));
        state.tree = state.undoStack.pop()! as Draft<Group>;
        state.canUndo = state.undoStack.length > 0;
        state.canRedo = true;
      }),

    redo: () =>
      set((state) => {
        if (state.redoStack.length === 0) return;
        state.undoStack.push(snapshot(state.tree as Group));
        state.tree = state.redoStack.pop()! as Draft<Group>;
        state.canUndo = true;
        state.canRedo = state.redoStack.length > 0;
      }),
  })),
);

export function useQueryTree() {
  return useQueryStore((s) => s.tree);
}

export function useSchemaId() {
  return useQueryStore((s) => s.schemaId);
}

export function useCanUndo() {
  return useQueryStore((s) => s.canUndo);
}

export function useCanRedo() {
  return useQueryStore((s) => s.canRedo);
}

export function useQueryActions() {
  return useQueryStore((s) => ({
    addRule: s.addRule,
    removeRule: s.removeRule,
    updateRule: s.updateRule,
    addGroup: s.addGroup,
    removeGroup: s.removeGroup,
    updateGroupLogic: s.updateGroupLogic,
    moveCondition: s.moveCondition,
    reorderCondition: s.reorderCondition,
    clearTree: s.clearTree,
    replaceTree: s.replaceTree,
    setSchema: s.setSchema,
    undo: s.undo,
    redo: s.redo,
  }));
}
