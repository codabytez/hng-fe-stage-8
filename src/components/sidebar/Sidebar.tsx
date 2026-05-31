"use client";

import { Data, Clock, ArchiveBook } from "iconsax-reactjs";
import { SidebarSection } from "./SidebarSection";
import { SchemaCard } from "./SchemaCard";
import { HistorySection } from "./HistoryItem";
import { PresetsSection } from "./PresetItem";

export function Sidebar() {
  return (
    <aside
      aria-label="Sidebar navigation"
      className="flex h-full w-60 shrink-0 flex-col overflow-y-auto border-r border-border-subtle bg-bg-surface px-3 py-4"
    >
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
    </aside>
  );
}
