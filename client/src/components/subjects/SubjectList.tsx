"use client";

import { listSubjects } from "@/lib/api/subjects";
import { Subject } from "@/types/subject";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubjectCard } from "./SubjectCard";
import { GhostCard } from "./GhostCard";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "completable", "ongoing"] as const;
type Filter = (typeof FILTERS)[number];

export function SubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("all");
  const router = useRouter();

  useEffect(() => {
    setError("");
    setLoading(true);
    async function fetchSubjects() {
      try {
        const data = await listSubjects();
        setSubjects(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, []);

  //derive visible subjects
  const visible =
    filter === "all" ? subjects : subjects.filter((s) => s.type === filter);

  //Render states in order:
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!subjects || subjects.length === 0)
    return (
      <div className="text-white">
        No Subjects Created Yet. Create One to start tracking your progress.
      </div>
    );

  return (
    <div className="flex flex-col gap-1 mx-14">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-white font-bold text-6xl">Subjects</h1>
          <p className="text-slate-400 mt-2 text-lg mb-12">
            Total:{subjects.length}, One-off:{" "}
            {subjects.filter((s) => s.type === "completable").length}, Habit:{" "}
            {subjects.filter((s) => s.type === "ongoing").length}
          </p>
        </div>
        <div>
          <button
            className="w-42 p-3 bg-black text-white mb-10 text-lg font-bold cursor-pointer rounded-2xl hover:bg-purple-600 transition-all duration-200"
            onClick={() => router.push("/dashboard/subjects/new")}
          >
            + New Subject
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm cursor-pointer transition-all",
              filter === f
                ? "bg-indigo-600 text-white border-none"
                : "border border-gray-700 text-slate-400 hover:text-white",
            )}
          >
            {f === "all" ? "All" : f === "completable" ? "One-off" : "Habit"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-4">
        {visible.map((s) => (
          <SubjectCard key={s.id} subject={s} />
        ))}
        <GhostCard />
      </div>
    </div>
  );
}
