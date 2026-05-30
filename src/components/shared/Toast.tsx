"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CloseCircle } from "iconsax-reactjs";

export interface ToastData {
  id: string;
  message: string;
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
}

interface ToastProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

export function Toast({ toast, onRemove }: ToastProps) {
  const { id: toastId, onDismiss } = toast;
  const duration = toast.duration ?? 4000;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        onRemove(toastId);
        onDismiss?.();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [toastId, onDismiss, duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="relative w-80 overflow-hidden rounded-md border border-border-default bg-bg-elevated shadow-modal"
    >
      <div className="flex items-start justify-between gap-3 p-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-primary">{toast.message}</p>
          {toast.description && (
            <p className="mt-0.5 text-xs text-text-muted">{toast.description}</p>
          )}
          {toast.action && (
            <button
              onClick={() => { toast.action!.onClick(); onRemove(toast.id); }}
              className="mt-2 text-xs font-medium text-accent hover:underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button onClick={() => onRemove(toast.id)} className="text-text-muted hover:text-text-primary">
          <CloseCircle size={14} />
        </button>
      </div>
      <div
        className="absolute bottom-0 left-0 h-1 bg-accent transition-none"
        style={{ width: `${progress}%` }}
      />
    </motion.div>
  );
}
