"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Copy, TickCircle } from "iconsax-reactjs";
import { cn } from "@/lib/utils";

const SCHEMAS = {
  Agents: {
    fields: [
      { name: "codename", type: "String" },
      { name: "clearanceLevel", type: "Integer" },
      { name: "activeStatus", type: "Boolean" },
      { name: "lastSeen", type: "Timestamp" },
      { name: "region", type: "Enum" },
      { name: "missionsCompleted", type: "Integer" },
      { name: "languages", type: "Array" },
    ],
    sql: `SELECT * FROM agents
WHERE clearanceLevel > 5
AND (
  codename LIKE '%Project%'
  OR activeStatus = true
)
ORDER BY lastSeen DESC;`,
  },
  Cities: {
    fields: [
      { name: "name", type: "String" },
      { name: "country", type: "String" },
      { name: "population", type: "Integer" },
      { name: "crimeIndex", type: "Float" },
      { name: "governmentType", type: "Enum" },
      { name: "isCapital", type: "Boolean" },
      { name: "founded", type: "Timestamp" },
    ],
    sql: `SELECT * FROM cities
WHERE population > 1000000
AND crimeIndex < 40
AND isCapital = true
ORDER BY population DESC;`,
  },
  Incidents: {
    fields: [
      { name: "title", type: "String" },
      { name: "severity", type: "Enum" },
      { name: "reportedAt", type: "Timestamp" },
      { name: "status", type: "Enum" },
      { name: "isEscalated", type: "Boolean" },
      { name: "responseTime", type: "Float" },
      { name: "affectedSystems", type: "Array" },
    ],
    sql: `SELECT * FROM incidents
WHERE severity IN ('high', 'critical')
AND isEscalated = true
AND responseTime > 30
ORDER BY reportedAt DESC;`,
  },
} as const;

type SchemaKey = keyof typeof SCHEMAS;

const TYPE_COLORS: Record<string, string> = {
  String: "text-code-string",
  Integer: "text-code-number",
  Float: "text-code-number",
  Boolean: "text-accent-2",
  Timestamp: "text-warning",
  Enum: "text-code-keyword",
  Array: "text-code-field",
};

export function LandingSchemas() {
  const [active, setActive] = useState<SchemaKey>("Agents");
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const schema = SCHEMAS[active];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(schema.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section
      id="schemas"
      className="mx-auto mb-32 max-w-7xl px-6 md:px-8"
      ref={ref}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h2 className="text-text-primary mb-1 text-2xl font-semibold">
            Intelligent Schemas
          </h2>
          <p className="text-text-muted text-sm">
            Explore how NexusDB handles different data models.
          </p>
        </div>
        <div className="border-border-default bg-bg-elevated flex gap-1 rounded-lg border p-1">
          {(Object.keys(SCHEMAS) as SchemaKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                "rounded-md px-4 py-1.5 text-xs font-semibold tracking-widest transition-all",
                active === key
                  ? "bg-accent text-white"
                  : "text-text-muted hover:text-text-secondary",
              )}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          {/* Field list */}
          <div className="border-border-default bg-bg-surface rounded-xl border p-6">
            <h4 className="text-text-muted mb-4 text-xs font-semibold tracking-widest">
              FIELD MANIFEST
            </h4>
            <ul className="space-y-3">
              {schema.fields.map((f, i) => (
                <motion.li
                  key={f.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="border-border-subtle flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <code
                    className={`text-sm ${TYPE_COLORS[f.type] ?? "text-text-primary"}`}
                  >
                    {f.name}
                  </code>
                  <span className="border-border-default bg-bg-elevated text-text-muted rounded border px-2 py-0.5 text-xs">
                    {f.type}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* SQL output */}
          <div className="border-border-default bg-bg-base relative overflow-hidden rounded-xl border p-6">
            {/* Scanning line */}
            <motion.div
              className="pointer-events-none absolute inset-x-0 h-10"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(196,98,45,0.1), transparent)" }}
              animate={{ top: ["8%", "88%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "linear", repeatDelay: 0.6 }}
            />
            <button
              onClick={handleCopy}
              className="text-text-muted hover:text-text-primary absolute top-4 right-4 flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors"
            >
              {copied ? (
                <TickCircle size={14} className="text-success" />
              ) : (
                <Copy size={14} />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <h4 className="text-text-muted mb-4 text-xs font-semibold tracking-widest">
              GENERATED SQL
            </h4>
            <pre className="text-sm leading-relaxed whitespace-pre-wrap">
              {schema.sql.split("\n").map((line, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.1 + i * 0.05 }}
                  className="block"
                >
                  {line.split(/\b/).map((token, j) => {
                    if (
                      /^(SELECT|FROM|WHERE|AND|OR|IN|LIKE|ORDER BY|DESC|true|false)$/.test(
                        token,
                      )
                    )
                      return (
                        <span key={j} className="text-code-keyword">
                          {token}
                        </span>
                      );
                    if (/^'.*'$/.test(token))
                      return (
                        <span key={j} className="text-code-string">
                          {token}
                        </span>
                      );
                    if (/^\d+$/.test(token))
                      return (
                        <span key={j} className="text-code-number">
                          {token}
                        </span>
                      );
                    if (
                      /^(agents|cities|incidents|clearanceLevel|codename|activeStatus|lastSeen|population|crimeIndex|isCapital|severity|isEscalated|responseTime|reportedAt|name|country|founded|title|status|region|missionsCompleted|languages|affectedSystems|governmentType)$/.test(
                        token,
                      )
                    )
                      return (
                        <span key={j} className="text-code-field">
                          {token}
                        </span>
                      );
                    return (
                      <span key={j} className="text-code-text">
                        {token}
                      </span>
                    );
                  })}
                </motion.span>
              ))}
            </pre>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
