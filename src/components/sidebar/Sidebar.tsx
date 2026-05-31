"use client";

import {
  Data, Clock, ArchiveBook,
  UserTag, Buildings, Flash,
  ArrowLeft2,
} from "iconsax-reactjs";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SidebarSection } from "./SidebarSection";
import { SchemaCard } from "./SchemaCard";
import { HistorySection } from "./HistoryItem";
import { PresetsSection } from "./PresetItem";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useUIStore } from "@/store/ui-store";
import { useQueryStore, useQueryActions } from "@/store/query-store";

const SCHEMAS = [
  { id: "agents", label: "Agents", Icon: UserTag },
  { id: "cities", label: "Cities", Icon: Buildings },
  { id: "incidents", label: "Incidents", Icon: Flash },
] as const;

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <aside
      id="app-sidebar"
      aria-label="Sidebar navigation"
      className="flex h-full flex-col overflow-hidden border-r border-border-subtle bg-bg-surface"
    >
      <AnimatePresence initial={false} mode="wait">
        {sidebarOpen ? (
          <motion.div
            key="full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-1 flex-col overflow-y-auto"
          >
            {/* Logo row — h-14 aligns with the Header on the right */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-subtle px-4">
              <div className="flex items-center gap-2.5">
                <HexLogo />
                <div className="flex flex-col leading-none">
                  <span className="font-mono text-base font-bold text-text-primary">NexusDB</span>
                  <span className="text-xs text-text-muted">Explorer</span>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleSidebar}
                    aria-label="Collapse sidebar"
                    className="rounded-md p-1 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-secondary"
                  >
                    <ArrowLeft2 size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Collapse sidebar</TooltipContent>
              </Tooltip>
            </div>

            {/* Sections */}
            <div className="flex flex-col px-3 pb-4">
              <SidebarSection
                title="Schema"
                defaultOpen
                action={<Data size={12} className="text-text-muted" />}
              >
                <SchemaCard />
              </SidebarSection>

              <SidebarSection
                title="History"
                defaultOpen
                action={<Clock size={12} className="text-text-muted" />}
              >
                <HistorySection />
              </SidebarSection>

              <SidebarSection
                title="Presets"
                defaultOpen
                action={<ArchiveBook size={12} className="text-text-muted" />}
              >
                <PresetsSection />
              </SidebarSection>
            </div>
          </motion.div>
        ) : (
          <CollapsedRail onExpand={toggleSidebar} />
        )}
      </AnimatePresence>
    </aside>
  );
}

function CollapsedRail({ onExpand }: { onExpand: () => void }) {
  const schemaId = useQueryStore((s) => s.schemaId);
  const { setSchema } = useQueryActions();

  return (
    <motion.div
      key="rail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex flex-1 flex-col items-center"
    >
      {/* Logo icon — h-14 aligns with the Header on the right, click to expand */}
      <div className="flex h-14 w-full shrink-0 items-center justify-center border-b border-border-subtle">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onExpand}
              aria-label="Expand sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-bg-elevated"
            >
              <HexLogo />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Expand sidebar</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-col items-center gap-1 py-3">
        <div className="my-1 w-6 border-t border-border-subtle" />

        {/* Schema icons */}
        {SCHEMAS.map(({ id, label, Icon }) => {
          const isActive = schemaId === id;
          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSchema(id)}
                  aria-label={label}
                  aria-pressed={isActive}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
                    isActive
                      ? "bg-accent-subtle text-accent"
                      : "text-text-muted hover:bg-bg-elevated hover:text-text-secondary",
                  )}
                >
                  <Icon size={18} variant={isActive ? "Bold" : "Linear"} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          );
        })}

        <div className="my-1 w-6 border-t border-border-subtle" />

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              aria-label="History"
              className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-secondary"
            >
              <Clock size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">History</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              aria-label="Presets"
              className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-secondary"
            >
              <ArchiveBook size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Presets</TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
}

function HexLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 1.5L17.794 6V14L10 18.5L2.206 14V6L10 1.5Z"
        fill="var(--accent)"
        fillOpacity="0.2"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <path
        d="M10 5.5L14.5 8V13L10 15.5L5.5 13V8L10 5.5Z"
        fill="var(--accent)"
      />
    </svg>
  );
}
