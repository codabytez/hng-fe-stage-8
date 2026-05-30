import { cn } from "@/lib/utils";

interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function TextInput({
  value,
  onChange,
  placeholder = "Enter value…",
  className,
}: TextInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "border-border-default bg-bg-surface text-text-primary placeholder:text-text-muted h-7.5 w-full rounded-md border px-2 text-sm",
        "focus:border-border-focus focus:ring-accent-muted focus:ring-2 focus:outline-none",
        className,
      )}
    />
  );
}
