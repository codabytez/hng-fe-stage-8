"use client";

import { useState, useRef } from "react";
import { CloseCircle } from "iconsax-reactjs";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}

export function TagInput({
  value = [],
  onChange,
  placeholder = "Type value, press Enter…",
}: TagInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(raw: string) {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((v) => v !== tag));
  }

  return (
    <div
      className={cn(
        "border-border-default bg-bg-surface flex min-h-7.5 flex-1 flex-wrap items-center gap-1 rounded-md border px-2 py-1",
        "focus-within:border-border-focus focus-within:ring-accent-muted focus-within:ring-2",
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="border-border-default bg-bg-elevated text-text-primary flex items-center gap-0.5 rounded-sm border px-1.5 py-0.5 text-xs"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className="text-text-muted hover:text-destructive"
          >
            <CloseCircle size={10} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(input);
          } else if (e.key === "Backspace" && !input && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => {
          if (input.trim()) addTag(input);
        }}
        placeholder={value.length === 0 ? placeholder : ""}
        className="text-text-primary placeholder:text-text-muted min-w-24 flex-1 bg-transparent text-sm outline-none"
      />
    </div>
  );
}
