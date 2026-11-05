'use client';
import { useEffect, useRef, useState } from "react";
import XpBody from "./XpBody";
import { Showcase } from "@/types/showcase";
import { listShowcase } from "@/lib/api/showcase";
import { TotalSubjectHours } from "@/types/pomodoro";
import { fetchTotalSubjectHours } from "@/lib/api/pomodoro";
import Link from "next/link";
import { ChevronRight, Medal } from "lucide-react";
import { GhostCard } from "./GhostCard";


export default function ShowcaseHero() {

  const [showcase, setShowcase] = useState<Showcase[] | null>(null);
  const [totalHours, setTotalHours] = useState<TotalSubjectHours | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  //Draggable Scroll Behaviour
  const drag = useRef({ active: false, startX: 0, startScrollLeft: 0, moved: false });

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
  if (!totalHours) return null;


  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] 2xl:grid-cols-[1fr_300px] gap-8 mt-6">

      {/* Stat Cards */}
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-2 2xl:grid-cols-4 gap-4">
          <div className="border border-slate-700 bg-white/5 p-4 xl:p-5 rounded-2xl">
            <h1 className="text-slate-500 text-xs xl:text-sm mb-1">COMPLETED SUBJECTS</h1>
            <span className="text-white text-2xl xl:text-3xl font-bold">{showcase?.length ?? 0}</span>
          </div>

          <div className="border border-slate-700 bg-white/5 p-4 xl:p-5 rounded-2xl">
            <h1 className="text-slate-500 text-xs xl:text-sm mb-1">TOTAL FOCUS HOURS</h1>
            <p className="text-white text-2xl xl:text-3xl font-bold">
              {(totalHours.total_seconds / 3600).toFixed(1)} hours
            </p>
          </div>

          <div className="border border-slate-700 bg-white/5 p-4 xl:p-5 rounded-2xl">
            <h1 className="text-slate-500 text-xs xl:text-sm mb-1">MILESTONE COUNT</h1>
            <span className="text-white text-2xl xl:text-3xl font-bold">{showcase?.reduce((sum, s) => sum + s.milestone_count, 0) ?? 0}</span>
          </div>

          <div className="border border-slate-700 bg-white/5 p-4 xl:p-5 rounded-2xl">
            <h1 className="text-slate-500 text-xs xl:text-sm mb-1">POMODORO SESSION</h1>
            <span className="text-white text-2xl xl:text-3xl font-bold">{totalHours.total_sessions}
              <p className="text-slate-500 text-xs mt-1">•all subjects combined </p>
            </span>
          </div>
        </div>

        {/* Trophy Section */}
        <div className="w-full min-w-0 mt-20">
          <h3 className="subheading-text text-xl">Trophy Case</h3>

          {(!showcase || showcase.length === 0) ? (
            <div className="flex flex-col w-full items-center gap-3 justify-center border-2 mt-5 border-dashed border-gray-700 bg-white/5 rounded-2xl h-80">
              {/* Your empty state HTML from the screenshot */}
              <p className="text-white font-bold text-4xl">Your trophy case is empty</p>
              <p className="text-slate-500 font-semibold text-lg">Complete a subject with at least one milestone to promote it here.</p>
              <Link href={"/dashboard/subjects"} className="p-3 border border-purple-500/40 font-bold text-purple-500 rounded-2xl mt-10 hover:bg-purple-400/20 transition-colors duration-300">Go to Subjects</Link>
            </div>
          ) : (
            <div className="w-full relative mt-5">
              <ol className="flex gap-6 overflow-x-auto pb-16 trophy-scroll cursor-grab select-none" onMouseDown={(e) => {
                if (e.button !== 0) return;
                drag.current = {
                  active: true,
                  startX: e.clientX,
                  startScrollLeft: e.currentTarget.scrollLeft,
                  moved: false,
                };
              }}
                onMouseMove={(e) => {
                  if (!drag.current.active) return;
                  const distance = e.clientX - drag.current.startX;
                  if (Math.abs(distance) > 5) drag.current.moved = true;
                  e.currentTarget.scrollLeft = drag.current.startScrollLeft - distance;
                }}
                onMouseUp={() => { drag.current.active = false; }}
                onMouseLeave={() => { drag.current.active = false; }}
                onDragStart={(e) => e.preventDefault()}
                onClickCapture={(e) => {
                  if (drag.current.moved) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}>
                {showcase.map((item) => (
                  <li className="relative shrink-0 w-85 snap-start" key={item.id}>
                    <div className="relative block border 2xl:h-40 border-slate-700 rounded-2xl bg-white/5 p-5" draggable={false}>
                      <Medal className="absolute top-3 right-3 h-5 w-5 text-purple-500" />
                      <h3 className="text-white text-3xl">{item.subject_title}</h3>
                      <div className="flex gap-2 text-white mt-8">
                        <p className="bg-slate-700/60 rounded-md px-2 py-1 text-sm">{item.total_xp} XP</p>
                        <p className="bg-slate-700/60 rounded-md px-2 py-1 text-sm">{item.milestone_count} milestone(s)</p>
                        <p className="bg-slate-700/60 rounded-md px-2 py-1 text-sm">{(item.total_seconds / 3600).toFixed(1)} h</p>
                      </div>
                    </div>

                    <div className="absolute left-1/2 -bottom-1.75 -translate-x-1/2 h-3.5 w-3.5 rotate-45 border-b border-r border-slate-700 bg-[#19ec0ec6] " />
                    <div className="absolute left-1/2 -bottom-10 -translate-x-1/2 h-3 w-3 rounded-full bg-purple-500 ring-4 ring-purple-500/20" />
                    <time className="absolute left-1/2 -bottom-16 -translate-x-1/2 text-sm text-slate-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </time>
                  </li>
                ))}

                <GhostCard />
              </ol>
              <div className="pointer-events-none absolute left-0 right-2 bottom-[46px] h-px bg-slate-600" /> <ChevronRight className="pointer-events-none absolute right-0 bottom-[46px] translate-y-1/2 h-4 w-4 text-slate-600" />
            </div>
          )}
        </div>
      </div>

      <aside className="w-full">
        <XpBody />
      </aside>
    </div>

  )
}
