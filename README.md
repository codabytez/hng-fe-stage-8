# NexusDB Explorer

> SQL without the syntax.

A visual query builder for SQL, MongoDB, and GraphQL. Build complex nested database filters through a graphical interface — no raw query syntax required.

**Live:** [nexusdbx.vercel.app](https://nexusdbx.vercel.app) &nbsp;·&nbsp; **Docs:** [nexusdbx.vercel.app/docs](https://nexusdbx.vercel.app/docs)

---

## What it does

NexusDB Explorer lets you construct arbitrarily nested `AND`/`OR` filter trees against built-in or custom schemas, then instantly previews the resulting query in SQL, MongoDB, and GraphQL formats simultaneously.

- **Visual filter builder** — add rules, nest groups, drag to reorder
- **Three query output formats** — SQL, MongoDB filter syntax, GraphQL `where` input
- **Schema-driven inputs** — field type determines the input widget (date picker, enum dropdown, tag input, boolean toggle, number range, regex)
- **Custom data import** — paste a JSON array or upload a `.json` file; field types are inferred automatically
- **Live results** — runs the filter against data and shows matched rows in a resizable, paginated table with CSV export
- **50-step undo/redo** — powered by Immer patches
- **Presets** — save and reload named query configurations
- **Complexity scoring** — real-time indicator of query depth and condition count
- **Fully responsive** — mobile sidebar overlay, tab-switched builder/preview, rule wrap on small screens
- **Themed** — dark/light toggle, persisted across sessions

---

## Routes

| Path    | Description   |
| ------- | ------------- |
| `/`     | Landing page  |
| `/app`  | Query builder |
| `/docs` | Documentation |

---

## Tech stack

| Layer         | Library                            |
| ------------- | ---------------------------------- |
| Framework     | Next.js 16 (App Router)            |
| Styling       | Tailwind CSS v4 (CSS-first config) |
| Animation     | Motion (Framer Motion v12)         |
| State         | Zustand + Immer                    |
| Drag & drop   | @dnd-kit                           |
| UI primitives | Radix UI via shadcn                |
| Icons         | Iconsax React                      |
| Testing       | Vitest + Testing Library           |
| Fonts         | Space Grotesk + Geist Mono         |

---

## Architecture

### Overview

The app is split into three layers — **UI**, **state**, and **engine** — that communicate in one direction only:

```text
UI (React components)
  ↓ dispatches actions
State (Zustand stores)
  ↓ passes data
Engine (pure functions — generators, executor, validator)
```

The engine has no knowledge of React. The stores have no knowledge of UI. This means the query generators can be tested in complete isolation with plain JavaScript objects, with no component setup required.

### Component tree

```text
AppLayout
├── Sidebar          — schema selector, history, presets
├── Header           — schema pill, run button, theme toggle
├── MobileTabBar     — builder / preview switcher (mobile only)
├── QueryBuilder
│   └── ConditionGroup (recursive)
│       ├── GroupToolbar    — AND/OR toggle, add buttons
│       └── SortableCondition[]
│           ├── ConditionGroup (nested, same component)
│           └── ConditionRule
│               ├── RuleField    — field selector
│               ├── RuleOperator — operator selector
│               └── RuleValue    — type-appropriate input
├── PreviewPanel     — SQL / MongoDB / GraphQL output
└── ResultsDrawer    — query results, resizable
```

### Recursive rendering strategy

The query data model is a tree:

```ts
type Group = {
  id: string;
  logic: "AND" | "OR";
  conditions: (Rule | Group)[]; // a Group can contain more Groups
};
```

`ConditionGroup` renders itself recursively — when it encounters a child that is a `Group` (not a `Rule`), it renders another `ConditionGroup` with that child as props. There is no depth limit enforced in the component; the data structure determines how deep the tree goes.

```tsx
{
  group.conditions.map((condition) =>
    condition.type === "group" ? (
      <ConditionGroup group={condition} depth={depth + 1} /> // recurse
    ) : (
      <ConditionRule rule={condition} />
    ),
  );
}
```

Each nesting level receives an incremented `depth` prop (0–4+) which maps to a distinct left-border colour token (`--depth-0` through `--depth-4`) so users can visually track nesting. `@dnd-kit`'s `SortableContext` wraps each group's children independently, so drag-and-drop reordering works at every nesting level without special handling.

---

## State management

### Store separation

State is split into four focused Zustand stores rather than one monolithic store:

| Store               | Responsibility                                | Persisted          |
| ------------------- | --------------------------------------------- | ------------------ |
| `query-store`       | Filter tree, active schema, undo/redo history | No                 |
| `history-store`     | Last 20 executed queries + named presets      | Yes (localStorage) |
| `custom-data-store` | User-imported datasets                        | No                 |
| `ui-store`          | Sidebar open, active tab, which modal is open | No                 |

Separating them means a component that only cares about whether the sidebar is open subscribes only to `ui-store` — it never re-renders when a query rule changes.

### Why Zustand over Redux

Redux requires actions, reducers, and a provider setup for every piece of state. Zustand is a plain object with methods — no boilerplate, no provider, same guarantees. The vanilla API (`useStore.getState()`) lets the query engine's `getSchema()` read custom datasets outside of React components without any hook workaround.

### Why Immer for undo/redo

Immer's `produceWithPatches` records the exact diff (forward patch + inverse patch) between any two state snapshots. Undo applies the inverse patch; redo reapplies the forward patch. This means the undo history stores only the _changes_, not full state copies — a 50-step history with 100 rules uses a fraction of the memory that snapshot-based undo would require.

### `useShallow` for object selectors

Zustand re-renders a component whenever the selected value changes by reference. When selecting an object, a naive selector triggers a re-render on every state change even if the selected subtree didn't change. `useShallow` does a shallow comparison of the object's keys instead of reference equality, preventing unnecessary renders in components that read slices of the tree.

---

## Query engine

### Design

The engine lives in `src/lib/query-engine/` and is entirely composed of pure functions — no side effects, no React, no DOM. Each generator takes a `Group` tree and a `Schema` and returns a query:

```ts
generateSQL(tree: Group, schema: Schema): string
generateMongo(tree: Group, schema: Schema): object
generateGraphQL(tree: Group, schema: Schema): string
```

### Tree walking

Each generator walks the tree recursively. A group node triggers a recursive call; a rule node generates a single condition fragment:

```text
root (AND)
├── clearanceLevel > 5              → "clearanceLevel > 5"
└── group (OR)                      → recurse
    ├── codename LIKE '%Project%'   → "codename LIKE '%Project%'"
    └── activeStatus = true         → "activeStatus = true"

Output: "clearanceLevel > 5 AND (codename LIKE '%Project%' OR activeStatus = true)"
```

Parentheses around nested groups are added automatically based on nesting depth, ensuring correct operator grouping without requiring the generator to reason about SQL precedence rules.

### Operator mapping

`operators.ts` defines which operators are valid for each field type:

```text
string  → equals, contains, starts_with, ends_with, regex, is_empty, is_null…
number  → equals, gt, gte, lt, lte, between, not_between, is_null…
date    → before, after, between, is_today, is_this_week, is_this_month…
enum    → equals, in, not_in, is_null…
boolean → is_true, is_false, is_null…
array   → contains, not_contains, is_empty…
```

`getOperatorsForType(fieldType)` drives the operator dropdown in `RuleOperator`. This ensures users never see "Is This Week" on a number field or "Greater Than" on a boolean.

### In-memory execution

`executor.ts` runs the filter tree against a JavaScript array in the browser. Each rule is evaluated as a predicate function against each row, with AND/OR logic applied as `&&` / `||`. There is no real database connection.

### Schema inference

`schema-inferrer.ts` analyses up to 100 sample rows to detect field types from imported data:

1. All values are booleans → `boolean`
2. All values are numbers → `number`
3. All values are arrays → `array`
4. All string values match ISO date format → `date`
5. All string values, ≤12 unique → `enum` (with `enumValues` list)
6. Otherwise → `string`

Null and empty values are excluded from the sample before inference so a sparsely-populated field is not incorrectly typed as `string`.

---

## Performance optimisations

### `React.memo` with custom comparator on `ConditionRule`

The query builder can render dozens of rule rows simultaneously. Without memoisation, typing a single character in one rule's value would re-render every other rule. `React.memo` prevents this, but the default shallow comparison fails because `dragListeners` and `dragAttributes` from `@dnd-kit` are recreated as new objects on every render.

The custom `areEqual` comparator skips those props entirely and only checks `rule.field`, `rule.operator`, `rule.value`, `rule.id`, and `error` — the five things that actually affect what the component renders.

### `useCallback` on rule handlers

Each handler (`handleFieldChange`, `handleOperatorChange`, etc.) is wrapped in `useCallback`. Without this, every render of `ConditionRule` would produce new function references, breaking the `React.memo` optimisation on the child inputs (`RuleField`, `RuleOperator`, `RuleValue`).

### `dynamic(() => import(...), { ssr: false })` for `ThemeToggle`

The theme value is unknown during server-side rendering — Next.js renders on the server before the browser's `localStorage` is readable. Loading `ThemeToggle` dynamically with `ssr: false` defers it to the client, preventing a hydration mismatch warning.

### Paginated results

`ResultsDrawer` never renders all matched rows at once. Results are sliced to the current page. This keeps the DOM manageable even when a query matches thousands of rows.

### Immer patch-based undo/redo

Stores diffs, not snapshots. Constant memory overhead per step regardless of tree size.

---

## Trade-offs

| Decision                             | Benefit                              | Cost                                                               |
| ------------------------------------ | ------------------------------------ | ------------------------------------------------------------------ |
| In-memory query execution            | Zero backend, works offline          | Limited to small datasets; no real DB semantics                    |
| Custom data not persisted            | No serialisation complexity          | Users must re-import after page refresh                            |
| Manual SQL/MongoDB/GraphQL tokeniser | No external parser dependency        | Doesn't cover full query language syntax (subqueries, JOINs, etc.) |
| Tailwind v4 CSS-first config         | Design tokens co-located with styles | Less community documentation; some IDE tooling lags behind         |
| `useShallow` on object selectors     | Prevents unnecessary re-renders      | Slightly more verbose selectors                                    |
| Flat `conditions` array in `Group`   | Simple tree structure                | Mixed `Rule \| Group` union requires type narrowing everywhere     |

---

## Getting started

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

---

## Available scripts

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # ESLint
pnpm test       # Vitest (watch mode)
pnpm test:run   # Vitest (single run)
```

---

## Project structure

```text
src/
├── app/
│   ├── page.tsx                  # Landing page (/)
│   ├── app/page.tsx              # Query builder (/app)
│   ├── docs/page.tsx             # Documentation (/docs)
│   ├── not-found.tsx             # 404 — SQL-themed "0 rows returned"
│   ├── layout.tsx                # Root layout + providers
│   └── globals.css               # Design tokens + base styles
│
├── components/
│   ├── landing/                  # Landing page sections
│   ├── query-builder/            # Filter tree components
│   ├── preview/                  # Query output panel
│   ├── results/                  # Results table + resizable drawer
│   ├── sidebar/                  # Schema selector, history, presets
│   ├── layout/                   # App shell, header, theme toggle
│   ├── inputs/                   # Type-specific value inputs
│   ├── modals/                   # Export, import, shortcuts, data import
│   └── shared/                   # Generic UI primitives
│
├── lib/
│   ├── query-engine/             # SQL/MongoDB/GraphQL generators, executor, schema inferrer
│   ├── schemas/                  # Field definitions for built-in schemas
│   └── mock-data/                # Seeded fake records
│
└── store/
    ├── query-store.ts            # Filter tree state (Zustand + Immer)
    ├── history-store.ts          # Query history + named presets
    ├── custom-data-store.ts      # User-imported datasets
    └── ui-store.ts               # Sidebar, modals, active tab
```

---

## Built-in schemas

| Schema    | Records | Field types                                |
| --------- | ------- | ------------------------------------------ |
| Agents    | 87      | string, enum, date, number, boolean, array |
| Cities    | 124     | string, number, enum, date, boolean, array |
| Incidents | 203     | enum, date, number, array, boolean         |

Custom schemas are inferred at import time — enums auto-detected under 12 unique values, arrays detected from JSON array values.

---

## Design system

CSS variable token system defined in `globals.css`. All colors, spacing, and shadows reference `var(--*)` tokens so dark/light theme switching is handled entirely at the `:root` / `[data-theme="light"]` level with no JavaScript involved at runtime.

Key tokens: `--bg-base`, `--bg-surface`, `--bg-elevated`, `--accent` (`#6E56CF`), `--accent-2` (`#00D2FF`), `--depth-0..4` (nesting level colours).
