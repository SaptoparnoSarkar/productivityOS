type MetricCardProps = {
  label: string;
  value: number;
  text?: string;
  isActive?: boolean;
};

export function MetricCard({ label, value, text, isActive }: MetricCardProps) {
  return (
    <div className={`metric-card ${isActive ? "metric-card-active" : ""}`}>
      <span className="metric-label">{label}</span>
      <span className="text-4xl font-bold flex items-center gap-4">{value}{value === 0 && <p className="text-sm text-white/80 font-normal">- {text}</p>}</span>
    </div>
  );
}
