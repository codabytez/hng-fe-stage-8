import { SearchNormal1 } from "iconsax-reactjs";

export function ResultsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10">
      <SearchNormal1 size={32} className="text-text-muted" />
      <p className="text-md font-medium text-text-primary">No records matched</p>
      <p className="text-sm text-text-muted">Try adjusting your conditions</p>
    </div>
  );
}
