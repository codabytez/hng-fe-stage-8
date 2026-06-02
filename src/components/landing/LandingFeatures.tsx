"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { Hierarchy, ExportSquare, Data, Element4, Clock, ShieldTick, KeySquare } from "iconsax-reactjs";

const FEATURES = [
  {
    icon: Hierarchy,
    title: "Unlimited nesting depth",
    description: "Build condition hierarchies as deep as your data requires without any performance degradation.",
    span: "md:col-span-3",
    size: "large",
  },
  {
    icon: ExportSquare,
    title: "Triple query output",
    description: "Export to raw SQL, MongoDB BSON, or GraphQL fragments with a single click.",
    span: "md:col-span-3",
    size: "large",
  },
  {
    icon: Data,
    title: "Schema-driven inputs",
    description: "Dynamic UI generation based on your data schema — date pickers, enum dropdowns, number ranges.",
    span: "md:col-span-2",
    size: "small",
  },
  {
    icon: Element4,
    title: "Drag & drop",
    description: "Reorder logic blocks visually to re-prioritize query execution.",
    span: "md:col-span-2",
    size: "small",
  },
  {
    icon: Clock,
    title: "Undo / redo",
    description: "Full state history tracking — 50 steps deep — for complex experimentation.",
    span: "md:col-span-2",
    size: "small",
  },
  {
    icon: ShieldTick,
    title: "Validation engine",
    description: "Catches type mismatches, empty groups, and invalid ranges before you run.",
    span: "md:col-span-3",
    size: "large",
  },
  {
    icon: KeySquare,
    title: "Keyboard shortcuts",
    description: "Ctrl+Z, Ctrl+Enter, Ctrl+Shift+E — full keyboard workflow for power users.",
    span: "md:col-span-3",
    size: "large",
  },
] as const;

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rawRotateX = useTransform(mouseY, [0, 1], [6, -6]);
  const rawRotateY = useTransform(mouseX, [0, 1], [-6, 6]);
  const rotateX = useSpring(rawRotateX, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(rawRotateY, { stiffness: 300, damping: 30 });

  const glowX = useTransform(mouseX, [0, 1], [0, 100]);
  const glowY = useTransform(mouseY, [0, 1], [0, 100]);
  const glowBg = useMotionTemplate`radial-gradient(220px circle at ${glowX}% ${glowY}%, rgba(196,98,45,0.14), transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {/* Cursor spotlight glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glowBg }}
      />
      {children}
    </motion.div>
  );
}

export function LandingFeatures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="mx-auto mb-32 max-w-7xl px-6 md:px-8" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="mb-2 text-2xl font-semibold text-text-primary"
      >
        Core Architecture
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.06 }}
        className="mb-8 text-sm text-text-muted"
      >
        Everything you need to build complex queries without writing a single line of syntax.
      </motion.p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-6" style={{ perspective: "1000px" }}>
        {FEATURES.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
              className={feat.span}
              style={{ perspective: "800px" }}
            >
              <TiltCard className="group relative flex h-56 w-full flex-col overflow-hidden rounded-xl border border-border-default bg-bg-surface p-6 transition-colors duration-300 hover:border-accent/50">
                {feat.size === "large" && (
                  <div className="pointer-events-none absolute right-4 top-4 opacity-[0.07] transition-opacity duration-300 group-hover:opacity-20">
                    <Icon size={96} className="text-accent" />
                  </div>
                )}
                {feat.size === "small" ? (
                  <>
                    <Icon size={32} className="mb-4 text-text-secondary transition-colors duration-300 group-hover:text-accent" />
                    <div className="mt-auto">
                      <h3 className="mb-1 text-base font-semibold text-text-primary">{feat.title}</h3>
                      <p className="text-xs text-text-muted">{feat.description}</p>
                    </div>
                  </>
                ) : (
                  <div className="mt-auto">
                    <h3 className="mb-1.5 text-base font-semibold text-accent">{feat.title}</h3>
                    <p className="text-sm text-text-muted">{feat.description}</p>
                  </div>
                )}
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
