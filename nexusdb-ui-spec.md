# NexusDB Explorer — Complete UI/UX Design Specification

> **Version:** 1.0.0
> **Project:** HNG14 Frontend Wizards — Stage 8
> **Type:** Visual Query Builder
> **Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui

---

## Table of Contents

1. [Product Vision & Identity](#1-product-vision--identity)
2. [Design Philosophy](#2-design-philosophy)
3. [Color System](#3-color-system)
4. [Typography System](#4-typography-system)
5. [Spacing & Sizing Scale](#5-spacing--sizing-scale)
6. [Layout Architecture](#6-layout-architecture)
7. [Component Specifications](#7-component-specifications)
   - 7.1 [Header](#71-header)
   - 7.2 [Sidebar](#72-sidebar)
   - 7.3 [Query Builder Panel](#73-query-builder-panel)
   - 7.4 [Condition Group](#74-condition-group)
   - 7.5 [Condition Rule](#75-condition-rule)
   - 7.6 [Preview Panel](#76-preview-panel)
   - 7.7 [Results Panel](#77-results-panel)
   - 7.8 [Query History](#78-query-history)
   - 7.9 [Saved Presets](#79-saved-presets)
   - 7.10 [Schema Selector](#710-schema-selector)
   - 7.11 [Keyboard Shortcut Modal](#711-keyboard-shortcut-modal)
   - 7.12 [Export / Import Modal](#712-export--import-modal)
   - 7.13 [Complexity Indicator](#713-complexity-indicator)
   - 7.14 [Validation Error Display](#714-validation-error-display)
8. [Schema-Driven Input Types](#8-schema-driven-input-types)
9. [Operator Definitions by Type](#9-operator-definitions-by-type)
10. [Motion & Animation System](#10-motion--animation-system)
11. [Drag-and-Drop Behaviour](#11-drag-and-drop-behaviour)
12. [Dark Mode / Light Mode / System Mode](#12-dark-mode--light-mode--system-mode)
13. [Responsive Behaviour](#13-responsive-behaviour)
14. [Iconography](#14-iconography)
15. [Accessibility Requirements](#15-accessibility-requirements)
16. [States Reference](#16-states-reference)
17. [Mock Schemas & Data](#17-mock-schemas--data)
18. [CSS Variables Reference](#18-css-variables-reference)
19. [Tailwind Config Extensions](#19-tailwind-config-extensions)
20. [File & Folder Structure (UI Layer)](#20-file--folder-structure-ui-layer)

---

## 1. Product Vision & Identity

### 1.1 Name & Tagline

- **Product name:** NexusDB Explorer
- **Tagline:** _"Query anything. Visually."_
- **Internal codename:** `nexusdb`

### 1.2 Concept

NexusDB Explorer is a **premium, developer-grade visual query builder**. It is not a dashboard. Not a SaaS marketing page. It is a **tool** — the kind a senior engineer would reach for when they need to construct complex, nested database filters without writing raw query syntax.

The reference point is: **Linear meets Raycast meets MongoDB Compass**. Every design decision should pass the filter: _"Would a senior engineer at Stripe or Vercel want to use this?"_

### 1.3 Fictional Universe

The app is framed as a data intelligence platform for a fictional multi-domain organization. The three available data sources are:

| Schema        | Theme              | Description                                                                  |
| ------------- | ------------------ | ---------------------------------------------------------------------------- |
| **Agents**    | 🛸 Intelligence    | A spy/covert-ops dataset. Codenames, clearance levels, mission counts.       |
| **Cities**    | 🌆 Urban Analytics | Global city data. Population, GDP, crime index, government type.             |
| **Incidents** | ⚡ Event Tracking  | System anomaly/event log. Severity, status, response time, affected systems. |

This theming gives the demo video cinematic weight and makes the app memorable in reviews.

---

## 2. Design Philosophy

### 2.1 Core Aesthetic Direction

**Dark-first, terminal-meets-design-system.**
The aesthetic lives between a premium developer tool and a sci-fi ops console. Think controlled darkness, sharp purple and cyan accents, JetBrains Mono for all code, and motion that is purposeful — never decorative for its own sake.

### 2.2 Key Principles

1. **Density without clutter.** A lot of information is on screen at once. Spacing, type hierarchy, and subtle borders keep it readable.
2. **Hierarchy through color.** Purple = primary action / AND logic. Cyan = live/active state / OR logic. Red = destructive / error. Green = success / matched. Amber = warning / deep nesting.
3. **Every interaction has feedback.** Nothing happens silently. Rules animate in. Groups collapse smoothly. Query execution pulses. The user always knows the system responded.
4. **The preview panel is always visible.** It is the "money shot" — the live SQL/Mongo/GraphQL output updating as conditions are added. Never hide it.
5. **Nesting is spatial, not just indented.** Depth is communicated through left border color, background elevation, and indentation. A user should be able to understand nesting depth at a glance.

### 2.3 What to Avoid

- Generic purple gradients on white backgrounds
- Cards with heavy drop shadows everywhere
- Tables with thick borders
- Flat, unstyled selects and inputs
- Icon buttons without tooltips
- Any element that appears without an enter transition

---

## 3. Color System

### 3.1 CSS Custom Properties

Define all colors as CSS custom properties on `:root` and override in `[data-theme="light"]`.

```css
:root {
  /* === BACKGROUNDS === */
  --bg-base: #0a0a0f; /* app background — near black, blue undertone */
  --bg-surface: #111118; /* panel backgrounds */
  --bg-elevated: #1a1a24; /* cards, dropdowns, popovers */
  --bg-overlay: #22222f; /* modal overlays, tooltips */
  --bg-hover: #1e1e2a; /* hover state on interactive items */
  --bg-active: #252535; /* pressed / active state */

  /* === BORDERS === */
  --border-subtle: #1e1e2c; /* very subtle dividers */
  --border-default: #2a2a38; /* standard borders */
  --border-strong: #3a3a4a; /* emphasized borders, focused inputs */
  --border-focus: #6e56cf; /* keyboard focus ring */

  /* === ACCENT — PRIMARY (PURPLE) === */
  --accent: #6e56cf; /* primary brand color */
  --accent-hover: #7c66d5; /* hover state */
  --accent-muted: #6e56cf26; /* 15% opacity — used for backgrounds */
  --accent-subtle: #6e56cf14; /* 8% opacity — used for very light tints */

  /* === ACCENT — SECONDARY (CYAN) === */
  --accent-2: #00d2ff; /* secondary accent — live states, OR logic */
  --accent-2-hover: #33dbff;
  --accent-2-muted: #00d2ff20;
  --accent-2-subtle: #00d2ff0f;

  /* === SEMANTIC COLORS === */
  --success: #23c55e; /* valid state, matched results, AND group border */
  --success-muted: #23c55e1a;
  --warning: #f59e0b; /* deep nesting indicator */
  --warning-muted: #f59e0b1a;
  --destructive: #ff4458; /* errors, remove buttons */
  --destructive-muted: #ff44581a;
  --info: #3b82f6; /* informational states */
  --info-muted: #3b82f61a;

  /* === TEXT === */
  --text-primary: #ededef; /* main text */
  --text-secondary: #a0a0aa; /* secondary labels */
  --text-muted: #70707a; /* placeholder text, disabled */
  --text-disabled: #484850; /* fully disabled */
  --text-inverse: #09090b; /* text on light surfaces */
  --text-accent: #9d87e0; /* text in purple context */
  --text-accent-2: #4de3ff; /* text in cyan context */

  /* === CODE / PREVIEW SURFACE === */
  --code-bg: #0d0d14; /* query preview background */
  --code-border: #1e1e2c;
  --code-text: #e4e4ef;
  --code-keyword: #c678dd; /* SQL keywords: SELECT, WHERE, AND */
  --code-string: #98c379; /* string values */
  --code-number: #e5c07b; /* numeric values */
  --code-operator: #56b6c2; /* operators: >, =, != */
  --code-field: #61afef; /* field names */
  --code-punctuation: #abb2bf; /* brackets, colons, commas */
  --code-comment: #5c6370;

  /* === NESTING DEPTH COLORS === */
  --depth-0: #6e56cf; /* root group — purple */
  --depth-1: #00d2ff; /* depth 1 — cyan */
  --depth-2: #23c55e; /* depth 2 — green */
  --depth-3: #f59e0b; /* depth 3 — amber */
  --depth-4plus: #ff4458; /* depth 4+ — red (warning: very deep) */

  /* === DRAG AND DROP === */
  --drag-handle: #3a3a4a;
  --drag-handle-hover: #6e56cf;
  --drop-indicator: #6e56cf;
  --drag-ghost-bg: #1a1a2480;
}
```

### 3.2 Light Theme Overrides

```css
[data-theme="light"] {
  --bg-base: #f8f8fc;
  --bg-surface: #ffffff;
  --bg-elevated: #f4f4f8;
  --bg-overlay: #ebebf2;
  --bg-hover: #f0f0f6;
  --bg-active: #e8e8f0;

  --border-subtle: #ebebf0;
  --border-default: #e4e4ec;
  --border-strong: #d0d0dc;
  --border-focus: #6e56cf;

  --text-primary: #09090b;
  --text-secondary: #52525b;
  --text-muted: #a1a1aa;
  --text-disabled: #d4d4d8;
  --text-inverse: #ededef;

  --code-bg: #1a1a24; /* code stays dark in light mode */
  --code-border: #2a2a38;
}
```

### 3.3 Nesting Depth Color Usage

The left border of each `ConditionGroup` gets a color based on its nesting depth. This is the single most important visual communicator of query structure.

| Depth | CSS Variable    | Hex       | Usage                                     |
| ----- | --------------- | --------- | ----------------------------------------- |
| 0     | `--depth-0`     | `#6E56CF` | Root group                                |
| 1     | `--depth-1`     | `#00D2FF` | First nested group                        |
| 2     | `--depth-2`     | `#23C55E` | Second nested group                       |
| 3     | `--depth-3`     | `#F59E0B` | Third nested group                        |
| 4+    | `--depth-4plus` | `#FF4458` | Very deep nesting — subtle warning signal |

Background tint behind each group uses 5% opacity of the same color:

```css
background: color-mix(in srgb, var(--depth-N) 5%, transparent);
```

---

## 4. Typography System

### 4.1 Font Stack

```css
/* UI — body copy, labels, inputs */
--font-sans: "Geist", "Inter", system-ui, sans-serif;

/* Code — query preview, JSON output, field paths */
--font-mono: "JetBrains Mono", "Fira Code", "Cascadia Code", monospace;

/* Display — app name, schema titles (optional, only in header/landing) */
--font-display: "Geist", sans-serif;
```

> **Note:** Use `next/font` to load Geist (Vercel's font, available via `geist` npm package) and JetBrains Mono. These load with zero layout shift.

```typescript
// app/layout.tsx
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
```

### 4.2 Type Scale

| Token       | Size | Line Height | Weight | Usage                               |
| ----------- | ---- | ----------- | ------ | ----------------------------------- |
| `text-2xs`  | 10px | 14px        | 400    | Timestamps, meta labels             |
| `text-xs`   | 11px | 16px        | 400    | Keyboard shortcut labels, tag chips |
| `text-sm`   | 12px | 18px        | 400    | Secondary body, helper text         |
| `text-base` | 13px | 20px        | 400    | Primary UI text, input values       |
| `text-md`   | 14px | 22px        | 400    | Panel headings, labels              |
| `text-lg`   | 16px | 24px        | 500    | Section titles                      |
| `text-xl`   | 20px | 28px        | 600    | Panel headers                       |
| `text-2xl`  | 24px | 32px        | 700    | App title                           |

> All font sizes use `px` to `rem` conversion via `calc()`. Base font size: 16px.

### 4.3 Font Weight Usage

- `400` — body text, input values, dropdown options
- `500` — labels, secondary headings, tab labels
- `600` — primary headings, button text, active states
- `700` — app title, schema name in header

### 4.4 Letter Spacing

- UI labels (uppercase): `tracking-widest` (0.1em)
- Normal UI: `tracking-normal`
- Code: `tracking-tight` (-0.02em, tighter for mono)

---

## 5. Spacing & Sizing Scale

### 5.1 Spacing Tokens (Tailwind extensions)

```javascript
// tailwind.config.ts — spacing
spacing: {
  '0.5': '2px',
  '1':   '4px',
  '1.5': '6px',
  '2':   '8px',
  '2.5': '10px',
  '3':   '12px',
  '3.5': '14px',
  '4':   '16px',
  '5':   '20px',
  '6':   '24px',
  '7':   '28px',
  '8':   '32px',
  '10':  '40px',
  '12':  '48px',
  '16':  '64px',
}
```

### 5.2 Component-level Spacing

| Element            | Padding       | Gap     |
| ------------------ | ------------- | ------- |
| Header             | `px-5 py-3`   | `gap-3` |
| Sidebar            | `px-3 py-4`   | `gap-1` |
| Query panel        | `p-4`         | `gap-3` |
| Condition rule     | `px-3 py-2`   | `gap-2` |
| Condition group    | `p-3`         | `gap-2` |
| Preview panel      | `p-4`         | `gap-3` |
| Results table cell | `px-3 py-2`   | —       |
| Button (sm)        | `px-2.5 py-1` | —       |
| Button (md)        | `px-3 py-1.5` | —       |
| Button (lg)        | `px-4 py-2`   | —       |

### 5.3 Border Radius

| Token          | Value  | Usage                          |
| -------------- | ------ | ------------------------------ |
| `rounded-sm`   | 4px    | Tags, chips, badges            |
| `rounded`      | 6px    | Inputs, selects, small buttons |
| `rounded-md`   | 8px    | Cards, panels, modals          |
| `rounded-lg`   | 12px   | Large panels, drawers          |
| `rounded-xl`   | 16px   | Schema selector cards          |
| `rounded-full` | 9999px | Toggle pills, avatar           |

---

## 6. Layout Architecture

### 6.1 Overall Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HEADER (56px)                               │
├──────────────┬──────────────────────────┬───────────────────────────┤
│              │                          │                           │
│   SIDEBAR    │    QUERY BUILDER PANEL   │     PREVIEW PANEL         │
│   (240px)    │    (flex: 1)             │     (360px)               │
│              │                          │                           │
│              │                          │                           │
│              │                          │                           │
│              │                          │                           │
│              │                          │                           │
│              │                          │                           │
├──────────────┴──────────────────────────┴───────────────────────────┤
│              RESULTS PANEL — BOTTOM DRAWER (collapsed: 40px)        │
│              (expanded: up to 40vh)                                 │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Layout Measurements

| Panel                      | Width / Height | Min   | Max   |
| -------------------------- | -------------- | ----- | ----- |
| Header                     | 100vw × 56px   | —     | —     |
| Sidebar                    | 240px (fixed)  | —     | —     |
| Query builder              | flexible       | 320px | —     |
| Preview panel              | 360px (fixed)  | 320px | 480px |
| Results drawer (collapsed) | 100% × 40px    | —     | —     |
| Results drawer (expanded)  | 100% × auto    | 200px | 40vh  |

### 6.3 Main Layout Grid

```css
.app-layout {
  display: grid;
  grid-template-rows: 56px 1fr auto; /* header / main / results */
  grid-template-columns: 240px 1fr 360px; /* sidebar / builder / preview */
  height: 100vh;
  overflow: hidden;
}

.main-content {
  grid-row: 2;
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 240px 1fr 360px;
  overflow: hidden;
}
```

### 6.4 Panel Scroll Behaviour

- **Sidebar:** `overflow-y: auto` with custom scrollbar (2px wide, `--border-strong` color)
- **Query builder:** `overflow-y: auto` — scrolls independently
- **Preview panel:** `overflow-y: auto` — code block scrolls
- **Header:** `overflow: hidden` — never scrolls
- **Results panel:** internal table scrolls, drawer height is fixed when expanded

### 6.5 Panel Separators

Separators between panels are 1px solid `--border-subtle`. No drop shadows between panels. The darkness of the surfaces creates implicit depth.

---

## 7. Component Specifications

### 7.1 Header

**Height:** 56px
**Background:** `--bg-surface`
**Bottom border:** 1px solid `--border-subtle`

#### Layout (left to right)

```
[Logo + Name]          [Schema Selector]     [Spacer]     [Run Query]  [Theme]  [?]
```

#### Logo Area (left)

- Logo: A small geometric hexagon icon in `--accent` color, SVG inline, 20×20px
- App name: "NexusDB" in `font-mono`, `text-lg`, `font-weight: 700`, `--text-primary`
- "Explorer" in `text-sm`, `--text-muted`, `font-weight: 400`, slightly offset below

#### Schema Selector (center-left)

- A segmented pill with three options: **Agents** · **Cities** · **Incidents**
- Active tab: `--bg-elevated` background, `--accent` left-dot indicator (4px circle), `--text-primary`
- Inactive tab: transparent, `--text-muted`
- Border: 1px solid `--border-default` around the entire pill
- Height: 32px, `rounded-full`, padding: `px-1`
- Each tab: `px-3 py-1`, `text-sm`, `rounded-full`
- Switching schema: smooth active indicator slide animation (150ms ease)

#### Run Query Button (right-of-center)

- Label: "Run Query" with a `▶` play icon prefix
- Style: Solid `--accent` background, `--text-inverse` text (light), `rounded-md`, height 32px, `px-4`
- Disabled state: `--bg-elevated` background, `--text-disabled`, not clickable, `cursor: not-allowed`
- Loading state: Spinner replaces icon, button text changes to "Running…"
- Active/pressed: scale down slightly (`scale: 0.97`), 100ms

#### Keyboard Shortcut Hint

- Below "Run Query" button: `Ctrl+↵` in a small `kbd`-styled chip, `text-2xs`, `--text-muted`

#### Theme Toggle (far right)

- Three-state: `☀️ Light` / `🌙 Dark` / `💻 System`
- Rendered as three small icon buttons in a row, `24×24px` each
- Active state: `--bg-elevated`, `--accent` icon color
- Inactive: transparent, `--text-muted`

#### Help Button (far right)

- `?` icon, 24×24px, `rounded-full`, `--text-muted`
- Hover: `--bg-hover`, `--text-primary`
- Click: opens Keyboard Shortcut Modal

---

### 7.2 Sidebar

**Width:** 240px
**Background:** `--bg-surface`
**Right border:** 1px solid `--border-subtle`
**Padding:** `px-3 py-4`

The sidebar has three collapsible sections with animated accordion.

#### Section Header Pattern

```
[▸] SECTION TITLE          [optional action button]
```

- Section label: `text-2xs`, `letter-spacing: 0.1em`, `text-transform: uppercase`, `--text-muted`
- Chevron: rotates 90° when expanded (200ms ease)
- Divider between sections: 1px solid `--border-subtle`, `my-3`

#### 7.2.1 Schema Section

Three schema cards stacked vertically, gap of 6px.

**Schema Card (inactive):**

- Background: `--bg-elevated`
- Border: 1px solid `--border-default`
- Border radius: `rounded-md`
- Padding: `px-3 py-2`
- Left side: emoji icon (16px) + schema name (`text-sm`, `--text-primary`, `font-weight: 500`)
- Right side: record count badge (e.g. "87 records"), `text-xs`, `--text-muted`, `rounded-sm` bg `--bg-overlay`
- Subtitle: field count, `text-xs`, `--text-muted` (e.g. "8 fields")

**Schema Card (active):**

- Background: `--accent-subtle`
- Border: 1px solid `--accent`
- Left accent bar: 3px solid `--accent` on the left edge (inside the border, using `before:` pseudo)
- Schema name: `--accent` color
- Transition: 150ms ease-in-out for all properties

**Hover (inactive card):**

- Background: `--bg-hover`
- Border: `--border-strong`

#### 7.2.2 Query History Section

List of last 20 executed queries, newest first. Each item:

**History Item:**

- Background: transparent
- Hover: `--bg-hover`, `rounded-md`
- Padding: `px-2 py-1.5`
- Layout:
  - Row 1: Timestamp (relative), `text-xs`, `--text-muted` (right-aligned) + condition count, `text-xs`, `--text-accent` (left)
  - Row 2: Query preview (truncated), `text-xs`, `--text-secondary`, `font-mono`, `truncate`
- Click: restores that query tree into the builder (with a brief flash animation on the builder)
- "Clear history" text button at bottom: `text-xs`, `--destructive`, appears only when history is non-empty

**Empty State (no history):**

- Centered: ghost icon + "No queries run yet", `text-xs`, `--text-muted`

#### 7.2.3 Saved Presets Section

**"Save Current" button at top:**

- Full width, dashed border, `--border-default`, `--text-muted`, `text-sm`, height 32px
- Hover: `--border-accent`, `--text-accent`, dashed border becomes solid
- Click: opens inline name input field (slides down with animation)

**Name Input (after clicking Save):**

- Full-width text input, `text-sm`, `--bg-elevated` background, `--border-default` border
- Placeholder: "Name this preset…"
- Right side: `✓` confirm button (`--accent`) and `✕` cancel (`--text-muted`)
- Enter key: confirms save

**Preset Item:**

- Same pattern as history items
- Row 1: Preset name, `text-sm`, `--text-primary`, `font-weight: 500`
- Row 2: Condition count + timestamp saved, `text-xs`, `--text-muted`
- Right side (visible on hover): `↺ Load` button (`--accent`, `text-xs`) and `✕` delete button (`--destructive`, `text-xs`)
- Load action: populates builder, closes any open dropdowns

---

### 7.3 Query Builder Panel

**Background:** `--bg-base`
**Padding:** `p-4`
**Overflow-y:** auto

#### Panel Header

```
Query Builder                          [⎌ Undo]  [⎌ Redo]  [Clear All]
```

- Title: `text-lg`, `--text-primary`, `font-weight: 600`
- Undo/Redo: icon-only buttons (24×24px), disabled when stack is empty, tooltip on hover
- "Clear All": text button, `text-sm`, `--destructive`, only visible when tree is non-empty

#### Complexity Score Banner

A thin horizontal bar directly below the header showing live complexity:

```
Complexity: ●●●○○  Moderate  ·  4 conditions  ·  2 groups  ·  max depth: 2
```

- Bar height: 28px, `--bg-surface`, `rounded-md`, `px-3`
- Dots: 5 circles, 8px each, filled = `--accent`, empty = `--border-default`
- Labels: `text-xs`, `--text-muted`
- Updates with 200ms debounce as tree changes

#### Root Group

The root `ConditionGroup` occupies the full width below the header. There is always exactly one root group — it cannot be deleted.

#### Bottom Action Row

Below the root group, two ghost buttons:

```
[+ Add Rule]    [+ Add Group]
```

Both are full-width on small screens, side by side on large screens.

- Style: `--bg-elevated` background, `--border-default` border, dashed, `rounded-md`, height 36px
- Hover: `--border-accent`, `--text-accent`, dashed becomes solid
- Icon: `+` prefix, `--accent` color
- These are shortcuts to the root group's "add" actions

---

### 7.4 Condition Group

This is the **most important** and **most complex** component. It renders recursively.

**Outer container:**

- Background: `color-mix(in srgb, var(--depth-N) 5%, transparent)` — very subtle depth tint
- Border: 1px solid `color-mix(in srgb, var(--depth-N) 20%, var(--border-subtle))`
- Border radius: `rounded-md`
- Left border: 3px solid `var(--depth-N)` — the visual nesting communicator
- Margin bottom: `8px` between siblings
- Inner padding: `p-3`

**Depth token resolution:**

```typescript
const DEPTH_COLORS = [
  "var(--depth-0)",
  "var(--depth-1)",
  "var(--depth-2)",
  "var(--depth-3)",
  "var(--depth-4plus)", // clamp at 4+
] as const;

function getDepthColor(depth: number): string {
  return DEPTH_COLORS[Math.min(depth, 4)];
}
```

#### Group Toolbar (top of each group)

```
[⠿ drag] [● AND ▸ OR toggle] [Group label: "Group A"] [collapse ⌄] [+ Rule] [+ Group] [✕]
```

**Logic Toggle Pill:**

- Container: `rounded-full`, `--bg-overlay`, border `--border-default`, height 28px
- Two options: "AND" and "OR"
- Active sliding indicator: `rounded-full`, `--accent` (for AND) or `--accent-2` (for OR), 150ms spring animation
- Text: `text-xs`, `font-weight: 600`, `letter-spacing: 0.05em`
- AND active: indicator is `--accent` (purple)
- OR active: indicator is `--accent-2` (cyan)

**Group Label:**

- Auto-assigned: "Group A", "Group B", etc. (alphabetical, depth-aware)
- `text-xs`, `--text-muted`, `font-style: italic`
- Not editable (keeps UI clean)

**Collapse Button:**

- Chevron icon, 20×20px, rotates 180° when collapsed (200ms ease)
- Tooltip: "Collapse group" / "Expand group"

**Add Rule / Add Group (inside toolbar):**

- Icon-only, 20×20px each
- Tooltip: "Add rule" / "Add nested group"
- `+` icon for rule, `⊞` (or similar) for group

**Remove Group Button:**

- `✕` icon, 20×20px, `--text-muted`
- Hover: `--destructive`, `--destructive-muted` background
- Disabled (not rendered) on the root group
- Tooltip: "Remove group"

**Drag Handle:**

- `⠿` (grip) icon, appears on hover of the group toolbar only
- Color: `--drag-handle`, hover: `--drag-handle-hover`
- Cursor: `grab`, active: `grabbing`

#### Group Body (below toolbar)

Animated container for child conditions. Children stack vertically with `gap-2`.

When **collapsed**: height animates to 0, opacity to 0, overflow hidden. The toolbar remains visible showing `[▸ collapsed · N conditions]`.

#### Group Footer

```
[+ Add Rule]    [+ Add Group]
```

- Always visible at the bottom of each group body
- Slightly smaller than the main panel's add buttons
- Style: dashed `--border-subtle`, `--text-muted`, `rounded-md`, height 30px
- Hover: `--border-accent`, `--text-accent`

---

### 7.5 Condition Rule

Each rule is a single horizontal row within a group.

**Container:**

- Background: `--bg-elevated`
- Border: 1px solid `--border-default`
- Border radius: `rounded-md`
- Padding: `px-3 py-2`
- Display: `flex`, `align-items: center`, `gap: 8px`

**Error State:**

- Border: 1px solid `--destructive`
- Background: `--destructive-muted`
- Error message appears below the row (see §7.14)

#### Rule Layout

```
[⠿] [Field ▾] [Operator ▾] [Value Input(s)] [✕]
```

**Drag Handle `[⠿]`:**

- 16×20px grip icon
- Hidden by default, appears on hover of the rule
- `--drag-handle` color, hover: `--drag-handle-hover`
- `cursor: grab`

**Field Selector:**

- Width: 160px fixed
- shadcn `<Combobox>` — searchable dropdown
- Trigger: `--bg-surface` background, `--border-default` border, height 30px, `rounded-md`, `text-sm`
- Dropdown: `--bg-elevated`, `--border-default`, `rounded-md`, max-height 240px, scrollable
- Each option shows: field icon (type-specific, see §8) + field name + type badge (`text-2xs`, `--text-muted`)
- Selected value: field icon + name
- Open state: border becomes `--accent`
- Placeholder: "Select field…", `--text-muted`

**Operator Selector:**

- Width: 140px fixed
- shadcn `<Select>` (not searchable — operators list is short)
- Same height/style as field selector
- Options filtered by field type (see §9)
- Placeholder: "Operator…", `--text-muted`
- Disabled until a field is selected (opacity 0.5, `cursor: not-allowed`)

**Value Input:**

- Width: `flex: 1` — fills remaining space
- Height: 30px
- Type varies based on field type (see §8)
- `--bg-surface` background, `--border-default` border, `rounded-md`, `text-sm`, `px-2`
- Focus: border `--border-focus`, `box-shadow: 0 0 0 2px var(--accent-muted)`
- Disabled: when operator is "is null" or "is not null" (value not needed — input hidden)
- Error: border `--destructive`, background `--destructive-muted`

**Remove Button `[✕]`:**

- 20×20px, `--text-muted`
- Hover: `--destructive`, `--destructive-muted` background, `rounded-sm`
- Tooltip: "Remove rule"
- Hidden by default, appears on hover of the rule
- Always visible if there's only one rule in the group (so user can still see the button)

---

### 7.6 Preview Panel

**Width:** 360px
**Background:** `--bg-surface`
**Left border:** 1px solid `--border-subtle`
**Padding:** `p-4`
**Overflow-y:** auto

#### Panel Header

```
Query Preview                    [↓ Export]  [⧉ Copy]
```

- Title: `text-lg`, `font-weight: 600`, `--text-primary`
- Export button: ghost, icon + label, `text-sm`, `--text-secondary`
- Copy button: ghost, icon only initially, expands to "Copied ✓" on click (1.5s then reverts)

#### Format Tabs

```
[ SQL ]  [ MongoDB ]  [ GraphQL ]
```

- Container: full width, `--bg-elevated`, `rounded-md`, `p-1`, flex row
- Each tab: `rounded-sm`, `text-sm`, height 28px, `px-3`
- Active: `--bg-surface`, `--text-primary`, subtle `box-shadow: 0 1px 2px rgba(0,0,0,0.3)`
- Inactive: transparent, `--text-muted`
- Switching: no animation (instant), just active state update

#### Code Block

Below the tabs, a code display area:

- Background: `--code-bg` (`#0D0D14`)
- Border: 1px solid `--code-border`
- Border radius: `rounded-md`
- Padding: `p-4`
- Font: `font-mono`, `text-sm`, `leading-6`
- Overflow: auto (scrollable if content is long)
- Min height: 200px
- Syntax highlighting classes (applied to spans within the code):

```css
.code-keyword {
  color: var(--code-keyword);
}
.code-field {
  color: var(--code-field);
}
.code-operator {
  color: var(--code-operator);
}
.code-string {
  color: var(--code-string);
}
.code-number {
  color: var(--code-number);
}
.code-punctuation {
  color: var(--code-punctuation);
}
.code-comment {
  color: var(--code-comment);
  font-style: italic;
}
```

**Empty state (no conditions):**

```
-- No conditions added yet
-- Add rules above to generate a query
```

Color: `--code-comment`

**Update behaviour:** Debounced 100ms after any tree change. A very subtle fade transition (opacity 0.6 → 1, 150ms) signals an update happened.

#### Query Example — SQL

```sql
SELECT *
FROM agents
WHERE
  (
    clearanceLevel = 'LEVEL_5'
    AND missionsCompleted > 10
  )
  OR
  (
    status = 'active'
    AND lastSeen > '2024-01-01'
  )
```

#### Query Example — MongoDB

```json
{
  "$or": [
    {
      "clearanceLevel": { "$eq": "LEVEL_5" },
      "missionsCompleted": { "$gt": 10 }
    },
    {
      "status": { "$eq": "active" },
      "lastSeen": { "$gt": "2024-01-01T00:00:00.000Z" }
    }
  ]
}
```

#### Query Example — GraphQL

```graphql
query FilterAgents {
  agents(
    where: {
      _or: [
        { clearanceLevel: { _eq: "LEVEL_5" }, missionsCompleted: { _gt: 10 } }
        { status: { _eq: "active" }, lastSeen: { _gt: "2024-01-01" } }
      ]
    }
  ) {
    codename
    clearanceLevel
    missionsCompleted
    status
    lastSeen
  }
}
```

#### Complexity Indicator (below code block)

```
Complexity  ●●●○○  Moderate     3 nesting levels  ·  6 conditions
```

- Dots: 5 circles, 8px each. Filled based on score 1–5:
  - 1: `--success`
  - 2: `--success`
  - 3: `--warning`
  - 4: `--destructive`
  - 5: `--destructive`
- Label: `text-xs`, `--text-muted`
- Complexity score calculated by: `(conditionCount × 1) + (groupCount × 2) + (maxDepth × 3)`

---

### 7.7 Results Panel

A **bottom drawer** that slides up from the bottom of the viewport when a query is executed.

**Collapsed state:**

- Height: 40px
- Background: `--bg-surface`
- Top border: 1px solid `--border-subtle`
- Shows: "Results" label + "Run a query to see results" placeholder (if never run) OR last result count
- Expand button: `⌃` chevron on the right, 20×20px

**Expanded state:**

- Height: `clamp(200px, 35vh, 400px)`, resizable by drag on the top edge
- Transition: `height` 300ms cubic-bezier(0.4, 0, 0.2, 1)

#### Results Panel Header

```
Results  ·  12 matched  ·  from 87 records  [↑ collapse]  [Sort by ▾]  [↓ Export CSV]
```

- "12 matched" in `--success` color
- "from 87 records" in `--text-muted`
- All `text-sm`

#### Loading State

When query is executing (simulated 600ms delay):

- Replace table with: centered spinner (20px, `--accent` color, CSS `border` spinner animation)
- Text below: "Executing query…" `text-sm`, `--text-muted`
- "Run Query" button shows spinner + "Running…"

#### Results Table

```
┌──────────────────────────────────────────────────────────────────────┐
│  codename ↑   clearanceLevel   lastSeen     status    missions       │
├──────────────────────────────────────────────────────────────────────┤
│  Ghost        LEVEL 5          Jan 12 2024  active    47             │
│  Cipher       LEVEL 3          Nov 8 2023   inactive  23             │
└──────────────────────────────────────────────────────────────────────┘
```

**Table styles:**

- Full width, `table-fixed`
- Background: `--bg-surface`
- Header row: `--bg-elevated`, `text-xs`, `letter-spacing: 0.05em`, `--text-muted`, height 32px
- Header cell: `px-3 py-2`, `text-left`, `font-weight: 500`
- Sortable column header: cursor pointer, hover: `--text-primary`, sort arrow icon
- Active sorted column: `--accent` arrow, `--text-accent` label
- Data row: height 36px, border-bottom `--border-subtle`
- Row hover: `--bg-hover`
- Data cell: `px-3 py-2`, `text-sm`, `--text-primary`
- Boolean values: colored pill badge (true = `--success-muted` bg + `--success` text, false = `--destructive-muted` + `--destructive`)
- Enum values: `--bg-elevated` chip, `--text-secondary`
- Date values: formatted as "MMM DD YYYY", `font-mono`, `text-xs`
- Number values: `font-mono`, `text-sm`

**No results (empty) state:**

```
(centered in the table area)
  🔍
  No records matched
  Try adjusting your conditions
```

Icon: 32px. Title: `text-md`, `font-weight: 500`, `--text-primary`. Subtitle: `text-sm`, `--text-muted`.

#### Pagination

```
← Previous    Page 1 of 3    Next →         10 per page ▾
```

- Position: bottom of the results panel, always visible
- Background: `--bg-elevated`, height 36px, `px-4`
- "Page X of Y": `text-sm`, `--text-secondary`
- Prev/Next buttons: disabled styling when at limits
- Per-page select: 10 / 25 / 50 options

---

### 7.8 Query History

Already covered in §7.2.2. Additional behaviour:

- History is stored in Zustand (persist to `localStorage` via `zustand/middleware`)
- Max 20 entries; oldest is removed when limit exceeded
- Each entry stores: `id`, `tree` (full query tree snapshot), `schema`, `timestamp`, `conditionCount`, `resultCount`
- Hovering a history item shows a mini tooltip preview of the condition count and schema

---

### 7.9 Saved Presets

Already covered in §7.2.3. Additional behaviour:

- Presets are stored in `localStorage` via Zustand persist
- Max 50 presets
- Presets store: `id`, `name`, `tree`, `schema`, `createdAt`, `format` (last active preview tab)
- Loading a preset: full tree replacement, schema switch if different, format tab switch
- Duplicate name detection: shows inline warning "A preset with this name already exists"

---

### 7.10 Schema Selector

The schema selector exists in two places:

1. **Header** — the primary selector (always visible)
2. **Sidebar** — the schema cards (visual alternative)

Both are synchronized. Switching either one updates the other.

**Switching schema behaviour:**

1. If current query tree is non-empty: show confirmation toast — "Switching schema will clear your current query. Continue?" with "Switch" and "Cancel" actions.
2. If confirmed (or tree is empty): clear the tree, set new schema, reset results.
3. The toast auto-dismisses in 4s with a progress bar.

**Toast component:**

- Position: top-right, 16px from edges
- Background: `--bg-elevated`
- Border: 1px solid `--border-default`
- Border radius: `rounded-md`
- Padding: `p-3`
- Progress bar: `--accent` color, 4px height at bottom, animates from full width to 0
- Stacks if multiple toasts

---

### 7.11 Keyboard Shortcut Modal

Triggered by pressing `?` or clicking the `?` header button.

**Modal backdrop:** `rgba(0, 0, 0, 0.7)`, blur `4px`
**Modal size:** 480px wide, auto height, centered
**Background:** `--bg-elevated`
**Border:** 1px solid `--border-default`
**Border radius:** `rounded-lg`
**Padding:** `p-6`

**Header:** "Keyboard Shortcuts" `text-xl`, `font-weight: 600`
Close button: `✕` top right.

**Shortcut table layout:**

```
QUERY BUILDING
Ctrl + Enter         Run query
Ctrl + Z             Undo
Ctrl + Shift + Z     Redo
Ctrl + D             Duplicate focused rule
Ctrl + G             Wrap selection in group
Escape               Collapse focused group

INTERFACE
?                    Toggle this modal
Ctrl + /             Focus field selector
Ctrl + S             Save as preset
Ctrl + E             Export query JSON
Ctrl + I             Import query JSON
Tab                  Navigate between rules
```

**Shortcut item layout:**

- Two columns: action label (left, `--text-primary`, `text-sm`) + key combo (right, `font-mono`)
- Key combo: each key in a `<kbd>` element — `--bg-overlay`, `--border-strong` 1px border, `rounded-sm`, `px-1.5 py-0.5`, `text-xs`
- `+` between keys: `--text-muted`
- Section label: `text-2xs`, `letter-spacing: 0.1em`, uppercase, `--text-muted`, `mb-2 mt-4`

**Animation:**

- Enter: fade in (opacity 0→1) + scale up (0.95→1), 200ms
- Exit: reverse, 150ms

---

### 7.12 Export / Import Modal

**Export (triggered by Export button in preview panel or Ctrl+E):**

```
Export Query
─────────────────────────────────────────
Export the current query as a JSON file
that can be imported later.

{
  "schema": "agents",
  "tree": { ... },
  "format": "SQL",
  "version": "1.0",
  "exportedAt": "2025-..."
}

[ Download JSON ]     [ Copy to Clipboard ]
```

- Code preview: same style as preview panel code block, max 200px height, scrollable
- Filename auto-generated: `nexusdb-query-{schema}-{timestamp}.json`

**Import (triggered by Import button or Ctrl+I):**

```
Import Query
─────────────────────────────────────────
Drop a JSON file here or paste query JSON

[  Drop file here or click to browse  ]

— or —

[ Paste JSON textarea ]

Validation: ✓ Valid query structure
            ✓ Schema: agents
            ✓ 4 conditions, 2 groups

[ Import Query ]
```

- File drop zone: dashed border `--border-default`, hover: `--border-accent`, `rounded-md`, 100px height
- Textarea: 120px height, `font-mono`, `text-xs`
- Real-time validation: debounced 300ms
- Valid: green checkmarks with details
- Invalid: red `✗` with specific error message ("Invalid group structure at path: root.conditions[0]")
- Import button: disabled until valid

---

### 7.13 Complexity Indicator

Appears in two places: the query builder panel header and below the preview code block.

**Score calculation algorithm:**

```typescript
function calculateComplexity(group: Group): ComplexityScore {
  const conditionCount = countConditions(group); // leaf rules
  const groupCount = countGroups(group); // nested groups
  const maxDepth = getMaxDepth(group); // deepest nesting level
  const operatorScore = scoreOperators(group); // regex/between = +1 each

  const raw =
    conditionCount * 1 + groupCount * 2 + maxDepth * 3 + operatorScore;
  const score = Math.min(Math.ceil(raw / 5), 5); // normalized 1–5

  return {
    score,
    label: ["Simple", "Low", "Moderate", "High", "Very High"][score - 1],
    conditionCount,
    groupCount,
    maxDepth,
  };
}
```

**Dot indicator:**

```tsx
// 5 dots, filled based on score
{
  [1, 2, 3, 4, 5].map((i) => (
    <Circle
      key={i}
      filled={i <= score}
      color={
        score <= 2
          ? "var(--success)"
          : score === 3
            ? "var(--warning)"
            : "var(--destructive)"
      }
    />
  ));
}
```

---

### 7.14 Validation Error Display

Each `ConditionRule` can display an error below it.

**Error container:**

- Appears below the rule row, slides down with animation (200ms)
- Background: `--destructive-muted`
- Border-left: 2px solid `--destructive`
- Border-radius: `0 0 6px 6px` (bottom corners only, connects to rule above)
- Padding: `px-3 py-1.5`
- Font: `text-xs`, `--destructive`, `font-weight: 500`

**Error messages:**

| Condition                 | Error Message                                                   |
| ------------------------- | --------------------------------------------------------------- |
| Field not selected        | "Select a field to continue"                                    |
| Operator not selected     | "Select an operator"                                            |
| Value empty               | "A value is required"                                           |
| `contains` on number/date | "Operator 'contains' is only valid for text fields"             |
| `regex` on non-string     | "Regex is only valid for text fields"                           |
| `between` with one value  | "Both values are required for 'between'"                        |
| `between` with min > max  | "First value must be less than second"                          |
| `in array` with no items  | "Add at least one value"                                        |
| Invalid date format       | "Enter a valid date"                                            |
| Invalid number            | "Enter a valid number"                                          |
| Empty nested group        | "This group has no conditions. Add a rule or remove the group." |

**Group-level errors** appear inside the group body above the footer buttons.

---

## 8. Schema-Driven Input Types

The value input in each `ConditionRule` adapts based on the selected field's type.

### 8.1 Input Type Map

| Field Type | Input Component              | Details                                                                      |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------- |
| `string`   | Text input                   | Standard `<input type="text">`, `text-sm`                                    |
| `number`   | Number input                 | `<input type="number">`, shows `min`/`max` if schema defines them            |
| `enum`     | Combobox (searchable select) | Options from `schema.enumValues`, searchable                                 |
| `boolean`  | Toggle switch                | shadcn `<Switch>`, shows "true" / "false" label next to it                   |
| `date`     | Date picker                  | shadcn `<Calendar>` popover via `react-day-picker`, formats to ISO           |
| `array`    | Tag input                    | Chip/tag input — type value + Enter or comma to add, `✕` to remove each chip |

### 8.2 Operator `between` Special Case

When the operator is `between`, the value input splits into **two inputs** side by side:

```
[ Min value ]  —  [ Max value ]
```

- Both required for validation to pass
- For dates: two date pickers
- For numbers: two number inputs
- Min must be less than Max (validated client-side)

### 8.3 Operator `in array` Special Case

When the operator is `in array` or `not in array`, the value input becomes a **tag input**:

- Placeholder: "Type value, press Enter…"
- Each added value renders as a chip: `--bg-elevated`, `--border-default`, `rounded-sm`, `text-xs`, `px-1.5 py-0.5` + `✕` remove
- Minimum 1 chip required for validation

### 8.4 Operator `is null` / `is not null` Special Case

Value input is hidden entirely. The rule row becomes:

```
[⠿] [Field ▾] [is null ▾]                                      [✕]
```

No value input rendered.

### 8.5 Field Type Icons

Each field type gets a small icon (12×12px) displayed in the field selector dropdown and the active field display:

| Type      | Icon             | Color          |
| --------- | ---------------- | -------------- |
| `string`  | `Aa` (text icon) | `--text-muted` |
| `number`  | `#` (hash)       | `--accent-2`   |
| `enum`    | `≡` (list)       | `--warning`    |
| `boolean` | `⏻` (toggle)     | `--success`    |
| `date`    | `📅` (calendar)  | `--info`       |
| `array`   | `[]` (brackets)  | `--accent`     |

---

## 9. Operator Definitions by Type

### 9.1 String Operators

| Operator Label   | Internal Value | Notes                          |
| ---------------- | -------------- | ------------------------------ |
| Equals           | `eq`           | Case-sensitive                 |
| Not Equals       | `neq`          |                                |
| Contains         | `contains`     | Substring match                |
| Does Not Contain | `not_contains` |                                |
| Starts With      | `starts_with`  |                                |
| Ends With        | `ends_with`    |                                |
| Is Empty         | `is_empty`     | No value input                 |
| Is Not Empty     | `is_not_empty` | No value input                 |
| Is Null          | `is_null`      | No value input                 |
| Is Not Null      | `is_not_null`  | No value input                 |
| Matches Regex    | `regex`        | Value input shows regex helper |

### 9.2 Number Operators

| Operator Label        | Internal Value | Notes          |
| --------------------- | -------------- | -------------- |
| Equals                | `eq`           |                |
| Not Equals            | `neq`          |                |
| Greater Than          | `gt`           |                |
| Greater Than or Equal | `gte`          |                |
| Less Than             | `lt`           |                |
| Less Than or Equal    | `lte`          |                |
| Between               | `between`      | Two inputs     |
| Not Between           | `not_between`  | Two inputs     |
| Is Null               | `is_null`      | No value input |
| Is Not Null           | `is_not_null`  | No value input |

### 9.3 Enum Operators

| Operator Label | Internal Value | Notes          |
| -------------- | -------------- | -------------- |
| Equals         | `eq`           | Combobox input |
| Not Equals     | `neq`          | Combobox input |
| In             | `in`           | Tag input      |
| Not In         | `not_in`       | Tag input      |
| Is Null        | `is_null`      | No value input |
| Is Not Null    | `is_not_null`  | No value input |

### 9.4 Boolean Operators

| Operator Label | Internal Value | Notes                       |
| -------------- | -------------- | --------------------------- |
| Is True        | `is_true`      | Toggle switch, forced true  |
| Is False       | `is_false`     | Toggle switch, forced false |
| Is Null        | `is_null`      | No value input              |
| Is Not Null    | `is_not_null`  | No value input              |

### 9.5 Date Operators

| Operator Label | Internal Value  | Notes            |
| -------------- | --------------- | ---------------- |
| Equals         | `eq`            | Date picker      |
| Not Equals     | `neq`           | Date picker      |
| Before         | `before`        | Date picker      |
| After          | `after`         | Date picker      |
| Between        | `between`       | Two date pickers |
| Is Today       | `is_today`      | No value input   |
| Is This Week   | `is_this_week`  | No value input   |
| Is This Month  | `is_this_month` | No value input   |
| Is Null        | `is_null`       | No value input   |
| Is Not Null    | `is_not_null`   | No value input   |

### 9.6 Array Operators

| Operator Label   | Internal Value       | Notes              |
| ---------------- | -------------------- | ------------------ |
| Contains         | `array_contains`     | Single value input |
| Does Not Contain | `array_not_contains` | Single value input |
| Is Empty         | `array_is_empty`     | No value input     |
| Is Not Empty     | `array_is_not_empty` | No value input     |
| Is Null          | `is_null`            | No value input     |
| Is Not Null      | `is_not_null`        | No value input     |

---

## 10. Motion & Animation System

All animations use **Framer Motion** (`motion` from `framer-motion`). CSS-only fallbacks exist for reduced-motion preference.

### 10.1 Global Animation Tokens

```typescript
export const ANIMATION = {
  // Durations
  fast: 0.1, // 100ms — micro feedback (button press, active state)
  normal: 0.2, // 200ms — most UI transitions
  medium: 0.3, // 300ms — panel open/close, drawer
  slow: 0.5, // 500ms — loading, page-level transitions

  // Easings
  ease: [0.4, 0, 0.2, 1], // standard ease
  spring: { type: "spring", stiffness: 400, damping: 30 },
  bounce: { type: "spring", stiffness: 600, damping: 20 },
} as const;
```

### 10.2 Component-Level Animations

#### Rule Enter/Exit

```typescript
const ruleVariants = {
  hidden: { opacity: 0, height: 0, y: -8 },
  visible: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -4,
    transition: { duration: 0.15, ease: [0.4, 0, 1, 1] },
  },
};
```

Use `<AnimatePresence>` with `mode="popLayout"` around the condition list.

#### Group Enter/Exit

Same pattern as rule, but `y: -12` and `duration: 0.25`.

#### Group Collapse / Expand

```typescript
const groupBodyVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
};
```

Chevron rotation: `rotate: collapsed ? 0 : 180`, `transition: { duration: 0.2 }`.

#### Logic Toggle (AND/OR pill)

The sliding indicator uses a `layoutId` for shared layout animation:

```tsx
<motion.div
  layoutId={`logic-indicator-${groupId}`}
  className="absolute inset-y-0 rounded-full"
  style={{ background: logic === "AND" ? "var(--accent)" : "var(--accent-2)" }}
  transition={{ type: "spring", stiffness: 500, damping: 35 }}
/>
```

#### Results Drawer Slide Up

```typescript
const drawerVariants = {
  collapsed: {
    height: "40px",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  expanded: {
    height: "35vh",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};
```

#### Results Row Stagger (on new results)

```typescript
const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.15 },
  }),
};
```

Max stagger for 10 rows = 300ms total. Rows beyond 10 appear instantly.

#### Query Execution Button Pulse

When "Run Query" is clicked:

```typescript
// Button scales down, then bounces back
animate={{ scale: [1, 0.95, 1] }}
transition={{ duration: 0.1 }}
```

#### Preview Code Block Update Flash

When query preview updates (debounced):

```typescript
animate={{ opacity: [0.5, 1] }}
transition={{ duration: 0.15 }}
```

#### Validation Error Slide Down

```typescript
const errorVariants = {
  hidden: { opacity: 0, height: 0, y: -4 },
  visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.1 } },
};
```

#### Copy to Clipboard Button

```typescript
// Text changes: "Copy" → "Copied ✓" → "Copy"
// 150ms transition, hold for 1500ms, then revert
```

#### Schema Selector Slide Indicator

Logic toggle pill pattern with `layoutId="schema-active-indicator"`.

### 10.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

All Framer Motion components should check `useReducedMotion()` and skip animations when true.

---

## 11. Drag-and-Drop Behaviour

Using **@dnd-kit/core** and **@dnd-kit/sortable**.

### 11.1 What Is Draggable

1. **Condition Rules** — can be reordered within the same group
2. **Condition Groups** — can be reordered within the same parent group
3. **Cross-group drag** — a rule CAN be dragged from one group into another group (drop on group body)

### 11.2 Drag Handle

- The `⠿` grip icon is the **only** drag trigger (not the whole row)
- This prevents accidental drags when clicking inputs
- `cursor: grab` on handle, `cursor: grabbing` while dragging

### 11.3 Drag Visual States

**Dragged item:**

```css
opacity: 0.4;
background: var(--drag-ghost-bg);
border: 1px dashed var(--accent);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
transform: scale(1.02);
```

**Drop indicator (between items):**

- A 2px horizontal line in `--drop-indicator` color
- Appears between items when dragging over the gap
- Animated: fades in (100ms) when active

**Valid drop target (group body when dragging a rule):**

```css
background: var(--accent-subtle);
border: 1px dashed var(--accent);
```

**Invalid drop target:**

- No visual change (dropping on a rule that isn't a group target)

### 11.4 DnD State Updates

On drag end:

1. If same group, same type: reorder within group
2. If different group, rule dragged onto group: append rule to target group
3. If different group, rule dragged between rules of another group: insert at that position
4. Always update Zustand store with `immer` — produces a new state snapshot for undo/redo

### 11.5 Accessibility (DnD)

- All draggable items have `aria-grabbed` attribute
- Keyboard alternative: arrow buttons appear on focus (Up/Down for reordering)
- Screen reader announcement: "Moved {field name} rule to position {N} in {group name}"

---

## 12. Dark Mode / Light Mode / System Mode

Using **next-themes** package.

### 12.1 Theme Provider Setup

```tsx
// app/layout.tsx
import { ThemeProvider } from "next-themes";

<ThemeProvider
  attribute="data-theme"
  defaultTheme="dark"
  themes={["light", "dark", "system"]}
  enableSystem
>
  {children}
</ThemeProvider>;
```

### 12.2 CSS Class Application

`next-themes` applies `data-theme="light"` or `data-theme="dark"` to `<html>`. All color CSS variables are defined on `:root` (dark) and overridden in `[data-theme="light"]`.

### 12.3 Theme Persistence

Stored in `localStorage` under key `nexusdb-theme`. Survives page refresh.

### 12.4 Theme Toggle UI

Three icon buttons in the header (see §7.1). Icons:

- Light: Sun icon (`lucide-react`: `Sun`)
- Dark: Moon icon (`lucide-react`: `Moon`)
- System: Monitor icon (`lucide-react`: `Monitor`)

Transition when switching: the entire page background transitions at `background-color 200ms ease`. No flash.

---

## 13. Responsive Behaviour

### 13.1 Breakpoints

| Breakpoint | Width           | Layout                                                              |
| ---------- | --------------- | ------------------------------------------------------------------- |
| `sm`       | < 640px         | Mobile: single column                                               |
| `md`       | 640px – 1024px  | Tablet: sidebar hidden, builder full width, preview as bottom sheet |
| `lg`       | 1024px – 1280px | Desktop: sidebar + builder + preview (compact)                      |
| `xl`       | > 1280px        | Desktop: full three-column (default layout)                         |

### 13.2 Mobile Layout (< 640px)

- Header: Logo + Theme toggle only. Schema selector moves to a bottom sheet triggered by a button.
- Sidebar: Hidden. Accessible via a `☰ Menu` button in header → slides in as a drawer from left.
- Query builder: Full width.
- Preview panel: Hidden by default. Accessible via a "Preview" tab button above the builder.
- Results: Full-height sheet.

### 13.3 Tablet Layout (640px – 1024px)

- Sidebar: Collapsed to icon-only rail (48px wide). Hover or click expands it over content.
- Query builder: Full remaining width.
- Preview panel: Collapsible bottom panel (toggleable by button).

### 13.4 Scrolling

All panels scroll independently. Never allow body scroll — all content within its respective panel's scroll container.

---

## 14. Iconography

All icons from **lucide-react**. Size: 12–16px for inline, 20px for toolbar, 24px for header.

| Icon Name           | Usage                          |
| ------------------- | ------------------------------ |
| `GripVertical`      | Drag handle                    |
| `X`                 | Remove rule/group, close modal |
| `Plus`              | Add rule, add group            |
| `ChevronDown`       | Collapse group, dropdown       |
| `ChevronRight`      | Expand group                   |
| `Copy`              | Copy to clipboard              |
| `Download`          | Export                         |
| `Upload`            | Import                         |
| `Play`              | Run query                      |
| `Undo2`             | Undo                           |
| `Redo2`             | Redo                           |
| `History`           | Query history                  |
| `Bookmark`          | Saved presets                  |
| `Database`          | Schema section                 |
| `Sun`               | Light mode                     |
| `Moon`              | Dark mode                      |
| `Monitor`           | System mode                    |
| `Keyboard`          | Shortcuts modal                |
| `Trash2`            | Delete preset                  |
| `RotateCcw`         | Load preset / restore          |
| `CheckCircle2`      | Valid state                    |
| `AlertCircle`       | Error state                    |
| `Search`            | Combobox search                |
| `SlidersHorizontal` | Filter/complexity              |
| `Braces`            | MongoDB format                 |
| `Code2`             | GraphQL format                 |
| `Table2`            | SQL format                     |

---

## 15. Accessibility Requirements

### 15.1 Keyboard Navigation

- All interactive elements reachable via `Tab`
- Logical tab order: Header → Sidebar → Builder → Preview → Results
- Within a group: Tab cycles through rules, then group toolbar buttons
- `Escape`: closes any open dropdown/popover
- `Enter`/`Space`: activates buttons, selects dropdown options
- `Arrow keys`: navigate within dropdowns

### 15.2 Focus Styles

```css
*:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
  border-radius: 4px;
}
```

Never `outline: none` without a replacement.

### 15.3 ARIA Attributes

- All icon-only buttons: `aria-label="Description"`
- Tooltips: `role="tooltip"` with `aria-describedby`
- Logic toggle: `role="radiogroup"`, each option `role="radio"`, `aria-checked`
- Draggable items: `aria-grabbed`, `aria-roledescription="Draggable condition"`
- Results table: `role="table"`, sortable headers have `aria-sort="ascending"` / `"descending"`
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Error messages: `role="alert"`, `aria-live="polite"`
- Loading state: `aria-busy="true"` on results container

### 15.4 Color Contrast

All text/background combinations meet WCAG AA (4.5:1 for normal text, 3:1 for large text).

| Foreground                              | Background               | Ratio    |
| --------------------------------------- | ------------------------ | -------- |
| `--text-primary` (#EDEDEF)              | `--bg-surface` (#111118) | ~14:1 ✓  |
| `--text-muted` (#70707A)                | `--bg-surface` (#111118) | ~4.6:1 ✓ |
| `--accent` (#6E56CF) on `--bg-elevated` |                          | ~4.5:1 ✓ |

---

## 16. States Reference

### 16.1 Rule States

| State         | Description                | Visual                                                   |
| ------------- | -------------------------- | -------------------------------------------------------- |
| `default`     | No interaction             | Standard border                                          |
| `hover`       | Mouse over rule            | Drag handle + remove button appear, slightly elevated bg |
| `focused`     | Keyboard focus             | `--border-focus` on focused input                        |
| `error`       | Validation failed          | Red border + error message below                         |
| `dragging`    | Being dragged              | Semi-transparent, scale 1.02, dashed border              |
| `drop-target` | Another item dragging over | Drop indicator line                                      |

### 16.2 Group States

| State         | Description             | Visual                            |
| ------------- | ----------------------- | --------------------------------- |
| `default`     | Standard                | Depth-colored left border         |
| `hover`       | Mouse over              | Toolbar actions fully visible     |
| `collapsed`   | Body hidden             | Body height 0, chevron rotated    |
| `dragging`    | Group being dragged     | Same as rule dragging             |
| `drop-target` | Rule being dragged over | `--accent-subtle` background tint |
| `error`       | Empty group             | Red border, error in footer       |

### 16.3 Button States

| State              | Visual                                |
| ------------------ | ------------------------------------- |
| `default`          | Standard bg + text                    |
| `hover`            | Slightly lighter bg or accent border  |
| `active` (pressed) | `scale: 0.97`, 100ms                  |
| `focus`            | `outline: 2px solid --border-focus`   |
| `disabled`         | `opacity: 0.4`, `cursor: not-allowed` |
| `loading`          | Spinner replaces icon, text changes   |

### 16.4 Input States

| State      | Visual                                                            |
| ---------- | ----------------------------------------------------------------- |
| `default`  | `--bg-surface` bg, `--border-default` border                      |
| `hover`    | `--border-strong` border                                          |
| `focused`  | `--border-focus` border, `--accent-muted` box-shadow              |
| `error`    | `--destructive` border, `--destructive-muted` bg                  |
| `disabled` | `--bg-elevated` bg, `--text-disabled` text, `cursor: not-allowed` |
| `readonly` | Same as disabled visually                                         |

---

## 17. Mock Schemas & Data

### 17.1 Agents Schema

```typescript
export const agentsSchema: Schema = {
  id: "agents",
  name: "Agents",
  emoji: "🛸",
  description: "Covert intelligence operatives",
  recordCount: 87,
  fields: [
    { name: "codename", type: "string", label: "Codename" },
    {
      name: "clearanceLevel",
      type: "enum",
      label: "Clearance Level",
      enumValues: ["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4", "LEVEL_5"],
    },
    { name: "lastSeen", type: "date", label: "Last Seen" },
    {
      name: "missionsCompleted",
      type: "number",
      label: "Missions Completed",
      min: 0,
      max: 200,
    },
    {
      name: "status",
      type: "enum",
      label: "Status",
      enumValues: ["active", "inactive", "compromised", "retired"],
    },
    {
      name: "region",
      type: "enum",
      label: "Region",
      enumValues: ["EMEA", "APAC", "Americas", "MENA", "Global"],
    },
    { name: "compromised", type: "boolean", label: "Compromised" },
    {
      name: "specialization",
      type: "enum",
      label: "Specialization",
      enumValues: [
        "Infiltration",
        "Surveillance",
        "Combat",
        "Cyber",
        "Extraction",
        "Analysis",
      ],
    },
    { name: "languages", type: "array", label: "Languages" },
  ],
};
```

### 17.2 Cities Schema

```typescript
export const citiesSchema: Schema = {
  id: "cities",
  name: "Cities",
  emoji: "🌆",
  description: "Global urban analytics data",
  recordCount: 124,
  fields: [
    { name: "name", type: "string", label: "City Name" },
    { name: "country", type: "string", label: "Country" },
    { name: "population", type: "number", label: "Population", min: 0 },
    {
      name: "crimeIndex",
      type: "number",
      label: "Crime Index",
      min: 0,
      max: 100,
    },
    { name: "founded", type: "date", label: "Founded" },
    {
      name: "governmentType",
      type: "enum",
      label: "Government Type",
      enumValues: [
        "Democracy",
        "Republic",
        "Monarchy",
        "Federation",
        "City-State",
        "Autonomous",
      ],
    },
    {
      name: "gdpPerCapita",
      type: "number",
      label: "GDP Per Capita (USD)",
      min: 0,
    },
    { name: "timezone", type: "string", label: "Timezone" },
    { name: "isCapital", type: "boolean", label: "Is Capital" },
    { name: "officialLanguages", type: "array", label: "Official Languages" },
  ],
};
```

### 17.3 Incidents Schema

```typescript
export const incidentsSchema: Schema = {
  id: "incidents",
  name: "Incidents",
  emoji: "⚡",
  description: "System anomaly and event log",
  recordCount: 203,
  fields: [
    { name: "title", type: "string", label: "Title" },
    {
      name: "severity",
      type: "enum",
      label: "Severity",
      enumValues: ["critical", "high", "medium", "low", "info"],
    },
    { name: "reportedAt", type: "date", label: "Reported At" },
    { name: "resolvedAt", type: "date", label: "Resolved At" },
    { name: "affectedSystems", type: "array", label: "Affected Systems" },
    { name: "reporter", type: "string", label: "Reporter" },
    {
      name: "status",
      type: "enum",
      label: "Status",
      enumValues: ["open", "investigating", "resolved", "closed", "wontfix"],
    },
    {
      name: "responseTime",
      type: "number",
      label: "Response Time (mins)",
      min: 0,
    },
    { name: "isEscalated", type: "boolean", label: "Escalated" },
  ],
};
```

### 17.4 Mock Data Generation

Each schema has ~80–200 records generated via a seeded random function (so results are consistent across runs). The seed ensures the same query always returns the same results — important for the demo video.

```typescript
// lib/mock-data/seed.ts
import { createSeededRandom } from "./seeded-random";

export function generateAgents(count = 87): Agent[] {
  const rng = createSeededRandom(42); // fixed seed
  return Array.from({ length: count }, (_, i) => ({
    id: `agent-${i + 1}`,
    codename: CODENAMES[i % CODENAMES.length],
    clearanceLevel: LEVELS[Math.floor(rng() * LEVELS.length)],
    // ...
  }));
}
```

Sample codenames: Ghost, Cipher, Viper, Shadow, Raven, Phantom, Eclipse, Talon, Ember, Mirage, Spectre, Wraith, Dagger, Onyx, Cobalt, Zephyr, Vector, Nexus, Axiom, Prism, Flux, Volt, Helix, Quartz, Nova…

---

## 18. CSS Variables Reference

Complete listing — all variables defined in `src/app/globals.css`:

```css
/* Full reference — see §3.1 and §3.2 for definitions */

/* Background layer */
--bg-base, --bg-surface, --bg-elevated, --bg-overlay, --bg-hover, --bg-active

/* Borders */
--border-subtle, --border-default, --border-strong, --border-focus

/* Accent purple */
--accent, --accent-hover, --accent-muted, --accent-subtle

/* Accent cyan */
--accent-2, --accent-2-hover, --accent-2-muted, --accent-2-subtle

/* Semantic */
--success, --success-muted
--warning, --warning-muted
--destructive, --destructive-muted
--info, --info-muted

/* Text */
--text-primary, --text-secondary, --text-muted, --text-disabled,
--text-inverse, --text-accent, --text-accent-2

/* Code surface */
--code-bg, --code-border, --code-text,
--code-keyword, --code-string, --code-number,
--code-operator, --code-field, --code-punctuation, --code-comment

/* Nesting depths */
--depth-0, --depth-1, --depth-2, --depth-3, --depth-4plus

/* Drag and drop */
--drag-handle, --drag-handle-hover, --drop-indicator, --drag-ghost-bg
```

---

## 19. Tailwind Config Extensions

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "var(--bg-base)",
          surface: "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
          overlay: "var(--bg-overlay)",
          hover: "var(--bg-hover)",
          active: "var(--bg-active)",
        },
        border: {
          subtle: "var(--border-subtle)",
          default: "var(--border-default)",
          strong: "var(--border-strong)",
          focus: "var(--border-focus)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          muted: "var(--accent-muted)",
          subtle: "var(--accent-subtle)",
          "2": "var(--accent-2)",
          "2-hover": "var(--accent-2-hover)",
          "2-muted": "var(--accent-2-muted)",
          "2-subtle": "var(--accent-2-subtle)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          disabled: "var(--text-disabled)",
          inverse: "var(--text-inverse)",
          accent: "var(--text-accent)",
          "accent-2": "var(--text-accent-2)",
        },
        success: { DEFAULT: "var(--success)", muted: "var(--success-muted)" },
        warning: { DEFAULT: "var(--warning)", muted: "var(--warning-muted)" },
        destructive: {
          DEFAULT: "var(--destructive)",
          muted: "var(--destructive-muted)",
        },
        info: { DEFAULT: "var(--info)", muted: "var(--info-muted)" },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        xs: ["11px", { lineHeight: "16px" }],
        sm: ["12px", { lineHeight: "18px" }],
        base: ["13px", { lineHeight: "20px" }],
        md: ["14px", { lineHeight: "22px" }],
        lg: ["16px", { lineHeight: "24px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        focus: "0 0 0 2px var(--accent-muted)",
        card: "0 1px 4px rgba(0,0,0,0.4)",
        modal: "0 8px 40px rgba(0,0,0,0.6)",
        drag: "0 8px 24px rgba(0,0,0,0.5)",
      },
      animation: {
        "spin-slow": "spin 1.5s linear infinite",
        "pulse-accent": "pulse-accent 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.2s ease forwards",
      },
      keyframes: {
        "pulse-accent": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

## 20. File & Folder Structure (UI Layer)

```
src/
├── app/
│   ├── layout.tsx                    # ThemeProvider, fonts, metadata
│   ├── page.tsx                      # Root page — renders AppLayout
│   ├── globals.css                   # CSS variables, base styles, scrollbar
│   └── favicon.ico
│
├── components/
│   │
│   ├── layout/
│   │   ├── AppLayout.tsx             # Three-column grid shell
│   │   ├── Header.tsx                # Logo, schema selector, run, theme, help
│   │   └── ResizablePanel.tsx        # Generic resizable panel wrapper
│   │
│   ├── query-builder/
│   │   ├── QueryBuilder.tsx          # Root — renders root ConditionGroup
│   │   ├── ConditionGroup.tsx        # Recursive — renders group + children
│   │   ├── ConditionRule.tsx         # Leaf rule row
│   │   ├── GroupToolbar.tsx          # AND/OR toggle, collapse, add, remove
│   │   ├── RuleField.tsx             # Field selector (Combobox)
│   │   ├── RuleOperator.tsx          # Operator selector (Select)
│   │   ├── RuleValue.tsx             # Dynamic value input switcher
│   │   ├── DragHandle.tsx            # Grip icon with dnd-kit integration
│   │   ├── LogicToggle.tsx           # AND/OR pill with sliding indicator
│   │   ├── AddRuleButton.tsx         # Dashed add button
│   │   ├── AddGroupButton.tsx        # Dashed add group button
│   │   └── ComplexityBanner.tsx      # Live complexity score row
│   │
│   ├── inputs/
│   │   ├── TextInput.tsx             # Standard text input
│   │   ├── NumberInput.tsx           # Number input with min/max
│   │   ├── DateInput.tsx             # Date picker popover
│   │   ├── DateRangeInput.tsx        # Two date pickers (for 'between')
│   │   ├── NumberRangeInput.tsx      # Two number inputs (for 'between')
│   │   ├── EnumSelect.tsx            # Combobox for enum fields
│   │   ├── BooleanToggle.tsx         # Switch for boolean fields
│   │   ├── TagInput.tsx              # Chip/tag input for arrays / 'in' operator
│   │   └── RegexInput.tsx            # Text input with regex validation helper
│   │
│   ├── preview/
│   │   ├── PreviewPanel.tsx          # Panel shell, tabs, header
│   │   ├── CodeBlock.tsx             # Syntax-highlighted code display
│   │   ├── SQLPreview.tsx            # SQL generator → CodeBlock
│   │   ├── MongoPreview.tsx          # Mongo generator → CodeBlock
│   │   ├── GraphQLPreview.tsx        # GraphQL generator → CodeBlock
│   │   └── ComplexityIndicator.tsx   # 5-dot score component
│   │
│   ├── results/
│   │   ├── ResultsDrawer.tsx         # Slide-up drawer shell
│   │   ├── ResultsTable.tsx          # Data table with sort
│   │   ├── ResultsHeader.tsx         # Match count, export, collapse
│   │   ├── ResultsPagination.tsx     # Page controls
│   │   ├── ResultsEmptyState.tsx     # No results illustration
│   │   └── ResultsLoadingState.tsx   # Spinner during execution
│   │
│   ├── sidebar/
│   │   ├── Sidebar.tsx               # Sidebar shell with sections
│   │   ├── SidebarSection.tsx        # Collapsible section with header
│   │   ├── SchemaCard.tsx            # Individual schema selector card
│   │   ├── HistoryItem.tsx           # Single history entry
│   │   ├── PresetItem.tsx            # Single preset entry
│   │   └── SavePresetInput.tsx       # Inline save preset input
│   │
│   ├── modals/
│   │   ├── KeyboardShortcutModal.tsx # Full shortcut reference
│   │   └── ExportImportModal.tsx     # Export JSON / Import JSON
│   │
│   ├── shared/
│   │   ├── Toast.tsx                 # Toast notification
│   │   ├── ToastContainer.tsx        # Stacked toasts, top-right
│   │   ├── Tooltip.tsx               # Hover tooltip wrapper
│   │   ├── IconButton.tsx            # Reusable icon-only button
│   │   ├── Badge.tsx                 # Small status/count badge
│   │   ├── Kbd.tsx                   # Keyboard key display
│   │   ├── EmptyState.tsx            # Generic empty state component
│   │   └── Spinner.tsx               # CSS border spinner
│   │
│   └── ui/                           # shadcn/ui auto-generated components
│       ├── button.tsx
│       ├── command.tsx
│       ├── popover.tsx
│       ├── select.tsx
│       ├── switch.tsx
│       ├── calendar.tsx
│       ├── dialog.tsx
│       └── ...
│
├── hooks/
│   ├── useQueryTree.ts               # Selector hooks for Zustand query store
│   ├── useKeyboardShortcuts.ts       # Global keyboard shortcut registration
│   ├── useQueryExecution.ts          # Run query, loading state, results
│   ├── useDragAndDrop.ts             # dnd-kit setup and handlers
│   ├── useClipboard.ts               # Copy to clipboard + state
│   ├── useReducedMotion.ts           # Framer Motion reduced motion check
│   └── useDebounce.ts                # Generic debounce hook
│
├── lib/
│   ├── query-engine/
│   │   ├── types.ts                  # Rule, Group, Schema, Field, Operator types
│   │   ├── generators/
│   │   │   ├── sql.ts                # generateSQL(group, schema): string
│   │   │   ├── mongo.ts              # generateMongo(group, schema): object
│   │   │   └── graphql.ts            # generateGraphQL(group, schema): string
│   │   ├── validator.ts              # validateTree(group, schema): ValidationResult
│   │   ├── executor.ts               # executeQuery(group, schema, data[]): T[]
│   │   └── complexity.ts             # calculateComplexity(group): ComplexityScore
│   │
│   ├── schemas/
│   │   ├── index.ts                  # Schema registry
│   │   ├── agents.ts
│   │   ├── cities.ts
│   │   └── incidents.ts
│   │
│   ├── mock-data/
│   │   ├── seeded-random.ts          # Deterministic RNG
│   │   ├── agents.ts                 # 87 generated agent records
│   │   ├── cities.ts                 # 124 generated city records
│   │   └── incidents.ts              # 203 generated incident records
│   │
│   └── utils.ts                      # generateId(), formatDate(), truncate(), etc.
│
├── store/
│   ├── query-store.ts                # Tree state, mutations, undo/redo
│   ├── ui-store.ts                   # Sidebar state, panels, active format tab
│   └── history-store.ts              # Query run history, presets
│
└── __tests__/
    ├── query-engine/
    │   ├── sql.test.ts
    │   ├── mongo.test.ts
    │   ├── graphql.test.ts
    │   ├── validator.test.ts
    │   └── executor.test.ts
    ├── store/
    │   └── query-store.test.ts
    └── components/
        ├── ConditionGroup.test.tsx
        └── ConditionRule.test.tsx
```

---

_End of NexusDB Explorer UI/UX Design Specification v1.0.0_

> This document is the single source of truth for all visual and interaction design decisions. Any implementation detail not covered here should default to the design philosophy in §2: **developer-tool premium, dark-first, purposeful motion, density without clutter.**

---

## 21. PR Roadmap

### 21.1 Git Workflow Rules

- **Never push directly to `main`**
- **Never implement the entire project in a single commit**
- Every feature lives on its own branch
- All branches merge into `main` via Pull Request
- Minimum **9 meaningful PRs** (exceeds the 7 required)
- Each PR must have a descriptive title and body

### 21.2 Branch Naming Convention

```
type/short-description

Types:
  setup/    — project scaffolding, config
  feat/     — new feature
  fix/      — bug fix
  test/     — tests only
  docs/     — documentation only
  perf/     — performance improvement
  refactor/ — code restructure, no behaviour change
  style/    — visual/CSS only
```

### 21.3 Commit Message Convention

Follow **Conventional Commits**:

```
type(scope): short description

body (optional — explain WHY, not WHAT)

Examples:
feat(query-store): add recursive group mutation with immer
fix(validator): prevent between operator with single value
test(sql-generator): add nested AND/OR edge case coverage
perf(condition-group): memoize depth color computation
style(rule): show drag handle only on hover
docs(readme): add recursive rendering strategy section
```

### 21.4 PR Title & Description Format

```markdown
## PR Title

feat(scope): Short description of what this PR does

## PR Description Template

### What

One paragraph — what was built or changed.

### Why

One paragraph — why this was needed.

### How

Bullet list of key implementation decisions.

### Screenshots / Demo

Attach screenshots or a short screen recording for UI PRs.

### Checklist

- [ ] No console errors
- [ ] TypeScript — zero `any` types
- [ ] All new components have correct ARIA attributes
- [ ] Tested manually in both dark and light mode
- [ ] Unit tests added/updated where applicable
```

---

### 21.5 PR Breakdown

#### PR 1 — `setup/init`

**Title:** `setup: initialize Next.js project with full tooling configuration`

**Scope:**

- Next.js 14 App Router, TypeScript strict mode
- Tailwind CSS v3 + config extensions (all tokens from §19)
- shadcn/ui init + install all required components: Button, Command, Popover, Select, Switch, Calendar, Dialog, Separator
- Geist + JetBrains Mono via `next/font`
- Zustand install
- Framer Motion install
- dnd-kit install (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`)
- Vitest + React Testing Library + jsdom config
- next-themes install
- lucide-react install
- ESLint + Prettier config
- `globals.css` — all CSS variables (§18), base resets, custom scrollbar
- Folder structure created (all directories, `index.ts` barrel files)
- `README.md` skeleton with section headings

**Commits:**

```
setup: initialize Next.js 14 with TypeScript strict mode
setup(tailwind): add full design token extensions
setup(shadcn): install and configure component library
setup(fonts): add Geist and JetBrains Mono via next/font
setup(css): add full CSS variable system for dark/light themes
setup(vitest): configure test environment with RTL and jsdom
setup(deps): install zustand, framer-motion, dnd-kit, lucide-react
setup(structure): scaffold full folder structure with barrel files
```

---

#### PR 2 — `feat/query-store`

**Title:** `feat(store): implement Zustand query tree with full mutation API and undo/redo`

**Scope:**

- All TypeScript types: `FieldType`, `Operator`, `Rule`, `Group`, `Schema`, `QueryTree`, `ValidationResult`, `ComplexityScore` (see §22)
- `store/query-store.ts` — full implementation:
  - `addRule(groupId)`
  - `removeRule(groupId, ruleId)`
  - `updateRule(groupId, ruleId, patch)`
  - `addGroup(parentGroupId)`
  - `removeGroup(parentGroupId, groupId)`
  - `updateGroupLogic(groupId, logic)`
  - `moveRule(fromGroupId, toGroupId, ruleId, targetIndex)`
  - `reorderGroup(parentGroupId, groupId, targetIndex)`
  - `clearTree()`
  - `replaceTree(tree)`
  - `undo()`
  - `redo()`
- `store/ui-store.ts` — sidebar state, active format tab, collapsed groups map, results drawer state
- `store/history-store.ts` — query run history array, saved presets array, localStorage persist
- Unit tests for all store mutations (§23)

**Commits:**

```
feat(types): define complete query tree TypeScript type system
feat(query-store): implement recursive group mutation functions
feat(query-store): add immer-powered undo/redo with patch history
feat(ui-store): implement sidebar and panel state management
feat(history-store): add query history and preset management with persistence
test(query-store): add unit tests for all tree mutations
test(query-store): add undo/redo edge case coverage
```

---

#### PR 3 — `feat/recursive-ui`

**Title:** `feat(builder): implement recursive ConditionGroup and ConditionRule components`

**Scope:**

- `AppLayout.tsx` — three-column grid shell
- `Header.tsx` — logo, schema selector pill, run query button, theme toggle, help button
- `Sidebar.tsx` + `SidebarSection.tsx` — collapsible sections with accordion
- `QueryBuilder.tsx` — root panel, complexity banner, undo/redo buttons
- `ConditionGroup.tsx` — **recursive** — renders GroupToolbar + child rules/groups + GroupFooter
- `ConditionRule.tsx` — field/operator/value row (value input is placeholder for now)
- `GroupToolbar.tsx` — AND/OR LogicToggle, collapse, add rule, add group, remove
- `LogicToggle.tsx` — animated pill with Framer Motion layoutId
- `AddRuleButton.tsx` + `AddGroupButton.tsx` — dashed ghost buttons
- `DragHandle.tsx` — grip icon, hover-only visibility
- `ComplexityBanner.tsx` — live score row
- All enter/exit animations via Framer Motion AnimatePresence
- Depth color system applied via `getDepthColor(depth)`
- Collapsible group animation
- Component tests for recursive rendering (§23)

**Commits:**

```
feat(layout): implement three-column app shell with grid
feat(header): build header with schema selector and controls
feat(sidebar): implement collapsible sidebar with section accordion
feat(condition-group): implement recursive group component with depth colors
feat(condition-rule): implement rule row with placeholder value input
feat(logic-toggle): add animated AND/OR pill with spring transition
feat(animations): add Framer Motion enter/exit for rules and groups
feat(collapse): implement group collapse with height animation
test(condition-group): add recursive rendering tests
```

---

#### PR 4 — `feat/schema-engine`

**Title:** `feat(schema): implement schema-driven input system with all field types`

**Scope:**

- `lib/schemas/agents.ts`, `cities.ts`, `incidents.ts` — full schema definitions (§17)
- `lib/schemas/index.ts` — schema registry
- `lib/mock-data/` — seeded random generator + all three datasets (87/124/203 records)
- `SchemaCard.tsx` — sidebar schema cards with active state
- `SchemaSelector.tsx` — header pill (synchronized with sidebar)
- Schema switching with confirmation toast
- `RuleField.tsx` — Combobox with field type icons, type badges
- `RuleOperator.tsx` — Select filtered by field type (operator map from §9)
- `RuleValue.tsx` — dynamic switcher: renders correct input based on field type
- All input components: `TextInput`, `NumberInput`, `DateInput`, `DateRangeInput`, `NumberRangeInput`, `EnumSelect`, `BooleanToggle`, `TagInput`, `RegexInput`
- `Toast.tsx` + `ToastContainer.tsx` — schema switch confirmation
- Operator filtering logic: `getOperatorsForType(fieldType): Operator[]`
- Value input hiding for `is_null` / `is_not_null`
- Split inputs for `between`
- Tag input for `in` / `not_in`

**Commits:**

```
feat(schemas): define agents, cities, incidents schemas with full field types
feat(mock-data): generate seeded deterministic datasets for all schemas
feat(schema-selector): implement synchronized schema switcher in header and sidebar
feat(rule-field): build searchable combobox with field type icons
feat(rule-operator): implement operator select filtered by field type
feat(inputs): add text, number, date, enum, boolean, tag, regex input components
feat(rule-value): implement dynamic value input switcher
feat(toast): add toast notification system for schema switching
```

---

#### PR 5 — `feat/query-generators`

**Title:** `feat(preview): implement SQL, MongoDB, and GraphQL query generators with live preview`

**Scope:**

- `lib/query-engine/generators/sql.ts` — full recursive SQL generator
- `lib/query-engine/generators/mongo.ts` — full recursive Mongo generator
- `lib/query-engine/generators/graphql.ts` — full recursive GraphQL generator
- `lib/query-engine/complexity.ts` — complexity score algorithm
- `PreviewPanel.tsx` — panel shell with format tabs, header, export, copy
- `CodeBlock.tsx` — syntax-highlighted display (manual span-based highlighting, no external highlighter dep)
- `SQLPreview.tsx`, `MongoPreview.tsx`, `GraphQLPreview.tsx` — format-specific wrappers
- `ComplexityIndicator.tsx` — 5-dot component
- Copy to clipboard with animated checkmark feedback
- Live update with 100ms debounce + fade transition
- Unit tests for all three generators (§23)

**Commits:**

```
feat(sql-generator): implement recursive SQL query generator
feat(mongo-generator): implement recursive MongoDB query object generator
feat(graphql-generator): implement recursive GraphQL filter generator
feat(complexity): implement query complexity scoring algorithm
feat(preview-panel): build preview panel with format tabs and code display
feat(code-block): implement syntax highlighting with CSS color tokens
feat(copy): add clipboard copy with animated feedback
test(generators): add unit tests for SQL, Mongo, GraphQL generators
test(generators): add nested logic and edge case coverage
```

---

#### PR 6 — `feat/validation`

**Title:** `feat(validation): implement full query validation engine with inline error display`

**Scope:**

- `lib/query-engine/validator.ts` — full validation algorithm (all rules from §7.14)
- `ValidationError.tsx` — animated error display below rule
- Validation runs on every tree change (debounced 200ms)
- "Run Query" button disabled when `!isValid`
- Error state applied to rule container (red border, red background)
- Group-level empty group error
- Operator/type incompatibility checks
- `between` min > max check
- `in array` empty check
- All error messages from the table in §7.14
- Unit tests for validator (§23)

**Commits:**

```
feat(validator): implement recursive query tree validation engine
feat(validator): add operator-type compatibility checks
feat(validator): add between, in-array, empty group validations
feat(validation-ui): add animated inline error display per rule
feat(validation-ui): disable run button and show group errors
test(validator): add unit tests for all validation rules
test(validator): add edge cases for nested group validation
```

---

#### PR 7 — `feat/execution-simulator`

**Title:** `feat(results): implement query execution simulator with results table, pagination, and sorting`

**Scope:**

- `lib/query-engine/executor.ts` — recursive filter engine against mock data
- `ResultsDrawer.tsx` — slide-up drawer with Framer Motion
- `ResultsHeader.tsx` — match count, record count, collapse button, export CSV
- `ResultsTable.tsx` — sortable table with type-aware cell rendering
- `ResultsPagination.tsx` — page controls with per-page select
- `ResultsLoadingState.tsx` — spinner with 600ms simulated delay
- `ResultsEmptyState.tsx` — no results illustration
- `useQueryExecution.ts` — hook managing execution state, loading, results, pagination
- Staggered row enter animation
- Column sort state (asc/desc/none)
- Export results as CSV
- Unit tests for executor (§23)

**Commits:**

```
feat(executor): implement recursive query executor against mock datasets
feat(results-drawer): build slide-up results drawer with animation
feat(results-table): implement sortable table with type-aware cell rendering
feat(results-pagination): add page controls and per-page selection
feat(results-states): add loading spinner and empty state components
feat(execution-hook): implement useQueryExecution with simulated delay
feat(export-csv): add CSV export for query results
test(executor): add unit tests for filter logic across all operators
```

---

#### PR 8 — `feat/advanced-interactions`

**Title:** `feat(interactions): implement drag-and-drop, keyboard shortcuts, history, presets, and export/import`

**Scope:**

- `useDragAndDrop.ts` — dnd-kit SortableContext setup for rules and groups
- Drag handles connected to dnd-kit
- Cross-group rule dragging
- Drop indicator line between items
- `useKeyboardShortcuts.ts` — global shortcut registration:
  - `Ctrl+Enter` → run query
  - `Ctrl+Z` → undo
  - `Ctrl+Shift+Z` → redo
  - `Ctrl+D` → duplicate rule
  - `Ctrl+G` → wrap in group
  - `Ctrl+S` → save preset
  - `Ctrl+E` → export
  - `Ctrl+I` → import
  - `?` → toggle shortcuts modal
  - `Escape` → collapse focused group
- `KeyboardShortcutModal.tsx` — full shortcut reference modal
- `ExportImportModal.tsx` — export JSON download, import with validation
- `HistoryItem.tsx` — restore from history
- `PresetItem.tsx` — load/delete preset
- `SavePresetInput.tsx` — inline save with name input
- Query diff view (compare current vs last preset)

**Commits:**

```
feat(dnd): implement drag-and-drop for rules with dnd-kit SortableContext
feat(dnd): add cross-group rule dragging and drop indicator
feat(dnd): add group-level drag and reorder
feat(keyboard): implement global keyboard shortcut system
feat(shortcuts-modal): build keyboard shortcut reference modal
feat(export): implement query JSON export and file download
feat(import): implement query JSON import with validation
feat(history): connect history items to restore functionality
feat(presets): implement save, load, delete preset with named input
```

---

#### PR 9 — `feat/polish`

**Title:** `feat(polish): dark/light/system theme, responsive layout, performance optimizations, and README`

**Scope:**

- `next-themes` ThemeProvider wired up
- Theme toggle connected in header
- Light mode CSS variable overrides verified across all components
- Responsive layout — mobile drawer sidebar, tablet collapsed rail (§13)
- Custom scrollbar styles
- All `React.memo` / `useMemo` / `useCallback` optimizations (§25)
- Stable keys audit across all lists
- Final accessibility pass — ARIA audit, focus styles, `useReducedMotion` applied
- No console errors or TypeScript warnings
- Complete `README.md` (§24)
- Demo video preparation checklist

**Commits:**

```
feat(theme): wire next-themes provider and theme toggle
style(light-mode): verify and fix all components in light theme
feat(responsive): implement mobile sidebar drawer and tablet collapsed rail
perf: add React.memo to ConditionGroup, ConditionRule, CodeBlock
perf: memoize query generators and validator with useMemo
perf: add stable keys and component isolation to condition lists
a11y: audit and fix ARIA attributes across all interactive components
a11y: apply useReducedMotion to all Framer Motion animations
docs(readme): write complete README with architecture documentation
fix: resolve all TypeScript errors and console warnings
```

---

### 21.6 PR Merge Order

```
PR1 (setup) → PR2 (store) → PR3 (recursive UI) → PR4 (schema engine)
→ PR5 (generators) → PR6 (validation) → PR7 (execution)
→ PR8 (advanced interactions) → PR9 (polish)
```

Each PR depends on the previous. Never open a PR whose base branch isn't merged yet.

---

## 22. State Management Architecture

### 22.1 Core Type Definitions

```typescript
// lib/query-engine/types.ts

export type FieldType =
  | "string"
  | "number"
  | "enum"
  | "boolean"
  | "date"
  | "array";

export type LogicOperator = "AND" | "OR";

export type OperatorValue =
  | "eq"
  | "neq"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "not_between"
  | "in"
  | "not_in"
  | "is_null"
  | "is_not_null"
  | "is_empty"
  | "is_not_empty"
  | "is_true"
  | "is_false"
  | "regex"
  | "before"
  | "after"
  | "is_today"
  | "is_this_week"
  | "is_this_month"
  | "array_contains"
  | "array_not_contains"
  | "array_is_empty"
  | "array_is_not_empty";

export interface Rule {
  id: string;
  type: "rule";
  field: string | null; // null = not selected yet
  operator: OperatorValue | null;
  value: RuleValue; // see below
}

export type RuleValue =
  | string
  | number
  | boolean
  | string[] // for 'in', 'not_in', array operators
  | [string, string] // for 'between' (dates)
  | [number, number] // for 'between' (numbers)
  | null; // for 'is_null', 'is_not_null', etc.

export interface Group {
  id: string;
  type: "group";
  logic: LogicOperator;
  conditions: Condition[];
}

export type Condition = Rule | Group;

export interface SchemaField {
  name: string;
  type: FieldType;
  label: string;
  enumValues?: string[];
  min?: number;
  max?: number;
}

export interface Schema {
  id: string;
  name: string;
  emoji: string;
  description: string;
  recordCount: number;
  fields: SchemaField[];
}

export interface ValidationError {
  conditionId: string;
  message: string;
  type: "rule" | "group";
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ComplexityScore {
  score: 1 | 2 | 3 | 4 | 5;
  label: "Simple" | "Low" | "Moderate" | "High" | "Very High";
  conditionCount: number;
  groupCount: number;
  maxDepth: number;
}

export type PreviewFormat = "SQL" | "MongoDB" | "GraphQL";
```

---

### 22.2 Query Store (`store/query-store.ts`)

The query store is the most critical store. It manages the entire query tree using **Zustand** with **Immer** for immutable updates and **patch-based undo/redo**.

```typescript
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enablePatches, Patch, applyPatches } from "immer";

enablePatches(); // required for undo/redo patch tracking

interface QueryStore {
  // State
  tree: Group; // the root group — always exists
  schemaId: string; // active schema ID
  undoStack: [Patch[], Patch[]][]; // [forwardPatches, inversePatches][]
  redoStack: [Patch[], Patch[]][];

  // Tree mutations
  addRule: (groupId: string) => void;
  removeRule: (groupId: string, ruleId: string) => void;
  updateRule: (groupId: string, ruleId: string, patch: Partial<Rule>) => void;
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

  // Tree-level
  clearTree: () => void;
  replaceTree: (tree: Group) => void;
  setSchema: (schemaId: string) => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
```

**Key implementation detail — undo/redo with immer patches:**

```typescript
// Every mutation wraps produce() with produceWithPatches()
// to capture forward and inverse patches for undo/redo

function withHistory(set: SetState, fn: (draft: Draft<QueryStore>) => void) {
  set((state) => {
    const [nextState, patches, inversePatches] = produceWithPatches(state, fn);
    nextState.undoStack.push([patches, inversePatches]);
    nextState.redoStack = []; // clear redo on new action
    if (nextState.undoStack.length > 50) nextState.undoStack.shift();
    return nextState;
  });
}
```

**Recursive tree traversal helpers (internal, not exposed):**

```typescript
function findGroup(tree: Group, groupId: string): Group | null;
function findParentGroup(tree: Group, conditionId: string): Group | null;
function findCondition(tree: Group, conditionId: string): Condition | null;
function countConditions(group: Group): number; // recursive leaf count
function countGroups(group: Group): number; // recursive group count
function getMaxDepth(group: Group, depth = 0): number;
```

All helpers are **pure functions** exported from `lib/query-engine/tree-utils.ts` — they operate on data without side effects, making them trivially unit-testable.

---

### 22.3 UI Store (`store/ui-store.ts`)

```typescript
interface UIStore {
  // Sidebar
  sidebarOpen: boolean;
  sidebarSection: "schema" | "history" | "presets"; // active accordion
  toggleSidebar: () => void;
  setSidebarSection: (section: UIStore["sidebarSection"]) => void;

  // Preview panel
  activeFormat: PreviewFormat;
  setActiveFormat: (format: PreviewFormat) => void;

  // Results drawer
  resultsOpen: boolean;
  toggleResults: () => void;
  setResultsOpen: (open: boolean) => void;

  // Collapsed groups (groupId → boolean)
  collapsedGroups: Record<string, boolean>;
  toggleGroupCollapse: (groupId: string) => void;
  collapseAll: () => void;
  expandAll: () => void;

  // Modals
  shortcutModalOpen: boolean;
  exportModalOpen: boolean;
  importModalOpen: boolean;
  setShortcutModalOpen: (open: boolean) => void;
  setExportModalOpen: (open: boolean) => void;
  setImportModalOpen: (open: boolean) => void;
}
```

---

### 22.4 History Store (`store/history-store.ts`)

```typescript
interface QueryHistoryEntry {
  id: string;
  tree: Group;
  schemaId: string;
  timestamp: number; // Date.now()
  conditionCount: number;
  resultCount: number;
}

interface SavedPreset {
  id: string;
  name: string;
  tree: Group;
  schemaId: string;
  format: PreviewFormat;
  createdAt: number;
}

interface HistoryStore {
  // Query run history (last 20)
  history: QueryHistoryEntry[];
  addHistory: (entry: Omit<QueryHistoryEntry, "id">) => void;
  clearHistory: () => void;

  // Saved presets (max 50)
  presets: SavedPreset[];
  savePreset: (
    name: string,
    tree: Group,
    schemaId: string,
    format: PreviewFormat,
  ) => void;
  deletePreset: (id: string) => void;
  loadPreset: (id: string) => SavedPreset | null;
}
```

**Persistence:** Both `history` and `presets` arrays are persisted to `localStorage` using Zustand's `persist` middleware:

```typescript
export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      /* ... */
    }),
    {
      name: "nexusdb-history",
      partialize: (state) => ({
        history: state.history,
        presets: state.presets,
      }),
    },
  ),
);
```

---

### 22.5 Store Selector Pattern

Never subscribe to the entire store in components. Always use granular selectors:

```typescript
// ❌ Wrong — re-renders on any store change
const store = useQueryStore();

// ✅ Correct — only re-renders when tree.conditions changes
const conditions = useQueryStore((state) => state.tree.conditions);
const addRule = useQueryStore((state) => state.addRule);
```

For computed/derived values, use `useShallow` from Zustand:

```typescript
import { useShallow } from "zustand/react/shallow";

const { canUndo, canRedo } = useQueryStore(
  useShallow((state) => ({ canUndo: state.canUndo, canRedo: state.canRedo })),
);
```

---

## 23. Query Engine Design

### 23.1 SQL Generator

```typescript
// lib/query-engine/generators/sql.ts

export function generateSQL(group: Group, schema: Schema): string {
  const tableName = schema.id;
  const where = generateGroupSQL(group, 0);
  if (!where) return `SELECT * FROM ${tableName}`;
  return `SELECT *\nFROM ${tableName}\nWHERE\n${where}`;
}

function generateGroupSQL(group: Group, depth: number): string {
  const indent = "  ".repeat(depth);
  const childIndent = "  ".repeat(depth + 1);

  const parts = group.conditions
    .map((condition) => {
      if (condition.type === "rule")
        return generateRuleSQL(condition, childIndent);
      if (condition.type === "group")
        return generateGroupSQL(condition, depth + 1);
      return null;
    })
    .filter(Boolean) as string[];

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];

  const joined = parts.join(`\n${childIndent}${group.logic}\n${childIndent}`);
  return depth === 0
    ? `${childIndent}${joined}`
    : `${indent}(\n${childIndent}${joined}\n${indent})`;
}

function generateRuleSQL(rule: Rule, indent: string): string {
  const { field, operator, value } = rule;
  if (!field || !operator) return "/* incomplete rule */";

  switch (operator) {
    case "eq":
      return `${field} = ${formatSQLValue(value)}`;
    case "neq":
      return `${field} != ${formatSQLValue(value)}`;
    case "contains":
      return `${field} LIKE '%${value}%'`;
    case "starts_with":
      return `${field} LIKE '${value}%'`;
    case "ends_with":
      return `${field} LIKE '%${value}'`;
    case "gt":
      return `${field} > ${formatSQLValue(value)}`;
    case "gte":
      return `${field} >= ${formatSQLValue(value)}`;
    case "lt":
      return `${field} < ${formatSQLValue(value)}`;
    case "lte":
      return `${field} <= ${formatSQLValue(value)}`;
    case "between":
      return `${field} BETWEEN ${formatSQLValue((value as any[])[0])} AND ${formatSQLValue((value as any[])[1])}`;
    case "in":
      return `${field} IN (${(value as any[]).map(formatSQLValue).join(", ")})`;
    case "not_in":
      return `${field} NOT IN (${(value as any[]).map(formatSQLValue).join(", ")})`;
    case "is_null":
      return `${field} IS NULL`;
    case "is_not_null":
      return `${field} IS NOT NULL`;
    case "is_true":
      return `${field} = TRUE`;
    case "is_false":
      return `${field} = FALSE`;
    case "regex":
      return `${field} REGEXP '${value}'`;
    case "before":
      return `${field} < ${formatSQLValue(value)}`;
    case "after":
      return `${field} > ${formatSQLValue(value)}`;
    case "is_today":
      return `DATE(${field}) = CURDATE()`;
    case "is_this_week":
      return `YEARWEEK(${field}) = YEARWEEK(NOW())`;
    case "is_this_month":
      return `MONTH(${field}) = MONTH(NOW()) AND YEAR(${field}) = YEAR(NOW())`;
    default:
      return `/* unsupported operator: ${operator} */`;
  }
}

function formatSQLValue(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  return `'${String(value)}'`;
}
```

---

### 23.2 MongoDB Generator

```typescript
// lib/query-engine/generators/mongo.ts

export function generateMongo(group: Group, schema: Schema): object {
  return generateGroupMongo(group);
}

function generateGroupMongo(group: Group): object {
  const parts = group.conditions
    .map((condition) => {
      if (condition.type === "rule") return generateRuleMongo(condition);
      if (condition.type === "group") return generateGroupMongo(condition);
      return null;
    })
    .filter(Boolean) as object[];

  if (parts.length === 0) return {};
  if (parts.length === 1) return parts[0];

  const key = group.logic === "AND" ? "$and" : "$or";
  return { [key]: parts };
}

function generateRuleMongo(rule: Rule): object {
  const { field, operator, value } = rule;
  if (!field || !operator) return {};

  switch (operator) {
    case "eq":
      return { [field]: { $eq: value } };
    case "neq":
      return { [field]: { $ne: value } };
    case "contains":
      return { [field]: { $regex: value, $options: "i" } };
    case "starts_with":
      return { [field]: { $regex: `^${value}`, $options: "i" } };
    case "ends_with":
      return { [field]: { $regex: `${value}$`, $options: "i" } };
    case "gt":
      return { [field]: { $gt: value } };
    case "gte":
      return { [field]: { $gte: value } };
    case "lt":
      return { [field]: { $lt: value } };
    case "lte":
      return { [field]: { $lte: value } };
    case "between":
      return {
        [field]: { $gte: (value as any[])[0], $lte: (value as any[])[1] },
      };
    case "in":
      return { [field]: { $in: value } };
    case "not_in":
      return { [field]: { $nin: value } };
    case "is_null":
      return { [field]: { $eq: null } };
    case "is_not_null":
      return { [field]: { $ne: null } };
    case "is_true":
      return { [field]: true };
    case "is_false":
      return { [field]: false };
    case "regex":
      return { [field]: { $regex: value } };
    case "before":
      return { [field]: { $lt: value } };
    case "after":
      return { [field]: { $gt: value } };
    default:
      return {};
  }
}
```

---

### 23.3 GraphQL Generator

```typescript
// lib/query-engine/generators/graphql.ts

export function generateGraphQL(group: Group, schema: Schema): string {
  const where = generateGroupGQL(group, 2);
  const fields = schema.fields.map((f) => `    ${f.name}`).join("\n");

  return `query Filter${capitalize(schema.id)} {
  ${schema.id}(
    where: {
${where}
    }
  ) {
${fields}
  }
}`;
}

function generateGroupGQL(group: Group, depth: number): string {
  const indent = "  ".repeat(depth);
  const childIndent = "  ".repeat(depth + 1);
  const key = group.logic === "AND" ? "_and" : "_or";

  const parts = group.conditions
    .map((condition) => {
      if (condition.type === "rule")
        return `${childIndent}  ${generateRuleGQL(condition)}`;
      if (condition.type === "group")
        return generateGroupGQL(condition, depth + 1);
      return null;
    })
    .filter(Boolean) as string[];

  if (parts.length === 0) return "";

  return `${indent}${key}: [\n${indent}  {\n${parts.join("\n")}\n${indent}  }\n${indent}]`;
}

function generateRuleGQL(rule: Rule): string {
  const { field, operator, value } = rule;
  if (!field || !operator) return "# incomplete rule";

  switch (operator) {
    case "eq":
      return `${field}: { _eq: ${gqlValue(value)} }`;
    case "neq":
      return `${field}: { _neq: ${gqlValue(value)} }`;
    case "contains":
      return `${field}: { _ilike: "%${value}%" }`;
    case "starts_with":
      return `${field}: { _ilike: "${value}%" }`;
    case "ends_with":
      return `${field}: { _ilike: "%${value}" }`;
    case "gt":
      return `${field}: { _gt: ${gqlValue(value)} }`;
    case "gte":
      return `${field}: { _gte: ${gqlValue(value)} }`;
    case "lt":
      return `${field}: { _lt: ${gqlValue(value)} }`;
    case "lte":
      return `${field}: { _lte: ${gqlValue(value)} }`;
    case "in":
      return `${field}: { _in: [${(value as any[]).map(gqlValue).join(", ")}] }`;
    case "not_in":
      return `${field}: { _nin: [${(value as any[]).map(gqlValue).join(", ")}] }`;
    case "is_null":
      return `${field}: { _is_null: true }`;
    case "is_not_null":
      return `${field}: { _is_null: false }`;
    case "before":
      return `${field}: { _lt: ${gqlValue(value)} }`;
    case "after":
      return `${field}: { _gt: ${gqlValue(value)} }`;
    default:
      return `# unsupported: ${operator}`;
  }
}

function gqlValue(value: unknown): string {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return String(value);
  if (value === null) return "null";
  return String(value);
}
```

---

### 23.4 Validator Algorithm

```typescript
// lib/query-engine/validator.ts

export function validateTree(group: Group, schema: Schema): ValidationResult {
  const errors: ValidationError[] = [];
  validateGroup(group, schema, errors);
  return { isValid: errors.length === 0, errors };
}

function validateGroup(
  group: Group,
  schema: Schema,
  errors: ValidationError[],
): void {
  // Check for empty group
  if (group.conditions.length === 0) {
    errors.push({
      conditionId: group.id,
      type: "group",
      message: "This group has no conditions. Add a rule or remove the group.",
    });
    return;
  }

  for (const condition of group.conditions) {
    if (condition.type === "rule") {
      validateRule(condition, schema, errors);
    } else {
      validateGroup(condition, schema, errors); // recurse
    }
  }
}

function validateRule(
  rule: Rule,
  schema: Schema,
  errors: ValidationError[],
): void {
  if (!rule.field) {
    errors.push({
      conditionId: rule.id,
      type: "rule",
      message: "Select a field to continue",
    });
    return;
  }

  if (!rule.operator) {
    errors.push({
      conditionId: rule.id,
      type: "rule",
      message: "Select an operator",
    });
    return;
  }

  const field = schema.fields.find((f) => f.name === rule.field);
  if (!field) return;

  const noValueOperators = [
    "is_null",
    "is_not_null",
    "is_empty",
    "is_not_empty",
    "is_true",
    "is_false",
    "is_today",
    "is_this_week",
    "is_this_month",
    "array_is_empty",
    "array_is_not_empty",
  ];

  if (noValueOperators.includes(rule.operator)) return; // no value needed

  // Type-operator compatibility
  if (rule.operator === "contains" && field.type !== "string") {
    errors.push({
      conditionId: rule.id,
      type: "rule",
      message: "Operator 'contains' is only valid for text fields",
    });
    return;
  }

  if (rule.operator === "regex" && field.type !== "string") {
    errors.push({
      conditionId: rule.id,
      type: "rule",
      message: "Regex is only valid for text fields",
    });
    return;
  }

  // Between validation
  if (["between", "not_between"].includes(rule.operator)) {
    const [a, b] = (rule.value as any[]) ?? [];
    if (a === undefined || a === null || a === "") {
      errors.push({
        conditionId: rule.id,
        type: "rule",
        message: "Both values are required for 'between'",
      });
    } else if (b === undefined || b === null || b === "") {
      errors.push({
        conditionId: rule.id,
        type: "rule",
        message: "Both values are required for 'between'",
      });
    } else if (field.type === "number" && Number(a) > Number(b)) {
      errors.push({
        conditionId: rule.id,
        type: "rule",
        message: "First value must be less than second",
      });
    }
    return;
  }

  // In array validation
  if (["in", "not_in"].includes(rule.operator)) {
    if (!Array.isArray(rule.value) || rule.value.length === 0) {
      errors.push({
        conditionId: rule.id,
        type: "rule",
        message: "Add at least one value",
      });
    }
    return;
  }

  // Empty value
  if (rule.value === null || rule.value === undefined || rule.value === "") {
    errors.push({
      conditionId: rule.id,
      type: "rule",
      message: "A value is required",
    });
  }
}
```

---

### 23.5 Executor Algorithm

```typescript
// lib/query-engine/executor.ts

export function executeQuery<T extends Record<string, unknown>>(
  group: Group,
  data: T[],
): T[] {
  return data.filter((record) => matchesGroup(record, group));
}

function matchesGroup<T extends Record<string, unknown>>(
  record: T,
  group: Group,
): boolean {
  if (group.conditions.length === 0) return true;

  if (group.logic === "AND") {
    return group.conditions.every((condition) =>
      matchesCondition(record, condition),
    );
  } else {
    return group.conditions.some((condition) =>
      matchesCondition(record, condition),
    );
  }
}

function matchesCondition<T extends Record<string, unknown>>(
  record: T,
  condition: Condition,
): boolean {
  if (condition.type === "group") return matchesGroup(record, condition);
  return matchesRule(record, condition);
}

function matchesRule<T extends Record<string, unknown>>(
  record: T,
  rule: Rule,
): boolean {
  if (!rule.field || !rule.operator) return true; // incomplete rules pass through

  const recordValue = record[rule.field];
  const { operator, value } = rule;

  switch (operator) {
    case "eq":
      return recordValue === value;
    case "neq":
      return recordValue !== value;
    case "contains":
      return String(recordValue)
        .toLowerCase()
        .includes(String(value).toLowerCase());
    case "not_contains":
      return !String(recordValue)
        .toLowerCase()
        .includes(String(value).toLowerCase());
    case "starts_with":
      return String(recordValue)
        .toLowerCase()
        .startsWith(String(value).toLowerCase());
    case "ends_with":
      return String(recordValue)
        .toLowerCase()
        .endsWith(String(value).toLowerCase());
    case "gt":
      return Number(recordValue) > Number(value);
    case "gte":
      return Number(recordValue) >= Number(value);
    case "lt":
      return Number(recordValue) < Number(value);
    case "lte":
      return Number(recordValue) <= Number(value);
    case "between": {
      const [min, max] = value as [number, number];
      return (
        Number(recordValue) >= Number(min) && Number(recordValue) <= Number(max)
      );
    }
    case "in":
      return (value as unknown[]).includes(recordValue);
    case "not_in":
      return !(value as unknown[]).includes(recordValue);
    case "is_null":
      return recordValue === null || recordValue === undefined;
    case "is_not_null":
      return recordValue !== null && recordValue !== undefined;
    case "is_empty":
      return String(recordValue).trim() === "";
    case "is_not_empty":
      return String(recordValue).trim() !== "";
    case "is_true":
      return recordValue === true;
    case "is_false":
      return recordValue === false;
    case "regex": {
      try {
        return new RegExp(String(value)).test(String(recordValue));
      } catch {
        return false;
      }
    }
    case "before":
      return new Date(String(recordValue)) < new Date(String(value));
    case "after":
      return new Date(String(recordValue)) > new Date(String(value));
    case "is_today": {
      const d = new Date(String(recordValue));
      const today = new Date();
      return d.toDateString() === today.toDateString();
    }
    case "is_this_week": {
      const d = new Date(String(recordValue));
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return d >= startOfWeek;
    }
    case "is_this_month": {
      const d = new Date(String(recordValue));
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }
    case "array_contains":
      return (
        Array.isArray(recordValue) && (recordValue as unknown[]).includes(value)
      );
    case "array_not_contains":
      return (
        Array.isArray(recordValue) &&
        !(recordValue as unknown[]).includes(value)
      );
    case "array_is_empty":
      return Array.isArray(recordValue) && recordValue.length === 0;
    case "array_is_not_empty":
      return Array.isArray(recordValue) && recordValue.length > 0;
    default:
      return true;
  }
}
```

---

## 24. Testing Strategy

### 24.1 Test Philosophy

Tests should prove **correctness of complex behaviour**, not trivially test that components render. Focus areas:

1. Query generator correctness (all operators, nested logic, edge cases)
2. Validator accuracy (all error conditions, type mismatches)
3. Executor filter logic (all operator implementations)
4. Store mutations (add/remove/update/undo/redo)
5. Recursive component rendering

### 24.2 Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

```typescript
// src/__tests__/setup.ts
import "@testing-library/jest-dom";
```

### 24.3 Test Files & Coverage

#### `__tests__/query-engine/sql.test.ts`

```typescript
describe("SQL Generator", () => {
  it("generates SELECT * with no conditions");
  it("generates single equals rule");
  it("generates AND group with multiple rules");
  it("generates OR group with multiple rules");
  it("generates nested AND inside OR");
  it("generates nested OR inside AND");
  it("handles contains operator");
  it("handles between operator with two values");
  it("handles in operator with array");
  it("handles is_null operator with no value");
  it("handles date before/after operators");
  it("handles is_today with no value");
  it("escapes single quotes in string values");
  it("handles deeply nested groups (depth 4)");
  it("skips incomplete rules (no field/operator)");
});
```

#### `__tests__/query-engine/mongo.test.ts`

```typescript
describe("MongoDB Generator", () => {
  it("returns empty object with no conditions");
  it("generates $eq for equals");
  it("wraps AND group in $and array");
  it("wraps OR group in $or array");
  it("generates $regex for contains");
  it("generates $gte/$lte for between");
  it("generates $in for in operator");
  it("generates null check for is_null");
  it("handles nested groups producing nested $and/$or");
  it("handles single condition without wrapper");
  it("handles regex operator with $regex");
});
```

#### `__tests__/query-engine/graphql.test.ts`

```typescript
describe("GraphQL Generator", () => {
  it("generates query with schema name");
  it("includes all schema fields in selection");
  it("generates _eq for equals");
  it("wraps AND in _and array");
  it("wraps OR in _or array");
  it("generates _ilike for contains");
  it("generates _in array syntax");
  it("generates _is_null: true for is_null");
  it("handles nested groups");
  it("handles empty conditions gracefully");
});
```

#### `__tests__/query-engine/validator.test.ts`

```typescript
describe("Validator", () => {
  it("returns valid for empty root group"); // root group is allowed empty
  it("returns error for nested empty group");
  it("returns error when field not selected");
  it("returns error when operator not selected");
  it("returns error when value empty for eq operator");
  it("returns no error for is_null (no value needed)");
  it("returns error for contains on number field");
  it("returns error for regex on date field");
  it("returns error for between with one value");
  it("returns error for between with min > max on number");
  it("returns error for in operator with empty array");
  it("returns multiple errors for multiple invalid rules");
  it("recurses into nested groups to validate all rules");
  it("returns isValid: false when any error exists");
  it("returns isValid: true when all rules are valid");
});
```

#### `__tests__/query-engine/executor.test.ts`

```typescript
describe("Executor", () => {
  const mockData = [
    /* 10 sample records */
  ];

  it("returns all records for empty group");
  it("filters by equals");
  it("filters by not equals");
  it("filters by contains (case-insensitive)");
  it("filters by greater than");
  it("filters by between (inclusive)");
  it("filters by in array");
  it("filters by is_null");
  it("filters by is_true");
  it("filters by regex");
  it("applies AND logic (all conditions must match)");
  it("applies OR logic (any condition must match)");
  it("handles nested AND inside OR correctly");
  it("handles nested OR inside AND correctly");
  it("returns empty array when no records match");
  it("handles invalid regex without throwing");
});
```

#### `__tests__/store/query-store.test.ts`

```typescript
describe("Query Store", () => {
  beforeEach(() => {
    /* reset store */
  });

  describe("addRule", () => {
    it("adds a rule to the root group");
    it("adds a rule to a nested group by ID");
    it("new rule has null field, operator, value");
    it("generates a unique ID for each new rule");
  });

  describe("removeRule", () => {
    it("removes a rule from the root group");
    it("removes a rule from a nested group");
    it("does nothing if ruleId not found");
  });

  describe("updateRule", () => {
    it("updates the field of a rule");
    it("resets operator and value when field changes");
    it("updates operator without clearing value");
    it("updates value independently");
  });

  describe("addGroup", () => {
    it("adds a nested group to root");
    it("new group starts with empty conditions and AND logic");
  });

  describe("removeGroup", () => {
    it("removes a nested group");
    it("cannot remove the root group");
  });

  describe("updateGroupLogic", () => {
    it("toggles AND to OR");
    it("toggles OR to AND");
  });

  describe("undo/redo", () => {
    it("undoes addRule");
    it("redoes after undo");
    it("clears redo stack on new action");
    it("canUndo is false on initial state");
    it("canRedo is false before any undo");
    it("handles undo up to 50 times");
  });

  describe("replaceTree", () => {
    it("replaces entire tree and adds to undo stack");
  });

  describe("clearTree", () => {
    it("resets to empty root group");
  });
});
```

#### `__tests__/components/ConditionGroup.test.tsx`

```typescript
describe("ConditionGroup", () => {
  it("renders AND/OR logic toggle");
  it("renders all child rules");
  it("renders nested ConditionGroup recursively");
  it("calls addRule when add rule button clicked");
  it("calls addGroup when add group button clicked");
  it("collapses body when collapse button clicked");
  it("shows correct depth color on left border");
  it("does not show remove button on root group");
  it("shows remove button on nested groups");
  it("renders error message for empty group");
});
```

#### `__tests__/components/ConditionRule.test.tsx`

```typescript
describe("ConditionRule", () => {
  it("renders field selector with schema fields");
  it("renders operator selector (disabled until field selected)");
  it("renders correct input type for string field");
  it("renders date picker for date field");
  it("renders toggle for boolean field");
  it("renders combobox for enum field");
  it("renders tag input for in operator");
  it("hides value input for is_null operator");
  it("renders two inputs for between operator");
  it("shows error message below rule when error exists");
  it("applies red border class when rule has error");
  it("calls removeRule when remove button clicked");
  it("shows drag handle on hover");
});
```

### 24.4 Test Utilities

```typescript
// src/__tests__/utils/builders.ts — helper factories for test data

export function buildRule(overrides?: Partial<Rule>): Rule {
  return {
    id: "rule-test-1",
    type: "rule",
    field: "codename",
    operator: "eq",
    value: "Ghost",
    ...overrides,
  };
}

export function buildGroup(overrides?: Partial<Group>): Group {
  return {
    id: "group-test-1",
    type: "group",
    logic: "AND",
    conditions: [],
    ...overrides,
  };
}

export function buildSchema(): Schema {
  return agentsSchema; // use the real agents schema
}
```

---

## 25. Performance Optimization Techniques

### 25.1 Component Memoization

Apply `React.memo` to components that:

- Receive stable props
- Are rendered many times (inside lists)
- Have expensive render logic

```typescript
// Memoize these components:
export const ConditionRule = React.memo(
  ConditionRuleComponent,
  (prev, next) => {
    return (
      prev.rule.id === next.rule.id &&
      prev.rule.field === next.rule.field &&
      prev.rule.operator === next.rule.operator &&
      prev.rule.value === next.rule.value &&
      prev.error === next.error
    );
  },
);

export const ConditionGroup = React.memo(ConditionGroupComponent);
export const CodeBlock = React.memo(CodeBlockComponent);
export const ResultsTable = React.memo(ResultsTableComponent);
export const SchemaCard = React.memo(SchemaCardComponent);
```

### 25.2 Derived State with useMemo

Never compute expensive values inline in render. Use `useMemo`:

```typescript
// In QueryBuilder.tsx
const complexity = useMemo(() => calculateComplexity(tree), [tree]);

// In PreviewPanel.tsx
const sqlQuery = useMemo(
  () => (isValid ? generateSQL(tree, schema) : ""),
  [tree, schema, isValid],
);

const mongoQuery = useMemo(
  () => (isValid ? generateMongo(tree, schema) : {}),
  [tree, schema, isValid],
);

const graphqlQuery = useMemo(
  () => (isValid ? generateGraphQL(tree, schema) : ""),
  [tree, schema, isValid],
);

// In ConditionGroup.tsx
const depthColor = useMemo(() => getDepthColor(depth), [depth]);
```

### 25.3 Stable Callbacks with useCallback

```typescript
// In ConditionRule.tsx
const handleFieldChange = useCallback(
  (field: string) => {
    updateRule(groupId, rule.id, { field, operator: null, value: null });
  },
  [groupId, rule.id, updateRule],
);

const handleOperatorChange = useCallback(
  (operator: OperatorValue) => {
    updateRule(groupId, rule.id, { operator, value: null });
  },
  [groupId, rule.id, updateRule],
);

const handleRemove = useCallback(() => {
  removeRule(groupId, rule.id);
}, [groupId, rule.id, removeRule]);
```

### 25.4 Stable Keys

**Always use stable IDs, never array indices:**

```typescript
// ❌ Wrong
{conditions.map((condition, i) => (
  <ConditionRule key={i} ... />
))}

// ✅ Correct
{conditions.map(condition => (
  <ConditionRule key={condition.id} ... />
))}
```

Each Rule and Group gets a UUID on creation:

```typescript
import { nanoid } from "nanoid";
const id = nanoid(); // 21-char unique ID, faster than UUID v4
```

### 25.5 Debouncing

```typescript
// Preview panel — debounce tree → query generation
const debouncedTree = useDebounce(tree, 100);

// Validation — debounce to avoid per-keystroke revalidation
const debouncedTree = useDebounce(tree, 200);

// Import JSON parsing
const debouncedJson = useDebounce(importValue, 300);
```

### 25.6 Component Isolation

The key performance pattern for recursive components: **each ConditionGroup subscribes only to its own subtree**, not the entire query tree.

```typescript
// ConditionGroup receives its group data as a prop
// NOT by selecting the whole tree and finding itself

// ❌ Anti-pattern: re-renders on any tree change
function ConditionGroup({ groupId }: { groupId: string }) {
  const tree = useQueryStore((state) => state.tree);
  const group = findGroup(tree, groupId); // expensive + re-renders always
}

// ✅ Correct: parent passes group as prop, only re-renders when this group changes
function ConditionGroup({ group, depth }: { group: Group; depth: number }) {
  // Only depends on group prop — parent decides when to re-render
}
```

### 25.7 Query Generator Optimization

Generators are pure functions — memoize at the hook level, not inside the generator:

```typescript
// Generators themselves have no memoization (they're pure)
// Memoization happens in the component that calls them:

const sqlOutput = useMemo(() => generateSQL(tree, schema), [tree, schema]);
```

For very deeply nested trees (10+ levels), the generator traversal is still O(n) where n = total conditions. No optimization needed at current scale.

### 25.8 Results Table Virtualization (Bonus)

If the results set is large (500+ records), implement virtual scrolling with `@tanstack/react-virtual`:

```typescript
import { useVirtualizer } from "@tanstack/react-virtual";

const rowVirtualizer = useVirtualizer({
  count: results.length,
  getScrollElement: () => tableContainerRef.current,
  estimateSize: () => 36, // row height
  overscan: 10,
});
```

Only implement this if time permits — not required for the mock datasets (max 203 records).

### 25.9 Framer Motion Optimization

```typescript
// Use layout animations sparingly — only on the logic toggle pill
// Avoid layout animations on condition lists (use AnimatePresence instead)

// ✅ Use AnimatePresence for enter/exit — no layout recalculation
<AnimatePresence mode="popLayout">
  {conditions.map(c => <motion.div key={c.id} variants={ruleVariants} ... />)}
</AnimatePresence>

// ❌ Avoid layout prop on every list item
<motion.div layout> {/* expensive — triggers layout recalc on siblings */}
```

---

## 26. Keyboard Shortcut Implementation

### 26.1 `useKeyboardShortcuts` Hook

```typescript
// hooks/useKeyboardShortcuts.ts

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Skip if user is typing in an input/textarea/contenteditable
      const target = e.target as HTMLElement;
      const isTyping =
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
        target.contentEditable === "true";

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrl === (e.ctrlKey || e.metaKey);
        const shiftMatch = !!shortcut.shift === e.shiftKey;
        const altMatch = !!shortcut.alt === e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          // Allow ? shortcut even when typing (it's a help toggle)
          if (isTyping && shortcut.key !== "?") continue;

          if (shortcut.preventDefault !== false) e.preventDefault();
          shortcut.action();
          break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
```

### 26.2 Registration in Root Component

```typescript
// components/layout/AppLayout.tsx

useKeyboardShortcuts([
  { key: "Enter", ctrl: true, action: runQuery, description: "Run query" },
  { key: "z", ctrl: true, action: undo, description: "Undo" },
  { key: "z", ctrl: true, shift: true, action: redo, description: "Redo" },
  { key: "s", ctrl: true, action: openSavePreset, description: "Save preset" },
  {
    key: "e",
    ctrl: true,
    action: openExportModal,
    description: "Export query",
  },
  {
    key: "i",
    ctrl: true,
    action: openImportModal,
    description: "Import query",
  },
  { key: "?", action: toggleShortcutModal, description: "Toggle shortcuts" },
]);
```

### 26.3 Rule-level Shortcuts

These are handled locally in ConditionRule (not globally):

```typescript
// Ctrl+D when a rule is focused → duplicate it
// Ctrl+G when a rule is focused → wrap it in a new group
// Escape when a group toolbar is focused → collapse that group
```

Use `onKeyDown` handlers directly on the relevant elements.

---

## 27. Deployment & CD Setup

### 27.1 Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "outputDirectory": ".next"
}
```

### 27.2 Environment Variables

No external APIs are used — no `.env` variables required for core functionality. If adding analytics later:

```bash
# .env.local (not committed)
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 27.3 Deployment Pipeline

1. Push to any branch → Vercel creates a **preview deployment**
   - URL pattern: `nexusdb-git-{branch-name}-{username}.vercel.app`
2. Merge PR to `main` → Vercel triggers **production deployment**
   - Production URL: `nexusdb.vercel.app` (or custom domain)
3. Each deployment runs:

   ```
   pnpm install → pnpm build → deploy
   ```

4. Build must pass TypeScript check (`tsc --noEmit`) before deploying

### 27.4 CI Checks (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: "pnpm" }
      - run: pnpm install --frozen-lockfile
      - run: pnpm tsc --noEmit
      - run: pnpm lint
      - run: pnpm test --run
```

---

## 28. Package & Dependency List

### 28.1 Complete Dependency Table

| Package                    | Version   | Category      | Purpose                         |
| -------------------------- | --------- | ------------- | ------------------------------- |
| `next`                     | `14.x`    | Core          | App framework                   |
| `react`                    | `18.x`    | Core          | UI runtime                      |
| `react-dom`                | `18.x`    | Core          | DOM rendering                   |
| `typescript`               | `5.x`     | Core          | Type safety                     |
| `tailwindcss`              | `3.x`     | Styling       | Utility CSS                     |
| `postcss`                  | `8.x`     | Styling       | Tailwind pipeline               |
| `autoprefixer`             | `10.x`    | Styling       | CSS vendor prefixes             |
| `zustand`                  | `4.x`     | State         | Global state management         |
| `immer`                    | `10.x`    | State         | Immutable updates + patches     |
| `framer-motion`            | `11.x`    | Animation     | Component animations            |
| `@dnd-kit/core`            | `6.x`     | DnD           | Drag-and-drop core              |
| `@dnd-kit/sortable`        | `7.x`     | DnD           | Sortable list utilities         |
| `@dnd-kit/utilities`       | `3.x`     | DnD           | DnD helper utilities            |
| `next-themes`              | `0.3.x`   | Theme         | Dark/light/system mode          |
| `lucide-react`             | `0.383.x` | Icons         | Icon library                    |
| `geist`                    | `1.x`     | Fonts         | Geist font (Vercel)             |
| `nanoid`                   | `5.x`     | Utils         | Fast unique ID generation       |
| `date-fns`                 | `3.x`     | Utils         | Date formatting/parsing         |
| `class-variance-authority` | `0.7.x`   | Utils         | shadcn variant utility          |
| `clsx`                     | `2.x`     | Utils         | Conditional class names         |
| `tailwind-merge`           | `2.x`     | Utils         | Merge Tailwind classes          |
| `@radix-ui/react-*`        | `latest`  | UI Primitives | shadcn/ui base (auto-installed) |

### 28.2 Dev Dependencies

| Package                       | Version | Purpose                     |
| ----------------------------- | ------- | --------------------------- |
| `vitest`                      | `1.x`   | Test runner                 |
| `@vitest/ui`                  | `1.x`   | Vitest UI panel             |
| `@testing-library/react`      | `15.x`  | Component testing           |
| `@testing-library/jest-dom`   | `6.x`   | Custom DOM matchers         |
| `@testing-library/user-event` | `14.x`  | User interaction simulation |
| `jsdom`                       | `24.x`  | DOM environment for tests   |
| `@vitejs/plugin-react`        | `4.x`   | React plugin for Vitest     |
| `eslint`                      | `8.x`   | Linting                     |
| `eslint-config-next`          | `14.x`  | Next.js ESLint rules        |
| `prettier`                    | `3.x`   | Code formatting             |
| `prettier-plugin-tailwindcss` | `0.6.x` | Auto-sort Tailwind classes  |

### 28.3 shadcn/ui Components to Install

```bash
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add command
pnpm dlx shadcn-ui@latest add popover
pnpm dlx shadcn-ui@latest add select
pnpm dlx shadcn-ui@latest add switch
pnpm dlx shadcn-ui@latest add calendar
pnpm dlx shadcn-ui@latest add dialog
pnpm dlx shadcn-ui@latest add separator
pnpm dlx shadcn-ui@latest add tooltip
pnpm dlx shadcn-ui@latest add badge
pnpm dlx shadcn-ui@latest add scroll-area
pnpm dlx shadcn-ui@latest add tabs
```

---

## 29. README Structure

The submitted README.md must cover these sections (graded requirement):

```markdown
# NexusDB Explorer

> Visual Query Builder — HNG14 Frontend Wizards Stage 8

[Live Demo](https://nexusdb.vercel.app) · [GitHub](https://github.com/...)

## Overview

One paragraph — what the app is, what it does, who it's for.

## Features

Bullet list of all implemented features, grouped by category.

## Architecture Explanation

### Folder Structure

Annotated tree of src/ directory.

### Component Architecture

How the three-panel layout is organized.
How ConditionGroup and ConditionRule relate.

## Recursive Rendering Strategy

Explain how ConditionGroup renders itself recursively.
How depth is passed and used for color and indentation.
How AnimatePresence handles enter/exit at each level.
Code snippet of the recursive render pattern.

## State Management Decisions

Why Zustand was chosen over Redux/Jotai.
How the query tree is structured (Group/Rule types).
How mutations work with Immer.
How undo/redo uses immer patches.
How UI state and history state are separated into their own stores.

## Query Engine Design

How the three generators work (SQL/Mongo/GraphQL).
How all three are pure recursive functions.
How the validator traverses the tree and collects errors.
How the executor filters mock data client-side.
How complexity is calculated.

## Performance Optimization Techniques

React.memo on recursive components.
useMemo for derived query output.
useCallback for stable mutation handlers.
Stable nanoid keys on all conditions.
Debounced tree → preview generation.
Component isolation pattern (group receives data as prop).

## Trade-offs Made

- Used client-side execution (no real DB) — chose simplicity over realism
- Manual syntax highlighting — chose no external dep over richer highlighting
- Seeded mock data — chose deterministic results over random demo data
- Tailwind over CSS-in-JS — chose build-time CSS over runtime overhead
- nanoid over UUID — chose speed over spec compliance

## Local Development

### Prerequisites

### Installation

### Running Tests

### Building for Production

## Tech Stack

Table: package, version, purpose.
```

---

_End of NexusDB Explorer UI/UX Design Specification v1.0.0 — Complete Edition_

> **Sections 1–20** cover the full UI/UX design system.
> **Sections 21–29** cover engineering architecture, PRs, state, query engine, testing, performance, shortcuts, deployment, packages, and README.
> This document is the single source of truth for the entire project.
