"use client";

import { getXpSummary } from "@/lib/api/xp";
import { XpSummaryResponse } from "@/types/xp";
import { ChevronRight, Dot } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function XpRankWidget() {
  const [data, setData] = useState<XpSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const data = await getXpSummary();
        setData(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load XP data",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading)
    return <div className="text-center text-slate-500"> Loading Rank...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!data) return null;

  // Destructure the summary for UX purposes
  const { totalXp, rank, progress } = data.summary;

  return (
    <div className="w-full">
      <div className="pt-6 flex flex-col gap-2">
        <div className="flex items-center ">
          <div className="font-semibold">{rank.name}</div>
          <Dot />
          <p className="text-green-500 text-2xl font-bold">{totalXp} XP</p>
          <p className="ml-auto mt-2 font-bold text-cyan-500"> {progress.percent}%</p>
        </div>

        {/* Track and fill Progress Bar */}
        <div className="w-full h-2 bg-gray-600 rounded-full">
          <div
            className={`h-2 rounded-full ${progress.percent === 100 ? "bg-amber-500" : "bg-cyan-500"}`}
            style={{ width: `${progress.percent}%` }}
          />
        </div>

        <div className="text-sm font-semibold text-stale-500">{progress.text}</div>
      </div>

      <div className="flex justify-end">
        <Link
          href="/dashboard/xp"
          className="text-blue-400 inline-flex items-center text-sm cursor-pointer transition-all duration-300 ease-in-out mt-10 hover:text-blue-300 hover:underline"
        >
          {" "}
          View Log<ChevronRight />
        </Link>
      </div>
    </div>
  )
}
