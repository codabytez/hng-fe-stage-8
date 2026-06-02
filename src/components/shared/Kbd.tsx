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
        "border-border-strong bg-bg-overlay text-text-muted rounded-sm border px-1.5 py-0.5 text-xs",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
