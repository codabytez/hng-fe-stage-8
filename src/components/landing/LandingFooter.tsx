export function LandingFooter() {
  return (
    <footer className="border-t border-border-subtle bg-bg-base py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-8">
        <div className="text-center md:text-left">
          <span className="block font-mono text-base font-bold text-text-primary">NexusDB Explorer</span>
          <p className="mt-1 max-w-xs text-xs text-text-muted">
            Built for developers who value precision and speed. © 2026 NexusDB Explorer.
          </p>
        </div>
        <div className="flex items-center gap-6">
          {[
            { label: "GitHub", href: "https://github.com/codabytez/hng-fe-stage-8" },
            { label: "Live App", href: "/app" },
            { label: "README", href: "https://github.com/codabytez/hng-fe-stage-8#readme" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-mono text-xs font-semibold tracking-widest text-text-muted transition-colors hover:text-text-primary hover:underline"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
