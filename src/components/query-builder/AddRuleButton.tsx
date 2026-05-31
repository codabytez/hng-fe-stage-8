import { AddCircle } from "iconsax-reactjs";
import { cn } from "@/lib/utils";

interface AddButtonProps {
  onClick: () => void;
  label: string;
  size?: "sm" | "md";
  className?: string;
}

function AddButton({ onClick, label, size = "md", className }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border-border-subtle text-text-muted flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed transition-colors",
        "hover:border-accent hover:text-accent",
        size === "sm" ? "h-7.5 text-xs" : "h-9 text-sm",
        className,
      )}
    >
      <AddCircle size={size === "sm" ? 12 : 14} className="text-accent" />
      {label}
    </button>
  );
}

export function AddRuleButton({
  onClick,
  size,
}: {
  onClick: () => void;
  size?: "sm" | "md";
}) {
  return <AddButton onClick={onClick} label="Add Rule" size={size} />;
}

export function AddGroupButton({
  onClick,
  size,
}: {
  onClick: () => void;
  size?: "sm" | "md";
}) {
  return <AddButton onClick={onClick} label="Add Group" size={size} />;
}
