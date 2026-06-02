export function LandingFooter() {
  return (
    <footer className="border-border-subtle bg-bg-base border-t py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-8">
        <div className="text-center md:text-left">
          <span className="text-text-primary block text-base font-bold">
            NexusDB Explorer
          </span>
          <p className="text-text-muted mt-1 max-w-xs text-xs">
            Built for developers who value precision and speed. © 2026 NexusDB
            Explorer.
          </p>
        </div>
        <div className="flex items-center gap-6">
          {[
            {
              label: "GitHub",
              href: "https://github.com/codabytez/nexusdb-explorer",
            },
            { label: "Live App", href: "/app" },
            { label: "Docs", href: "/docs" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-text-muted hover:text-text-primary text-xs font-semibold tracking-widest transition-colors hover:underline"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>

      {/* Easter egg */}
      <div className="mt-6 text-center">
        <a
          href="/void"
          className="text-text-muted/30 hover:text-text-muted text-xs transition-colors"
        >
          -- SELECT * FROM pages WHERE path = &apos;/void&apos;{" "}
          <span className="text-destructive/40">→ 0 rows</span>
        </a>
      </div>
    </footer>
  );
}
