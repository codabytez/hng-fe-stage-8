export default function Loading() {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Sidebar skeleton */}
      <div className="hidden w-60 shrink-0 border-r border-border-subtle bg-bg-surface lg:block">
        <div className="flex h-14 items-center gap-3 border-b border-border-subtle px-4">
          <div className="h-5 w-5 animate-pulse rounded bg-bg-elevated" />
          <div className="h-4 w-24 animate-pulse rounded bg-bg-elevated" />
        </div>
        <div className="space-y-3 p-4">
          {[80, 60, 72, 48].map((w) => (
            <div key={w} className="h-8 animate-pulse rounded-md bg-bg-elevated" style={{ width: `${w}%` }} />
          ))}
          <div className="mt-6 h-px bg-border-subtle" />
          {[90, 70, 55].map((w) => (
            <div key={w} className="h-7 animate-pulse rounded-md bg-bg-elevated" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header skeleton */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-subtle bg-bg-surface px-5">
          <div className="h-8 w-8 animate-pulse rounded-md bg-bg-elevated lg:hidden" />
          <div className="h-8 w-56 animate-pulse rounded-full bg-bg-elevated" />
          <div className="h-7 w-24 animate-pulse rounded-md bg-bg-elevated" />
        </div>

        {/* Builder + preview */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Query builder skeleton */}
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-5">
            <div className="h-6 w-32 animate-pulse rounded bg-bg-elevated" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-md border border-border-subtle bg-bg-surface" />
            ))}
            <div className="mt-2 h-8 w-28 animate-pulse rounded-md bg-bg-elevated" />
          </div>

          {/* Preview panel skeleton */}
          <div className="hidden w-90 shrink-0 border-l border-border-subtle bg-bg-surface p-4 lg:block">
            <div className="mb-4 h-5 w-28 animate-pulse rounded bg-bg-elevated" />
            <div className="mb-4 h-9 w-full animate-pulse rounded-md bg-bg-elevated" />
            <div className="h-64 w-full animate-pulse rounded-md bg-bg-elevated" />
          </div>
        </div>

        {/* Results drawer skeleton */}
        <div className="h-10 shrink-0 border-t border-border-subtle bg-bg-surface px-4">
          <div className="flex h-full items-center gap-3">
            <div className="h-3 w-20 animate-pulse rounded bg-bg-elevated" />
            <div className="h-3 w-12 animate-pulse rounded bg-bg-elevated" />
          </div>
        </div>
      </div>
    </div>
  );
}
