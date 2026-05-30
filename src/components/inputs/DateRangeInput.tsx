import { DateInput } from "./DateInput";

interface DateRangeInputProps {
  value: [string, string];
  onChange: (v: [string, string]) => void;
}

export function DateRangeInput({ value, onChange }: DateRangeInputProps) {
  const [a, b] = value ?? ["", ""];
  return (
    <div className="flex flex-1 items-center gap-1.5">
      <DateInput value={a} onChange={(v) => onChange([v, b])} placeholder="Start date" />
      <span className="shrink-0 text-text-muted">—</span>
      <DateInput value={b} onChange={(v) => onChange([a, v])} placeholder="End date" />
    </div>
  );
}
