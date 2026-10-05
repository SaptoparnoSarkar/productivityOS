"use client";
import { fetchTotalSubjectHours } from "@/lib/api/pomodoro";
import { getXpSummary } from "@/lib/api/xp";
import { TotalSubjectHours } from "@/types/pomodoro";
import { XpSummaryResponse } from "@/types/xp";
import { Check, Shield } from "lucide-react";
import { useEffect, useState } from "react";

export default function XpBody() {
  const [data, setData] = useState<XpSummaryResponse | null>(null);
  const [totalHours, setTotalHours] = useState<TotalSubjectHours | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getXpSummary();
        const total = await fetchTotalSubjectHours();
        setData(data);
        setTotalHours(total);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Faild to load Xp data",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div> Loading..</div>;
  if (error) return <div> Error..</div>;
  if (!data) return null;
  if (!totalHours) return null;

  const { totalXp, rank, progress } = data.summary;

  const RANKS = [
    { name: "Recruit", minXp: 0 },
    { name: "Corporal", minXp: 500 },
    { name: "Sergeant", minXp: 1500 },
    { name: "Lieutenant", minXp: 3500 },
    { name: "Vice Captain", minXp: 7000 },
    { name: "Captain", minXp: 13000 },
    { name: "Sergeant Major", minXp: 22000 },
    { name: "Major", minXp: 35000 },
    { name: "Lieutenant Colonel", minXp: 55000 },
    { name: "Colonel", minXp: 80000 },
    { name: "General", minXp: 150000 },
    { name: "Napoleon", minXp: 300000 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="border border-slate-700 w-85 p-6 rounded-2xl">
        <h1 className="text-slate-400 ">TOTAL XP GAINED</h1>
        <p className="text-white text-5xl">{totalXp.toLocaleString()} XP</p>
        <div className="w-full h-2 bg-gray-600 rounded-full mt-3">
          <div
            className={`h-2 rounded-full ${progress.percent === 100 ? "bg-amber-500" : "bg-purple-600"}`}
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <p className="text-slate-400 text-sm mt-3">
          {progress.text} • {progress.percent}%
        </p>
      </div>
      <div className="border border-slate-700 w-85 p-6 rounded-2xl ">
        <h1 className="text-slate-400">RANK LADDER</h1>
        <div className="rank-scroll mt-3">
          {RANKS.map((r) => {
            const isCurrent = r.name === rank.name;
            const isUnlocked = totalXp >= r.minXp;
            return (
              <div
                key={r.name}
                className={`relative flex items-center gap-3 rounded-lg py-2 pl-4 pr-2 mt-2 ${isCurrent
                  ? "bg-purple-500/10 ring-1 ring-purple-600/60 text-purple-200"
                  : isUnlocked
                    ? "text-white"
                    : "text-slate-500/60"
                  }`}
              >
                <span>
                  {isUnlocked && !isCurrent && (
                    <Check className="size-3.5 fill-white" />
                  )}
                  {isCurrent && (
                    <Shield className="size-3.5 fill-purple-500 text-purple-400" />
                  )}
                  {!isUnlocked && (
                    <span className="size-3 rounded-sm bg-slate-700/60" />
                  )}
                </span>

                <span>{r.name}</span>
                <span className="ml-auto tabular-nums">
                  {r.minXp.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border border-slate-700 w-85 p-6 rounded-2xl">
        <h1 className="text-slate-400">TOTAL FOCUS HOURS</h1>
        <p className="text-white text-3xl">
          {(totalHours.total_seconds / 360).toFixed(1)} hours
        </p>
        <p className="text-slate-400 text-sm">
          all subjects combined • {totalHours.total_sessions} pomodoro sessions
        </p>
      </div>
    </div>
  );
}
