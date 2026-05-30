import { NumberInput } from "./NumberInput";

interface NumberRangeInputProps {
  value: [number | string, number | string];
  onChange: (v: [number | string, number | string]) => void;
  min?: number;
  max?: number;
}

export function NumberRangeInput({ value, onChange, min, max }: NumberRangeInputProps) {
  const [a, b] = value ?? ["", ""];
  return (
    <div className="flex flex-1 items-center gap-1.5">
      <NumberInput
        value={a}
        onChange={(v) => onChange([v, b])}
        min={min}
        max={max}
        placeholder="Min"
      />
      <span className="shrink-0 text-text-muted">—</span>
      <NumberInput
        value={b}
        onChange={(v) => onChange([a, v])}
        min={min}
        max={max}
        placeholder="Max"
      />
    </div>
  );
}
