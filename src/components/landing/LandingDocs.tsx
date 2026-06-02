"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "getting-started", label: "Getting Started" },
  { id: "field-types", label: "Field Types & Operators" },
  { id: "shortcuts", label: "Keyboard Shortcuts" },
  { id: "query-formats", label: "Query Formats" },
  { id: "import-data", label: "Import Your Data" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="border-border-default bg-bg-elevated text-text-secondary inline-flex items-center rounded border px-2 py-0.5 text-xs">
      {children}
    </kbd>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-text-primary mb-4 text-lg font-semibold">{children}</h3>
  );
}

function GettingStarted() {
  const steps = [
    {
      n: "01",
      title: "Pick a schema",
      body: "Select a dataset from the sidebar — Agents, Cities, or Incidents — or import your own JSON data.",
    },
    {
      n: "02",
      title: "Add a rule",
      body: 'Click "+ Add Rule" to create a condition. Pick the field, choose an operator, and set the value.',
    },
    {
      n: "03",
      title: "Group your logic",
      body: 'Use "+ Add Group" to nest conditions. Toggle AND / OR at any level to control how rules combine.',
    },
    {
      n: "04",
      title: "Run the query",
      body: "Hit Run Query (or Ctrl+Enter) to execute against the dataset and see matching results instantly.",
    },
    {
      n: "05",
      title: "Export",
      body: "Copy the generated SQL, MongoDB, or GraphQL from the preview panel, or download it as a file.",
    },
  ];

  return (
    <div id="getting-started" className="scroll-mt-24">
      <SectionTitle>Getting Started</SectionTitle>
      <div className="space-y-3">
        {steps.map((s) => (
          <div
            key={s.n}
            className="border-border-default bg-bg-surface flex gap-4 rounded-lg border p-4"
          >
            <span className="text-accent/30 text-2xl leading-none font-bold">
              {s.n}
            </span>
            <div>
              <p className="text-text-primary mb-0.5 font-semibold">
                {s.title}
              </p>
              <p className="text-text-muted text-sm">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldTypes() {
  const rows = [
    {
      type: "String",
      color: "text-code-string",
      ops: [
        "Equals",
        "Not Equals",
        "Contains",
        "Does Not Contain",
        "Starts With",
        "Ends With",
        "Matches Regex",
        "Is Empty / Not Empty",
        "Is Null / Not Null",
      ],
    },
    {
      type: "Number",
      color: "text-code-number",
      ops: [
        "Equals",
        "Not Equals",
        "Greater Than",
        "Less Than",
        "Greater / Less Than or Equal",
        "Between",
        "Not Between",
        "Is Null / Not Null",
      ],
    },
    {
      type: "Boolean",
      color: "text-accent-2",
      ops: ["Is True", "Is False", "Is Null / Not Null"],
    },
    {
      type: "Date",
      color: "text-warning",
      ops: [
        "Equals",
        "Not Equals",
        "Before",
        "After",
        "Between",
        "Is Today",
        "Is This Week",
        "Is This Month",
        "Is Null / Not Null",
      ],
    },
    {
      type: "Enum",
      color: "text-code-keyword",
      ops: ["Equals", "Not Equals", "In", "Not In", "Is Null / Not Null"],
    },
    {
      type: "Array",
      color: "text-code-field",
      ops: [
        "Contains",
        "Does Not Contain",
        "Is Empty / Not Empty",
        "Is Null / Not Null",
      ],
    },
  ];

  return (
    <div id="field-types" className="scroll-mt-24">
      <SectionTitle>Field Types & Operators</SectionTitle>
      <div className="space-y-3">
        {rows.map((r) => (
          <div
            key={r.type}
            className="border-border-default bg-bg-surface rounded-lg border p-4"
          >
            <span className={cn("mb-2 block text-sm font-semibold", r.color)}>
              {r.type}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {r.ops.map((op) => (
                <span
                  key={op}
                  className="border-border-subtle bg-bg-elevated text-text-muted rounded-full border px-2.5 py-0.5 text-xs"
                >
                  {op}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Shortcuts() {
  const shortcuts = [
    { keys: ["Ctrl", "Z"], label: "Undo last action" },
    { keys: ["Ctrl", "Shift", "Z"], label: "Redo" },
    { keys: ["Ctrl", "Enter"], label: "Run query" },
    { keys: ["Ctrl", "Shift", "C"], label: "Clear entire query" },
    { keys: ["Ctrl", "Shift", "E"], label: "Export query as JSON" },
    { keys: ["Ctrl", "Shift", "I"], label: "Import query from JSON" },
    { keys: ["?"], label: "Show shortcuts reference" },
  ];

  return (
    <div id="shortcuts" className="scroll-mt-24">
      <SectionTitle>Keyboard Shortcuts</SectionTitle>
      <div className="divide-border-subtle border-border-default bg-bg-surface divide-y overflow-hidden rounded-lg border">
        {shortcuts.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between px-4 py-3"
          >
            <span className="text-text-secondary text-sm">{s.label}</span>
            <div className="flex items-center gap-1">
              {s.keys.map((k, i) => (
                <span key={i} className="flex items-center gap-1">
                  <Kbd>{k}</Kbd>
                  {i < s.keys.length - 1 && (
                    <span className="text-text-muted text-xs">+</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QueryFormats() {
  const formats = [
    {
      name: "SQL",
      color: "text-code-keyword",
      when: "Best for relational databases — PostgreSQL, MySQL, SQLite. Paste directly into your DB client.",
      sample: `SELECT * FROM agents
WHERE clearanceLevel > 5
AND (
  codename LIKE '%Project%'
  OR activeStatus = true
)
ORDER BY lastSeen DESC;`,
    },
    {
      name: "MongoDB",
      color: "text-code-string",
      when: "Best for MongoDB queries. Output is a JSON filter object you can drop into a `.find()` call.",
      sample: `{
  "clearanceLevel": { "$gt": 5 },
  "$or": [
    { "codename": { "$regex": "Project" } },
    { "activeStatus": true }
  ]
}`,
    },
    {
      name: "GraphQL",
      color: "text-accent-2",
      when: "Best for GraphQL APIs that accept structured `where` filter arguments.",
      sample: `query {
  agents(where: {
    clearanceLevel: { _gt: 5 }
    _or: [
      { codename: { _ilike: "%Project%" } }
      { activeStatus: { _eq: true } }
    ]
  }) { id codename }
}`,
    },
  ];

  return (
    <div id="query-formats" className="scroll-mt-24">
      <SectionTitle>Query Formats</SectionTitle>
      <div className="space-y-3">
        {formats.map((f) => (
          <div
            key={f.name}
            className="border-border-default bg-bg-surface overflow-hidden rounded-lg border"
          >
            <div className="border-border-subtle flex items-center gap-2 border-b px-4 py-3">
              <span className={cn("text-sm font-bold", f.color)}>{f.name}</span>
            </div>
            <div className="px-4 py-3">
              <p className="text-text-muted mb-3 text-sm">{f.when}</p>
              <pre className="bg-bg-base text-text-secondary overflow-auto rounded-md p-3 text-xs leading-relaxed">
                {f.sample}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImportData() {
  const methods = [
    {
      title: "Paste a JSON array",
      steps: [
        'Click the "Import" button in the header',
        'Paste a JSON array (e.g. [{"id":1,"name":"Alice"},...]) or NDJSON (one object per line)',
        "Give your dataset a name and click Import",
        "Field types are inferred automatically — strings, numbers, booleans, dates, enums, arrays",
      ],
    },
    {
      title: "Upload a .json file",
      steps: [
        'Click the "Import" button in the header',
        "Drop a .json file or click to browse",
        "The dataset name is taken from the filename automatically",
        "The modal closes instantly — your data is ready to query",
      ],
    },
  ];

  return (
    <div id="import-data" className="scroll-mt-24">
      <SectionTitle>Import Your Data</SectionTitle>
      <p className="text-text-muted mb-4 text-sm">
        Query your own datasets alongside the built-in schemas. Data lives in
        memory — re-import after a page refresh.
      </p>
      <div className="space-y-4">
        {methods.map((m) => (
          <div
            key={m.title}
            className="border-border-default bg-bg-surface rounded-lg border p-4"
          >
            <p className="text-text-primary mb-3 font-semibold">{m.title}</p>
            <ol className="space-y-1.5">
              {m.steps.map((step, i) => (
                <li key={i} className="text-text-muted flex gap-3 text-sm">
                  <span className="text-accent shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
        <div className="border-warning/20 bg-warning/5 rounded-lg border p-4">
          <p className="text-text-muted text-sm">
            <span className="text-warning font-semibold">Tip: </span>
            Enums are auto-detected when a field has fewer than 12 unique
            values. Arrays are detected when values are JSON arrays.
          </p>
        </div>
      </div>
    </div>
  );
}

export function LandingDocs() {
  const [active, setActive] = useState<SectionId>("getting-started");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section
      id="docs"
      className="mx-auto mb-32 max-w-7xl px-6 md:px-8"
      ref={ref}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-text-primary mb-1 text-2xl font-semibold">
          Documentation
        </h2>
        <p className="text-text-muted text-sm">
          Everything you need to use NexusDB Explorer effectively.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="flex flex-col gap-8 md:flex-row"
      >
        {/* Sticky nav */}
        <aside className="shrink-0 md:w-48">
          <nav className="flex flex-row gap-1 overflow-x-auto md:sticky md:top-24 md:flex-col">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setActive(s.id as SectionId)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors",
                  active === s.id
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-text-muted hover:text-text-primary",
                )}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-12">
          <GettingStarted />
          <FieldTypes />
          <Shortcuts />
          <QueryFormats />
          <ImportData />
        </div>
      </motion.div>
    </section>
  );
}
