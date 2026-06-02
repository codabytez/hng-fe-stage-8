"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Element4 } from "iconsax-reactjs";

export function LandingPreview() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const rawRotateX = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const rotateX = useSpring(rawRotateX, { stiffness: 80, damping: 25 });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  return (
    <motion.section
      ref={sectionRef}
      className="mx-auto mb-32 max-w-7xl px-6 md:px-8"
      style={{ perspective: "1400px" }}
    >
      <motion.div
        style={{ rotateX, scale, opacity, transformOrigin: "center top" }}
        className="border-border-default overflow-hidden rounded-xl border"
      >
        {/* Browser chrome */}
        <div className="border-border-subtle bg-bg-elevated flex items-center gap-3 border-b px-4 py-3">
          <div className="flex gap-1.5">
            <span className="bg-destructive/70 h-3 w-3 rounded-full" />
            <span className="bg-warning/70 h-3 w-3 rounded-full" />
            <span className="bg-accent/70 h-3 w-3 rounded-full" />
          </div>
          <div className="bg-bg-surface text-text-muted flex-1 rounded-md px-4 py-1 text-center text-xs">
            nexusdbx.vercel.app/app
          </div>
        </div>

        {/* App layout mockup */}
        <div className="bg-bg-base grid h-120 grid-cols-1 md:grid-cols-[200px_1fr_280px]">
          {/* Sidebar */}
          <div className="border-border-subtle bg-bg-surface hidden border-r p-4 md:block">
            <div className="bg-bg-elevated mb-4 h-3 w-20 rounded" />
            <div className="space-y-2">
              {["Agents", "Cities", "Incidents"].map((s, i) => (
                <div
                  key={s}
                  className={`flex h-9 items-center gap-2 rounded-md px-3 text-xs ${i === 0 ? "bg-accent-subtle text-accent" : "text-text-muted"}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-accent" : "bg-border-default"}`} />
                  {s}
                </div>
              ))}
            </div>
            <div className="bg-border-subtle mt-6 h-px" />
            <div className="bg-bg-elevated mt-4 mb-2 h-2.5 w-16 rounded" />
            {[1, 2].map((i) => (
              <div key={i} className="bg-bg-elevated mt-2 h-7 w-full rounded" />
            ))}
          </div>

          {/* Query builder canvas */}
          <div className="relative overflow-hidden p-6">
            <div className="relative z-10 mx-auto max-w-md">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-text-muted text-xs font-semibold tracking-widest">QUERY BUILDER</span>
                <div className="flex gap-1">
                  {["AND", "OR"].map((l, i) => (
                    <span
                      key={l}
                      className={`rounded px-2 py-0.5 text-xs font-semibold ${i === 0 ? "bg-accent text-white" : "bg-bg-elevated text-text-muted"}`}
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {[
                { field: "clearanceLevel", op: ">", val: "5" },
                { field: "codename", op: "contains", val: '"Project"' },
                { field: "activeStatus", op: "=", val: "true" },
              ].map((rule, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
                  className={`bg-bg-surface mb-2 flex items-center gap-2 rounded-md border px-3 py-2 ${i === 0 ? "border-accent/40" : "border-border-default"} ${i > 0 ? "ml-6" : ""}`}
                >
                  <Element4 size={12} className="text-text-muted shrink-0" />
                  <span className="text-text-accent text-xs">{rule.field}</span>
                  <span className="text-text-muted text-xs">{rule.op}</span>
                  <span className="text-warning text-xs">{rule.val}</span>
                </motion.div>
              ))}

              <div className="mt-3 flex gap-2">
                <button className="border-border-default text-text-muted hover:border-accent hover:text-accent flex-1 rounded-md border border-dashed py-1.5 text-xs transition-colors">
                  + Add Rule
                </button>
                <button className="border-border-default text-text-muted hover:border-accent hover:text-accent flex-1 rounded-md border border-dashed py-1.5 text-xs transition-colors">
                  + Add Group
                </button>
              </div>
            </div>
          </div>

          {/* Preview panel */}
          <div className="border-border-subtle bg-bg-surface hidden border-l p-4 md:block">
            <div className="bg-bg-elevated mb-3 flex gap-1 rounded-md p-1">
              {["SQL", "MongoDB", "GraphQL"].map((t, i) => (
                <span
                  key={t}
                  className={`flex-1 rounded-sm py-1 text-center text-xs font-medium ${i === 0 ? "bg-bg-surface text-text-primary" : "text-text-muted"}`}
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="bg-bg-base rounded-md p-3 text-xs leading-relaxed">
              <span className="text-code-keyword">SELECT</span>
              <span className="text-code-text"> * </span>
              <span className="text-code-keyword">FROM</span>
              <span className="text-code-field"> agents{"\n"}</span>
              <span className="text-code-keyword">WHERE</span>
              <span className="text-code-field"> clearanceLevel</span>
              <span className="text-code-operator"> &gt; </span>
              <span className="text-code-number">5{"\n"}</span>
              <span className="text-code-keyword">AND</span>
              <span className="text-code-text"> ({"\n"} </span>
              <span className="text-code-field">codename</span>
              <span className="text-code-keyword"> LIKE </span>
              <span className="text-code-string">&#39;%Project%&#39;{"\n"}</span>
              <span className="text-code-text">)</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
