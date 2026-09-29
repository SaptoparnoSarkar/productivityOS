type MetricCardProps = {
  label: string;
  value: number;
  text?: string;
  isActive?: boolean;
};

export function MetricCard({ label, value, text, isActive }: MetricCardProps) {
  return (
    <div className={`flex flex-col justify-center gap-2 p-5 rounded-2xl bg-gray-800/50 border border-gray-600 text-white ${isActive ? "metric-card-active" : ""}`}>
      <span className="metric-label">{label}</span>
      <span className="text-4xl font-bold flex items-center gap-4">{value}{value === 0 && <p className="text-sm text-white/80 font-normal">- {text}</p>}</span>
    </div>
  );
}
