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

CSS variable token system defined in `globals.css`. All colors, spacing, and shadows reference `var(--*)` tokens so dark/light theme switching is handled entirely at the `:root` / `[data-theme="light"]` level.

Key tokens: `--bg-base`, `--bg-surface`, `--bg-elevated`, `--accent` (`#6E56CF`), `--accent-2` (`#00D2FF`), `--depth-0..4` (nesting level colors).
