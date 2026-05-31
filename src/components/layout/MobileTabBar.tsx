"use client";

import { Cpu, Code } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

const TABS = [
  { id: "builder", label: "Builder", Icon: Cpu },
  { id: "preview", label: "Preview", Icon: Code },
] as const;

export function MobileTabBar() {
  const activeMobileTab = useUIStore((s) => s.activeMobileTab);
  const setActiveMobileTab = useUIStore((s) => s.setActiveMobileTab);

  return (
    <div className="flex shrink-0 border-b border-border-subtle bg-bg-surface md:hidden">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeMobileTab === id;
        return (
          <button
            key={id}
            onClick={() => setActiveMobileTab(id)}
            aria-pressed={isActive}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "border-b-2 border-accent text-accent"
                : "text-text-muted hover:text-text-secondary",
            )}
          >
            <Icon size={15} variant={isActive ? "Bold" : "Linear"} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
