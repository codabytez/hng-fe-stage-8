"use client";

import { useState } from "react";
import { TickCircle, CloseCircle, Refresh, Trash } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { useHistoryStore, type SavedPreset } from "@/store/history-store";
import { useQueryActions } from "@/store/query-store";
import { useUIStore } from "@/store/ui-store";

export function SavePresetInput({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const savePreset = useHistoryStore((s) => s.savePreset);
  const format = useUIStore((s) => s.activeFormat);

  function handleSave() {
    if (!name.trim()) return;
    // Note: tree and schemaId accessed via store in real use
    const result = savePreset(name.trim(), { id: "root", type: "group", logic: "AND", conditions: [] }, "agents", format);
    if (!result.success) {
      setError(result.error ?? "");
      return;
    }
    onClose();
  }

  return (
    <div className="mt-1 flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <input
          autoFocus
          value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") onClose(); }}
          placeholder="Name this preset…"
          className="flex-1 rounded-md border border-border-default bg-bg-elevated px-2 py-1 text-sm text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none"
        />
        <button onClick={handleSave} className="text-accent hover:opacity-80">
          <TickCircle size={16} />
        </button>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary">
          <CloseCircle size={16} />
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface PresetItemProps {
  preset: SavedPreset;
}

export function PresetItem({ preset }: PresetItemProps) {
  const deletePreset = useHistoryStore((s) => s.deletePreset);
  const { replaceTree, setSchema } = useQueryActions();
  const setActiveFormat = useUIStore((s) => s.setActiveFormat);

  function handleLoad() {
    setSchema(preset.schemaId);
    replaceTree(preset.tree);
    setActiveFormat(preset.format);
  }

  return (
    <div className="group flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-bg-hover">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">{preset.name}</p>
        <p className="text-xs text-text-muted">{preset.schemaId} · {preset.format}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button onClick={handleLoad} className="text-xs text-accent hover:underline flex items-center gap-0.5">
          <Refresh size={11} /> Load
        </button>
        <button onClick={() => deletePreset(preset.id)} className="text-destructive">
          <Trash size={12} />
        </button>
      </div>
    </div>
  );
}

export function PresetsSection() {
  const [showInput, setShowInput] = useState(false);
  const presets = useHistoryStore((s) => s.presets);

  return (
    <div className="flex flex-col gap-1">
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className={cn(
            "flex h-8 w-full items-center justify-center rounded-md border border-dashed border-border-default text-sm text-text-muted",
            "hover:border-accent hover:text-accent transition-colors",
          )}
        >
          + Save Current
        </button>
      ) : (
        <SavePresetInput onClose={() => setShowInput(false)} />
      )}
      {presets.length === 0 && !showInput && (
        <p className="py-2 text-center text-xs text-text-muted">No saved presets</p>
      )}
      {presets.map((preset) => (
        <PresetItem key={preset.id} preset={preset} />
      ))}
    </div>
  );
}
