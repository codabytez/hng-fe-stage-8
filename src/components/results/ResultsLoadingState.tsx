import { Spinner } from "@/components/shared/Spinner";

export function ResultsLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10">
      <Spinner size="md" />
      <p className="text-sm text-text-muted">Executing query…</p>
    </div>
  );
}
