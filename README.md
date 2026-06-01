# NexusDB Explorer

A visual query builder for SQL, MongoDB, and GraphQL. Build complex nested database filters through a graphical interface — no raw query syntax required.

> HNG14 · Frontend Wizards · Stage 8

**Live:** [hng-fe-stage-8.vercel.app](https://hng-fe-stage-8.vercel.app)

---

## What it does

NexusDB Explorer lets you construct arbitrarily nested `AND`/`OR` filter trees against three built-in mock schemas (Agents, Cities, Incidents), then instantly previews the resulting query in SQL, MongoDB, and GraphQL formats simultaneously.

- **Visual filter builder** — add rules, nest groups, drag to reorder
- **Three query output formats** — SQL, MongoDB filter syntax, GraphQL `where` input
- **Schema-driven inputs** — field type determines the input widget (date picker, enum dropdown, tag input, boolean toggle, etc.)
- **Live results** — runs the filter against mock data and shows matched rows in a paginated table with CSV export
- **50-step undo/redo** — powered by Immer patches
- **Complexity scoring** — real-time indicator of query depth and condition count

---

## Routes

| Path | Description                          |
| ---- | ------------------------------------ |
| `/`  | Query builder — the full application |

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
| Fonts         | Geist Sans + Geist Mono            |

---

## Getting started

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000> — query builder.

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
│   ├── page.tsx                  # Query builder (/app)
│   ├── layout.tsx                # Root layout + providers
│   └── globals.css               # Design tokens + base styles
│
├── components/
│   ├── landing/                  # Landing page sections
│   ├── query-builder/            # Filter tree components
│   ├── preview/                  # Query output panel
│   ├── results/                  # Results table + drawer
│   ├── sidebar/                  # Schema selector + history
│   ├── layout/                   # App shell + header
│   ├── inputs/                   # Type-specific value inputs
│   ├── modals/                   # Export, import, shortcuts
│   └── shared/                   # Generic UI primitives
│
├── lib/
│   ├── query-engine/             # SQL/MongoDB/GraphQL generators + executor
│   ├── schemas/                  # Field definitions for 3 mock schemas
│   ├── mock-data/                # Seeded fake records
│   └── landing/                  # Landing page data (features, schemas)
│
└── store/
    ├── query-store.ts            # Filter tree state (Zustand + Immer)
    ├── history-store.ts          # Undo/redo stack
    └── ui-store.ts               # Sidebar, modals, active tab
```

---

## Mock schemas

| Schema    | Records | Field types                                |
| --------- | ------- | ------------------------------------------ |
| Agents    | 87      | string, enum, date, number, boolean, array |
| Cities    | 124     | string, number, enum, date, boolean, array |
| Incidents | 203     | enum, date, number, array, boolean         |

---

## Design system

The app uses a CSS variable token system defined in `globals.css`. All colors, spacing, and shadows reference `var(--*)` tokens so the dark/light theme switch is handled entirely at the `:root` / `[data-theme="light"]` level.

Key tokens: `--bg-base`, `--bg-surface`, `--bg-elevated`, `--accent` (`#6E56CF`), `--accent-2` (`#00D2FF`), `--depth-0..4` (nesting level colors).
