"use client";

import { useState } from "react";
import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface EnumSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
}

export function EnumSelect({ value, onChange, options, placeholder = "Select value…" }: EnumSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex h-[30px] w-full items-center justify-between gap-1 rounded-md border border-border-default bg-bg-surface px-2 text-sm",
            "focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-accent-muted",
            open ? "border-accent" : "",
            value ? "text-text-primary" : "text-text-muted",
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ArrowDown2 size={10} className="shrink-0 text-text-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 border-border-default bg-bg-elevated p-1" align="start">
        <div className="flex items-center gap-1 rounded-md border border-border-default bg-bg-surface px-2 py-1 mb-1">
          <SearchNormal1 size={11} className="text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted outline-none"
          />
        </div>
        <div className="max-h-48 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="py-2 text-center text-xs text-text-muted">No results</p>
          )}
          {filtered.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); setSearch(""); }}
              className={cn(
                "flex w-full items-center rounded-sm px-2 py-1 text-sm text-text-primary hover:bg-bg-hover",
                value === opt && "bg-accent-subtle text-accent",
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
