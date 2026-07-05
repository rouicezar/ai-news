import type { LucideIcon } from "lucide-react";

interface MetricButtonProps {
  icon: LucideIcon;
  label: string;
  count: number;
  selected?: boolean;
  onClick?: () => void;
}

export function MetricButton({
  icon: Icon,
  label,
  count,
  selected = false,
  onClick,
}: MetricButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${label}，当前 ${count}`}
      className={`metric-button ${selected ? "metric-button--selected" : ""}`}
      onClick={onClick}
    >
      <Icon aria-hidden="true" size={16} strokeWidth={2} />
      <span>{count}</span>
    </button>
  );
}
