type MetricCardProps = {
  label: string;
  value: number;
  hint?: string;
  isActive?: boolean;
};

export function MetricCard({ label, value, hint, isActive }: MetricCardProps) {
  return (
    <div className={`metric-card ${isActive ? "metric-card-active" : ""}`}>
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
      {hint && <span className="metric-hint">{hint}</span>}
    </div>
  );
}
