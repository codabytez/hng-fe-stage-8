"use client";

import { useState } from "react";
import {
  ArrowDown2,
  SearchNormal1,
  TextalignLeft,
  Hashtag,
  RowHorizontal,
  ToggleOffCircle,
  CalendarEdit,
  Bezier,
} from "iconsax-reactjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { SchemaField, FieldType } from "@/lib/query-engine/types";

const TYPE_ICONS: Record<FieldType, React.ReactNode> = {
  string: <TextalignLeft size={10} className="text-text-muted" />,
  number: <Hashtag size={10} className="text-accent-2" />,
  enum: <RowHorizontal size={10} className="text-warning" />,
  boolean: <ToggleOffCircle size={10} className="text-success" />,
  date: <CalendarEdit size={10} className="text-info" />,
  array: <Bezier size={10} className="text-accent" />,
};

const TYPE_LABELS: Record<FieldType, string> = {
  string: "text",
  number: "#",
  enum: "≡",
  boolean: "⏻",
  date: "date",
  array: "[]",
};

interface RuleFieldProps {
  value: string | null;
  onChange: (field: string) => void;
  fields: SchemaField[];
}

export function RuleField({ value, onChange, fields }: RuleFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = fields.find((f) => f.name === value);
  const filtered = fields.filter(
    (f) =>
      f.label.toLowerCase().includes(search.toLowerCase()) ||
      f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "border-border-default bg-bg-surface flex h-7.5 w-40 shrink-0 items-center justify-between gap-1 rounded-md border px-2 text-sm transition-colors",
            open ? "border-accent" : "hover:border-border-strong",
            selected ? "text-text-primary" : "text-text-muted",
          )}
          aria-label="Select field"
        >
          <span className="flex items-center gap-1.5 truncate">
            {selected && TYPE_ICONS[selected.type]}
            <span className="truncate">
              {selected?.label ?? "Select field…"}
            </span>
          </span>
          <ArrowDown2 size={10} className="text-text-muted shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="border-border-default bg-bg-elevated w-56 p-1"
        align="start"
      >
        <div className="border-border-default bg-bg-surface mb-1 flex items-center gap-1 rounded-md border px-2 py-1">
          <SearchNormal1 size={11} className="text-text-muted" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fields…"
            className="text-text-primary placeholder:text-text-muted flex-1 bg-transparent text-xs outline-none"
          />
        </div>
        <div className="max-h-52 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-text-muted py-2 text-center text-xs">
              No fields found
            </p>
          )}
          {filtered.map((field) => (
            <button
              key={field.name}
              onClick={() => {
                onChange(field.name);
                setOpen(false);
                setSearch("");
              }}
              className={cn(
                "hover:bg-bg-hover flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm",
                value === field.name
                  ? "bg-accent-subtle text-accent"
                  : "text-text-primary",
              )}
            >
              <span className="flex items-center gap-2">
                {TYPE_ICONS[field.type]}
                {field.label}
              </span>
              <span className="text-2xs text-text-muted">
                {TYPE_LABELS[field.type]}
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
