'use client';
import { useEffect, useState } from "react";
import XpBody from "./XpBody";
import { Showcase } from "@/types/showcase";
import { listShowcase } from "@/lib/api/showcase";
import { TotalSubjectHours } from "@/types/pomodoro";
import { fetchTotalSubjectHours } from "@/lib/api/pomodoro";
import Link from "next/link";


export default function ShowcaseHero() {

  const [showcase, setShowcase] = useState<Showcase[] | null>(null);
  const [totalHours, setTotalHours] = useState<TotalSubjectHours | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetch() {
      try {
        const data = await listShowcase();
        const total = await fetchTotalSubjectHours();
        setShowcase(data);
        setTotalHours(total);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!showcase) return <div>No completed subjects</div>;
  if (!totalHours) return null;


  return (
    <div className="flex gap-6 mt-10">

      <div className="flex gap-4 h-44 ">
        <div className="border border-slate-700 w-85 p-6 rounded-2xl">
          <p className="text-slate-500">COMPLETED SUBJECTS</p>
          <span className="text-white">{showcase?.length ?? 0}</span>
        </div>

        <div className="border border-slate-700 w-85 p-6 rounded-2xl">
          <h1 className="text-slate-500">TOTAL FOCUS HOURS</h1>
          <p className="text-white text-3xl">
            {(totalHours.total_seconds / 360).toFixed(1)} hours
          </p>
          <p className="text-slate-500 text-sm">
            all subjects combined • {totalHours.total_sessions} pomodoro sessions
          </p>
        </div>

        <div className="border border-slate-700 w-85 p-6 rounded-2xl">
          <p className="text-slate-700">MILESTONE COUNT</p>
          <span className="text-white">{showcase.map((s) => (
            s.milestone_count
          ))}</span>
        </div>
      </div>

      <div>
        <XpBody />
      </div>


      {/* <div className="w-200">
        {showcase?.map((s) => (
          <div className="text-white" key={s.id}>
            <Link key={s.id} href={`/dashboard/showcase/${s.id}`}>
              <div className="flex justify-between items-center p-6 border border-slate-700 rounded-2xl gap-1 mt-4">
                <div className="flex flex-col">
                  <h1 className="text-3xl">{s.subject_title}</h1>
                  <p>
                    {s.milestone_count}milestones . {s.total_seconds}
                  </p>
                </div>
                <div className="bg-slate-800">+{s.total_xp} XP</div>
              </div>
            </Link>
          </div>
        ))}
      </div> */}



    </div>
  );
}
