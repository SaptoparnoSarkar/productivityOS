// Takes history and renders 7 Dots

import { DayProgress } from "@/types/streak";

const LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const STYLES = {
  qualified: "h-3 w-3 rounded-full bg-purple-500",
  missed: "h-3 w-3 rounded-full bg-neutral-700",
  future: "h-3 w-3 rounded-full border border-neutral-700",
};
type props = {
  history: DayProgress[];
};

export function WeekDots({ history }: props) {
  const week: Record<number, boolean> = {};

  for (const row of history) {
    const s = row.progress_date;
    const [y, m, d] = s.split("-").map(Number);
    const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    const idx = (day + 6) % 7;
    week[idx] = row.qualified;
  }

  return (
    <div className="flex items-center gap-x-2 ">
      {LABELS.map((label, i) => {
        const state =
          week[i] === undefined ? "future" : week[i] ? "qualified" : "missed";
        return <span key={i} className={STYLES[state]} title={label} />;
      })}
    </div>
  );
}
