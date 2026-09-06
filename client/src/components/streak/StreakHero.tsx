import { DayProgress } from "@/types/streak";
import { FlameIcon } from "lucide-react";
import { WeekDots } from "./WeekDots";

type StreakHeroProps = {
  streak: number;
  history: DayProgress[];
};

export function StreakHero({ streak, history }: StreakHeroProps) {
  return (
    <section className="border rounded-2xl border-purple-600/40 bg-neutral-900 p-6 ">
      <div className="flex items-center gap-3">
        {streak === 3 && <FlameIcon className="w-12 h-12" />}
        <h2 className="text-4xl text-neutral-100 font-bold">
          {streak === 0 ? "No streak yet" : `${streak} Day Streak`}
        </h2>
      </div>

      {streak >= 3 && (
        <div className="text-sm mt-3 text-neutral-400">
          2x Multiplier Active
        </div>
      )}
      <WeekDots history={history} />
    </section>
  );
}
