import { describe, it, expect, beforeEach } from "vitest";
import { useQueryStore } from "@/store/query-store";
import type { Rule, Group } from "@/lib/query-engine/types";

function getStore() {
  return useQueryStore.getState();
}

function resetStore() {
  useQueryStore.setState({
    tree: { id: "root", type: "group", logic: "AND", conditions: [] },
    schemaId: "agents",
    undoStack: [],
    redoStack: [],
    canUndo: false,
    canRedo: false,
  });
}

describe("Query Store", () => {
  beforeEach(() => resetStore());

  // ── addRule ──────────────────────────────────────────────────────────────
  describe("addRule", () => {
    it("adds a rule to the root group", () => {
      getStore().addRule("root");
      expect(getStore().tree.conditions).toHaveLength(1);
      expect(getStore().tree.conditions[0].type).toBe("rule");
    });

    it("new rule has null field, operator, value", () => {
      getStore().addRule("root");
      const rule = getStore().tree.conditions[0] as Rule;
      expect(rule.field).toBeNull();
      expect(rule.operator).toBeNull();
      expect(rule.value).toBeNull();
    });

    it("generates a unique ID for each new rule", () => {
      getStore().addRule("root");
      getStore().addRule("root");
      const ids = getStore().tree.conditions.map((c) => c.id);
      expect(new Set(ids).size).toBe(2);
    });

    it("adds a rule to a nested group by ID", () => {
      getStore().addGroup("root");
      const nestedGroup = getStore().tree.conditions[0] as Group;
      getStore().addRule(nestedGroup.id);
      expect(nestedGroup.conditions).toHaveLength(0); // stale ref
      const fresh = (getStore().tree.conditions[0] as Group).conditions;
      expect(fresh).toHaveLength(1);
    });
  });

  // ── removeRule ────────────────────────────────────────────────────────────
  describe("removeRule", () => {
    it("removes a rule from the root group", () => {
      getStore().addRule("root");
      const ruleId = getStore().tree.conditions[0].id;
      getStore().removeRule("root", ruleId);
      expect(getStore().tree.conditions).toHaveLength(0);
    });

    it("does nothing if ruleId not found", () => {
      getStore().addRule("root");
      getStore().removeRule("root", "nonexistent");
      expect(getStore().tree.conditions).toHaveLength(1);
    });
  });

  // ── updateRule ────────────────────────────────────────────────────────────
  describe("updateRule", () => {
    it("updates the field and resets operator and value", () => {
      getStore().addRule("root");
      const ruleId = getStore().tree.conditions[0].id;
      getStore().updateRule("root", ruleId, { field: "codename" });
      const rule = getStore().tree.conditions[0] as Rule;
      expect(rule.field).toBe("codename");
      expect(rule.operator).toBeNull();
      expect(rule.value).toBeNull();
    });

    it("updates operator and resets value", () => {
      getStore().addRule("root");
      const ruleId = getStore().tree.conditions[0].id;
      getStore().updateRule("root", ruleId, { field: "codename" });
      getStore().updateRule("root", ruleId, { operator: "eq" });
      const rule = getStore().tree.conditions[0] as Rule;
      expect(rule.operator).toBe("eq");
      expect(rule.value).toBeNull();
    });

    it("updates value independently", () => {
      getStore().addRule("root");
      const ruleId = getStore().tree.conditions[0].id;
      getStore().updateRule("root", ruleId, { field: "codename" });
      getStore().updateRule("root", ruleId, { operator: "eq" });
      getStore().updateRule("root", ruleId, { value: "Ghost" });
      const rule = getStore().tree.conditions[0] as Rule;
      expect(rule.value).toBe("Ghost");
    });
  });

  // ── addGroup ──────────────────────────────────────────────────────────────
  describe("addGroup", () => {
    it("adds a nested group to root", () => {
      getStore().addGroup("root");
      expect(getStore().tree.conditions).toHaveLength(1);
      expect(getStore().tree.conditions[0].type).toBe("group");
    });

    it("new group starts with empty conditions and AND logic", () => {
      getStore().addGroup("root");
      const group = getStore().tree.conditions[0] as Group;
      expect(group.logic).toBe("AND");
      expect(group.conditions).toHaveLength(0);
    });
  });

  // ── removeGroup ───────────────────────────────────────────────────────────
  describe("removeGroup", () => {
    it("removes a nested group", () => {
      getStore().addGroup("root");
      const groupId = getStore().tree.conditions[0].id;
      getStore().removeGroup("root", groupId);
      expect(getStore().tree.conditions).toHaveLength(0);
    });

    it("does not remove the root group", () => {
      getStore().addGroup("root");
      getStore().removeGroup("root", "root");
      expect(getStore().tree.conditions).toHaveLength(1);
    });
  });

  // ── updateGroupLogic ──────────────────────────────────────────────────────
  describe("updateGroupLogic", () => {
    it("toggles AND to OR", () => {
      getStore().updateGroupLogic("root", "OR");
      expect(getStore().tree.logic).toBe("OR");
    });

    it("toggles OR to AND", () => {
      getStore().updateGroupLogic("root", "OR");
      getStore().updateGroupLogic("root", "AND");
      expect(getStore().tree.logic).toBe("AND");
    });
  });

  // ── reorderCondition ──────────────────────────────────────────────────────
  describe("reorderCondition", () => {
    it("reorders conditions within a group", () => {
      getStore().addRule("root");
      getStore().addRule("root");
      const ids = getStore().tree.conditions.map((c) => c.id);
      getStore().reorderCondition("root", 0, 1);
      const reordered = getStore().tree.conditions.map((c) => c.id);
      expect(reordered[0]).toBe(ids[1]);
      expect(reordered[1]).toBe(ids[0]);
    });
  });

  // ── clearTree ─────────────────────────────────────────────────────────────
  describe("clearTree", () => {
    it("resets to empty root group", () => {
      getStore().addRule("root");
      getStore().addGroup("root");
      getStore().clearTree();
      expect(getStore().tree.conditions).toHaveLength(0);
      expect(getStore().tree.id).toBe("root");
    });
  });

  // ── replaceTree ───────────────────────────────────────────────────────────
  describe("replaceTree", () => {
    it("replaces entire tree", () => {
      const newTree: Group = {
        id: "root",
        type: "group",
        logic: "OR",
        conditions: [
          { id: "r1", type: "rule", field: "codename", operator: "eq", value: "Ghost" },
        ],
      };
      getStore().replaceTree(newTree);
      expect(getStore().tree.logic).toBe("OR");
      expect(getStore().tree.conditions).toHaveLength(1);
    });
  });

  // ── undo / redo ───────────────────────────────────────────────────────────
  describe("undo/redo", () => {
    it("canUndo is false on initial state", () => {
      expect(getStore().canUndo).toBe(false);
    });

    it("canRedo is false before any undo", () => {
      expect(getStore().canRedo).toBe(false);
    });

    it("canUndo becomes true after an action", () => {
      getStore().addRule("root");
      expect(getStore().canUndo).toBe(true);
    });

    it("undoes addRule", () => {
      getStore().addRule("root");
      expect(getStore().tree.conditions).toHaveLength(1);
      getStore().undo();
      expect(getStore().tree.conditions).toHaveLength(0);
    });

    it("canRedo becomes true after undo", () => {
      getStore().addRule("root");
      getStore().undo();
      expect(getStore().canRedo).toBe(true);
    });

    it("redoes after undo", () => {
      getStore().addRule("root");
      getStore().undo();
      getStore().redo();
      expect(getStore().tree.conditions).toHaveLength(1);
    });

    it("clears redo stack on new action after undo", () => {
      getStore().addRule("root");
      getStore().undo();
      expect(getStore().canRedo).toBe(true);
      getStore().addGroup("root");
      expect(getStore().canRedo).toBe(false);
    });

    it("does nothing when undoing with empty stack", () => {
      expect(() => getStore().undo()).not.toThrow();
    });
  });
});
