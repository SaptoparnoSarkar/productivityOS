"use client";

import { streakWeek } from "@/lib/api/streak";
import { getXpLog } from "@/lib/api/xp";
import { cn } from "@/lib/utils";
import { WeekResponse } from "@/types/streak";
import { XpLogResponse } from "@/types/xp";
import {
  Calendar,
  CalendarDaysIcon,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Flag,
  FlameIcon,
  ListChecks,
  LucideIcon,
  Timer,
  TrendingDown,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// EVENT CONFIG
const EVENT_CONFIG: Record<string, { icon: LucideIcon, label: string, badgeClass: string, iconClass: string }> = {
  daily_completion: { icon: CalendarDaysIcon, label: "Daily_Completion", badgeClass: "border border-purple-400/30 bg-purple-400/20 p-3 rounded-md", iconClass: "text-purple-400" },
  subject_completion: { icon: Trophy, label: "Subject_Completion", badgeClass: "border border-yellow-400/30 bg-yellow-400/20 p-3 rounded-md", iconClass: "text-yellow-400" },
  decay: { icon: TrendingDown, label: "Decay", badgeClass: "border border-red-400/30 bg-red-400/20 p-3 rounded-md", iconClass: "text-red-400" },
  pomodoro_session: { icon: Timer, label: "Pomodoro_Session", badgeClass: "border border-blue-400/30 bg-blue-400/20 p-3 rounded-md", iconClass: "text-blue-400" },
  weekly_completion: { icon: CalendarRange, label: "Weekly_Completion", badgeClass: "border border-green-400/30 bg-green-400/20 p-3 rounded-md", iconClass: "text-green-400" },
  per_tick: { icon: Zap, label: "Progress_Tick", badgeClass: "border border-pink-400/30 bg-pink-400/20 p-3 rounded-md", iconClass: "text-pink-400" }

}


export default function XpLogPage() {
  const [data, setData] = useState<XpLogResponse | null>(null);
  const [streakData, setStreakData] = useState<WeekResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setError("");
    setLoading(true);
    async function fetchData() {
      try {
        const result = await getXpLog(currentPage);
        const streak = await streakWeek();
        setData(result);
        setStreakData(streak);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage]);


  if (loading)
    return <div className="text-center text-slate-500">Loading Xp Log...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!data) return null;

  //destructure
  const { events, totalPages, totalXp, totalXpToday, totalCount } = data.log;

  //Sliding Window Pagination
  const WINDOW_SIZE = 5;
  function getPageWindow(
    currentPage: number,
    totalPages: number,
    windowSize: number,
  ) {
    const halfWindow = Math.floor(windowSize / 2);
    let start = Math.max(1, currentPage - halfWindow);
    const end = Math.min(totalPages, start + windowSize - 1);

    if (end - start + 1 < windowSize) {
      start = Math.max(1, end - windowSize + 1);
    }

    const pages = [];

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  const pageNumbers = getPageWindow(currentPage, totalPages, WINDOW_SIZE);

  return (
    <div className="ml-14 mt-2 mr-12 mb-10 ">
      {/* Header */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="header-text">XP Log</h1>
          <p className="subheading-text">
            Track all XP you've earned on your producitivity journey.{" "}
          </p>
        </div>
        <div className="flex gap-2 h-fit ">
          <span className="border border-slate-600/20 p-2 rounded-2xl flex text-white gap-2 bg-white/8"><div className=" w-3 rounded-sm h-auto bg-purple-500" />Total XP: <p className="font-semibold text-purple-500">{totalXp}</p></span>
          <span className="border border-slate-600/20 p-2 rounded-2xl flex text-white gap-2 bg-white/8"><div className=" w-3 rounded-sm h-auto bg-green-500" />Today: <p className="font-semibold text-green-500">{totalXpToday}</p></span>
          <span className="border border-slate-600/20 p-2 rounded-2xl flex text-white gap-2 bg-white/8"><div className=" w-3 rounded-sm h-auto bg-yellow-500" />{streakData && streakData.streak > 0 ? `Streak: ${streakData.streak}` : "No Streak"}</span>

        </div>
      </div>

      {/* Table Contents */}
      <div className="border border-purple-300/20 rounded-2xl overflow-hidden mt-10 w-[70%] mx-auto">
        {/* Table Header */}
        <div className="grid grid-cols-[300px_160px_1fr_300px_105px] bg-white/8 px-6 py-6 text-sm font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <ListChecks size={20} /> Source Event
          </div>
          <div className="flex items-center gap-2">
            <Flag size={20} /> Milestone
          </div>
          <div className="flex items-center gap-2 col-start-4">
            <Zap size={20} /> Amount
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={20} /> Date
          </div>
        </div>

        {/* Table Row */}
        <div>
          {events.map((event) => {
            const config = EVENT_CONFIG[event.type] ?? EVENT_CONFIG.per_tick;
            const Icon = config.icon;
            return (
              <div
                key={event.id}
                className="grid grid-cols-[300px_160px_1fr_260px_140px] px-6 py-4 items-center text-sm hover:bg-white/6 border border-slate-600/20 transition-colors text-white bg-white/2">

                <div className="flex items-center gap-2">
                  <span className={config.badgeClass}>
                    <Icon size={20} className={config.iconClass} />
                  </span>
                  <span className={`${config.badgeClass} font-semibold text-xs`}>
                    {config.label}
                  </span>
                </div>

                <div className="uppercase">
                  {event.milestone_title ?? "Milestone Deleted"}
                </div>

                <div className={cn("flex items-center justify-center gap-2 py-1 w-18 rounded-lg border text-md font-semibold whitespace-nowrap col-start-4",
                  event.amount > 0 ? "bg-green-300/10 border-green-300 text-green-300" : "bg-red-300/10 border-red-500 text-red-500",
                )}>
                  {event.amount > 0 ? `+${event.amount}` : event.amount} XP
                  {event.multiplier_applied && (
                    <span className="text-xs rounded-full px-2 flex items-center gap-1">
                      <FlameIcon className="text-orange-400" /> 2x
                    </span>
                  )}
                </div>


                <div className="">{new Date(event.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center gap-3 bg-white/8 py-4">
          <div className="flex items-center w-full justify-between px-5">
            <div>
              <span className="text-sm text-slate-400">
                {" "}
                Showing {currentPage}-{totalPages} of {totalCount} events
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="disabled:text-slate-600 transition-colors hover:text-purple-400 cursor-pointer"
              >
                <ChevronLeft />
              </button>

              {pageNumbers.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPage(num)}
                  className={
                    num === currentPage
                      ? "border border-purple-500 bg-purple-400/10 rounded-[8] px-3 py-1 cursor-pointer text-white"
                      : "text-slate-500 border border-purple-400/10 rounded-[8] px-3 py-1 cursor-pointer hover:bg-purple-400/20 transition-colors"
                  }
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= totalPages}
                className="disabled:text-slate-600 transition-colors hover:text-purple-400 cursor-pointer text-white"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
