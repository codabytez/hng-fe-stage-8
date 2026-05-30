import { cn } from "@/lib/utils";

interface NumberInputProps {
  value: number | string;
  onChange: (v: number | string) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  placeholder = "Enter number…",
  className,
}: NumberInputProps) {
  return (
    <input
      type="number"
      value={value === null || value === undefined ? "" : value}
      onChange={(e) =>
        onChange(e.target.value === "" ? "" : Number(e.target.value))
      }
      min={min}
      max={max}
      placeholder={placeholder}
      className={cn(
        "border-border-default bg-bg-surface text-text-primary placeholder:text-text-muted h-7.5 w-full rounded-md border px-2 font-mono text-sm",
        "focus:border-border-focus focus:ring-accent-muted focus:ring-2 focus:outline-none",
        className,
      )}
    />
  );
}
