import { cn } from "@/lib/utils";

interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function TextInput({ value, onChange, placeholder = "Enter value…", className }: TextInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "h-[30px] w-full rounded-md border border-border-default bg-bg-surface px-2 text-sm text-text-primary placeholder:text-text-muted",
        "focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-accent-muted",
        className,
      )}
    />
  );
}
