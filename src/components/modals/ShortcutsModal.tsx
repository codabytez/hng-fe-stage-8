"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Kbd } from "@/components/shared/Kbd";
import { useUIStore } from "@/store/ui-store";
import { SHORTCUTS } from "@/hooks/useKeyboardShortcuts";

export function ShortcutsModal() {
  const open = useUIStore((s) => s.shortcutModalOpen);
  const setOpen = useUIStore((s) => s.setShortcutModalOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-border-default bg-bg-elevated max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text-primary">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1.5 mt-2">
          {SHORTCUTS.map((s) => (
            <div
              key={s.keys}
              className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-bg-hover"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">{s.label}</p>
                <p className="text-xs text-text-muted">{s.description}</p>
              </div>
              <div className="flex items-center gap-1">
                {s.keys.split("+").map((key, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-xs text-text-muted">+</span>}
                    <Kbd>{key}</Kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
