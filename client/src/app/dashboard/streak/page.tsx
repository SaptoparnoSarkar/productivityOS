"use client";

import { StreakHero } from "@/components/streak/StreakHero";
import { streakWeek } from "@/lib/api/streak";
import { DayProgress } from "@/types/streak";
import { useEffect, useState } from "react";

export default function StreakPage() {
  const [streak, setStreak] = useState<number>(0);
  const [history, setHistory] = useState<DayProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  //   const [today,setToday] = useState<TodayStatus | null>(null)

  useEffect(() => {
    async function fetchStreak() {
      try {
        const data = await streakWeek();
        setHistory(data.history);
        setStreak(data.streak);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error has occured");
      } finally {
        setLoading(false);
      }
    }
    fetchStreak();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="flex items-center justify-center w-full h-full text-white">
        Error: {error}
      </div>
    );
  return (
    <div>
      <StreakHero streak={streak} history={history} />
    </div>
  );
}
