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
      <div className="border-border-default bg-bg-surface focus-within:border-border-focus focus-within:ring-accent-muted flex h-7.5 items-center gap-1.5 rounded-md border px-2 focus-within:ring-2">
        <span className="text-text-muted shrink-0 text-xs">/</span>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="regex pattern…"
          className={cn(
            "placeholder:text-text-muted flex-1 bg-transparent text-sm outline-none",
            isValid ? "text-text-primary" : "text-destructive",
          )}
        />
        <span className="text-text-muted shrink-0 text-xs">/</span>
      </div>
      {!isValid && (
        <p className="text-2xs text-destructive">Invalid regex pattern</p>
      )}
    </div>
  );
}
