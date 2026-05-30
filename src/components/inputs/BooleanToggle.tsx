import { Switch } from "@/components/ui/switch";

interface BooleanToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

export function BooleanToggle({ value, onChange }: BooleanToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={value} onCheckedChange={onChange} />
      <span className="text-sm text-text-secondary">{value ? "true" : "false"}</span>
    </div>
  );
}
