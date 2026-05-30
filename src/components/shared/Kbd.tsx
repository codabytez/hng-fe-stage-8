import { cn } from "@/lib/utils";

export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "rounded-sm border border-border-strong bg-bg-overlay px-1.5 py-0.5 font-mono text-xs text-text-muted",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
