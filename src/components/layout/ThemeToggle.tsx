"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "iconsax-react";
import { cn } from "@/lib/utils";
import { IconButton } from "../shared/IconButton";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center">
      <IconButton
        tooltip="Light mode"
        aria-label="Light mode"
        onClick={() => setTheme("light")}
        className={cn(theme === "light" && "bg-bg-elevated text-accent")}
      >
        <Sun size={14} />
      </IconButton>
      <IconButton
        tooltip="Dark mode"
        aria-label="Dark mode"
        onClick={() => setTheme("dark")}
        className={cn(theme === "dark" && "bg-bg-elevated text-accent")}
      >
        <Moon size={14} />
      </IconButton>
      <IconButton
        tooltip="System theme"
        aria-label="System theme"
        onClick={() => setTheme("system")}
        className={cn(theme === "system" && "bg-bg-elevated text-accent")}
      >
        <Monitor size={14} />
      </IconButton>
    </div>
  );
}
