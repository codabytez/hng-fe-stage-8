import { cn } from "@/lib/utils";

interface NumberInputProps {
  value: number | string;
  onChange: (v: number | string) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
}

export function NumberInput({ value, onChange, min, max, placeholder = "Enter number…", className }: NumberInputProps) {
  return (
    <input
      type="number"
      value={value === null || value === undefined ? "" : value}
      onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      min={min}
      max={max}
      placeholder={placeholder}
      className={cn(
        "h-[30px] w-full rounded-md border border-border-default bg-bg-surface px-2 font-mono text-sm text-text-primary placeholder:text-text-muted",
        "focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-accent-muted",
        className,
      )}
    />
  );
}
