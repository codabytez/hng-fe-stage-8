"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "iconsax-reactjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DateInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function DateInput({
  value,
  onChange,
  placeholder = "Pick a date…",
  className,
}: DateInputProps) {
  const [open, setOpen] = useState(false);
  const date = value ? new Date(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "border-border-default bg-bg-surface flex h-7.5 w-full items-center gap-2 rounded-md border px-2 text-sm",
            "focus:border-border-focus focus:ring-accent-muted focus:ring-2 focus:outline-none",
            value ? "text-text-primary" : "text-text-muted",
            className,
          )}
        >
          <CalendarIcon size={12} className="text-text-muted shrink-0" />
          {date ? format(date, "MMM dd, yyyy") : placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="border-border-default bg-bg-elevated w-auto p-0"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (d) {
              onChange(d.toISOString().split("T")[0]);
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
