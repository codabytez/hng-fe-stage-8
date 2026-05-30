import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin rounded-full border-2 border-border-strong border-t-accent",
        sizes[size],
        className,
      )}
    />
  );
}
