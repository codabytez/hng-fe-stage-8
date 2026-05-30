import { HamburgerMenu } from "iconsax-reactjs";
import { cn } from "@/lib/utils";

interface DragHandleProps {
  listeners?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  className?: string;
}

export function DragHandle({ listeners, attributes, className }: DragHandleProps) {
  return (
    <button
      type="button"
      aria-label="Drag to reorder"
      aria-roledescription="Draggable"
      className={cn(
        "flex cursor-grab items-center text-drag-handle active:cursor-grabbing",
        "opacity-0 transition-opacity group-hover/rule:opacity-100 group-hover/group:opacity-100",
        "hover:text-drag-handle-hover",
        className,
      )}
      {...(listeners as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      {...(attributes as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <HamburgerMenu size={14} />
    </button>
  );
}
