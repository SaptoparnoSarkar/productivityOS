type Props = {
  remaining: number;
  total: number;
  size?: number;
  stroke?: number;
  label: string;
  verdict: string | null;
};

export function TimerRing({
  remaining,
  total,
  size = 380,
  stroke = 15,
  label = "00:00",
  verdict,
}: Props) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const pct = total > 0 ? Math.min(1, Math.max(0, remaining / total)) : 0;
  const offset = C * (1 - pct);

  return (
    <svg width={size} height={size}>
      {/* Track Circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        stroke="#36454F"
        fill="none"
      />
      {/* Progress Circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="oklch(49.6% 0.265 301.924)"
        strokeWidth={stroke}
        strokeDasharray={C}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
      <text x={size / 2} y={size / 2 - 50} fill="#cbd5e1" textAnchor="middle">
        {verdict}
      </text>

      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={0.18 * size}
      >
        {label}
      </text>
    </svg>
  );
}
