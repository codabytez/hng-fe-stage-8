"use client";

import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
  size?: "sm" | "md";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ tooltip, size = "md", className, children, ...props }, ref) => {
    const sizeClass = size === "sm" ? "h-5 w-5" : "h-6 w-6";

    const button = (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-sm text-text-muted transition-colors",
          "hover:bg-bg-hover hover:text-text-primary",
          "disabled:pointer-events-none disabled:opacity-40",
          "focus-visible:outline-2 focus-visible:outline-border-focus",
          sizeClass,
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );

    if (!tooltip) return button;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  },
);

IconButton.displayName = "IconButton";
