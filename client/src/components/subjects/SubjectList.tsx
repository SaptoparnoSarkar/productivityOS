"use client";

import { listSubjects } from "@/lib/api/subjects";
import { Subject } from "@/types/subject";
import { useEffect, useState } from "react";
import { SubjectCard } from "./SubjectCard";
import { GhostCard } from "./GhostCard";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "pending", "completed"] as const;
type Filter = (typeof FILTERS)[number];

export function SubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("all");


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
    filter === "all" ? subjects : subjects.filter((s) => s.status === filter);

  //Render states in order:
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-1 ml-14 mt-2 mr-12 mb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="header-text">Subjects</h1>
          <p className="subheading-text">
            Master your subjects with dedicated focus and organized progress
            tracking.
          </p>

          <p className="text-slate-400 mt-2 text-lg">
            Total: {subjects.length}, Ongoing:{" "}
            {subjects.filter((s) => s.status === "pending").length} Completed:{" "}
            {subjects.filter((s) => s.status === "completed").length}
          </p>
        </div>
        {/* <div>
          <button
            className="w-36 p-3 pr-14 bg-black/60 backdrop-blur-md text-white text-md font-bold cursor-pointer rounded-2xl hover:bg-white/80 transition-all duration-200 whitespace-nowrap"
            onClick={() => router.push("/dashboard/subjects/new")}
          >
            + New Subject
          </button>
        </div> */}
      </div>

      <div className="flex gap-2 mb-4 mt-10">
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
            {f === "all" ? "All" : f === "pending" ? "Pending" : "Completed"}
          </button>
        ))}
      </div>
      {subjects.length === 0 && <p className="text-slate-400 font-bold my-1">No subjects yet. Create your first one below.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-4">
        {visible.map((s) => (
          <SubjectCard key={s.id} subject={s} />
        ))}

        <GhostCard />
      </div>
    </div>
  );
}
