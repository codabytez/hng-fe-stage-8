"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface RegexInputProps {
  value: string;
  onChange: (v: string) => void;
}

export function RegexInput({ value, onChange }: RegexInputProps) {
  const [isValid, setIsValid] = useState(true);

  function handleChange(v: string) {
    onChange(v);
    try {
      new RegExp(v);
      setIsValid(true);
    } catch {
      setIsValid(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-0.5">
      <div className="flex h-[30px] items-center rounded-md border border-border-default bg-bg-surface px-2 gap-1.5 focus-within:border-border-focus focus-within:ring-2 focus-within:ring-accent-muted">
        <span className="shrink-0 text-xs text-text-muted font-mono">/</span>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="regex pattern…"
          className={cn(
            "flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-text-muted",
            isValid ? "text-text-primary" : "text-destructive",
          )}
        />
        <span className="shrink-0 text-xs text-text-muted font-mono">/</span>
      </div>
      {!isValid && (
        <p className="text-2xs text-destructive">Invalid regex pattern</p>
      )}
    </div>
  );
}
