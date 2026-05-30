import type { Variants } from "motion/react";

type BezierEase = [number, number, number, number];

const EASE: BezierEase = [0.4, 0, 0.2, 1];
const EASE_IN: BezierEase = [0.4, 0, 1, 1];

export const ANIMATION = {
  fast: 0.1,
  normal: 0.2,
  medium: 0.3,
  slow: 0.5,
  ease: EASE,
  spring: { type: "spring", stiffness: 400, damping: 30 } as const,
  bounce: { type: "spring", stiffness: 600, damping: 20 } as const,
} as const;

export const ruleVariants: Variants = {
  hidden: { opacity: 0, height: 0, y: -8 },
  visible: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: { duration: 0.2, ease: EASE },
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -4,
    transition: { duration: 0.15, ease: EASE_IN },
  },
};

export const groupVariants: Variants = {
  hidden: { opacity: 0, height: 0, y: -12 },
  visible: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: { duration: 0.25, ease: EASE },
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -8,
    transition: { duration: 0.2, ease: EASE_IN },
  },
};

export const groupBodyVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.25, ease: EASE },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.25, ease: EASE },
  },
};

const DEPTH_COLORS = [
  "var(--depth-0)",
  "var(--depth-1)",
  "var(--depth-2)",
  "var(--depth-3)",
  "var(--depth-4plus)",
] as const;

export function getDepthColor(depth: number): string {
  return DEPTH_COLORS[Math.min(depth, 4)];
}
