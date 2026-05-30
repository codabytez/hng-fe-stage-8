"use client";

import { useState } from "react";
import { ArrowRight2 } from "iconsax-react";
import { motion, AnimatePresence } from "motion/react";


interface SidebarSectionProps {
  title: string;
  defaultOpen?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function SidebarSection({
  title,
  defaultOpen = true,
  action,
  children,
}: SidebarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-1.5 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-1.5">
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-text-muted"
          >
            <ArrowRight2 size={10} />
          </motion.span>
          <span className="text-2xs font-medium uppercase tracking-widest text-text-muted">
            {title}
          </span>
        </div>
        {action && <span onClick={(e) => e.stopPropagation()}>{action}</span>}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-2 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="my-3 border-t border-border-subtle" />
    </div>
  );
}
