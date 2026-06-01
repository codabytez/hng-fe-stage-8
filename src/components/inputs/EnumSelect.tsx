"use client";

import { useState } from "react";
import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface EnumSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
}

export function EnumSelect({
  value,
  onChange,
  options,
  placeholder = "Select value…",
}: EnumSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "border-border-default bg-bg-surface flex h-7.5 w-full items-center justify-between gap-1 rounded-md border px-2 text-sm",
            "focus:border-border-focus focus:ring-accent-muted focus:ring-2 focus:outline-none",
            open ? "border-accent" : "",
            value ? "text-text-primary" : "text-text-muted",
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ArrowDown2 size={10} className="text-text-muted shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="border-border-default bg-bg-elevated w-48 p-1"
        align="start"
      >
        <div className="border-border-default bg-bg-surface mb-1 flex items-center gap-1 rounded-md border px-2 py-1">
          <SearchNormal1 size={11} className="text-text-muted shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="text-text-primary placeholder:text-text-muted flex-1 bg-transparent text-xs outline-none focus:outline-none focus-visible:outline-none"
          />
        </div>
        <div className="max-h-48 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-text-muted py-2 text-center text-xs">
              No results
            </p>
          )}
          {filtered.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
                setSearch("");
              }}
              className={cn(
                "text-text-primary hover:bg-bg-hover flex w-full items-center rounded-sm px-2 py-1 text-sm",
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
