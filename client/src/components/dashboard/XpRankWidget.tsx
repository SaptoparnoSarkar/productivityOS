"use client";

import { getXpSummary } from "@/lib/api/xp";
import { XpSummaryResponse } from "@/types/xp";
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
      <div className="rounded-lg border-purple-600 border-2 mt-4 p-4 space-y-3 hover:shadow-lg hover:shadow-purple-400 transition duration-400 ease-in-out">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{rank.name}</div>
          <div className="text-stale-500">{totalXp} XP</div>
        </div>

        <div className="text-sm text-stale-500">{progress.text}</div>

        {/* Track and fill Progress Bar */}
        <div className="w-full h-2 bg-gray-600 rounded-full">
          <div
            className={`h-2 rounded-full ${progress.percent === 100 ? "bg-amber-500" : "bg-blue-500"}`}
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      <Link
        href="/dashboard/xp"
        className="block mt-4 text-right text-blue-500 hover:text-amber-50 duration-500 ease-in-out"
      >
        {" "}
        View All {`->`}
      </Link>
    </div>
  );
}
