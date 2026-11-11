"use client";

import { listSubjects } from "@/lib/api/subjects";
import { Subject } from "@/types/subject";
import { useEffect, useState } from "react";
import { SubjectCard } from "./SubjectCard";
import { GhostCard } from "./GhostCard";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FILTERS = ["all", "pending", "completed"] as const;
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
    filter === "all" ? subjects : subjects.filter((s) => s.status === filter);

  //Render states in order:
  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (!subjects || subjects.length === 0)
    return (
      <div className="flex flex-col gap-1 ml-14 mt-2 mr-12 mb-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="header-text">Subjects</h1>
            <p className="subheading-text">
              Master your subjects with dedicated focus and organized progress
              tracking.
            </p>
          </div>

        </div>

        <div className="flex items-center justify-center mt-25">
          <div className="flex flex-col items-center justify-center border-2 border-dashed w-200 h-130 border-gray-700 bg-white/5 rounded-2xl">
            <div className="mt-10 p-5 bg-purple-400/20 rounded-2xl shadow-[0_0_15px_rgba(147,51,234,0.8),0_0_30px_rgba(147,51,234,0.4)]"><BookOpen className="text-purple-500" size={50} /></div>
            <div className="flex flex-col items-center mt-10 gap-3">
              <h1 className="text-white text-3xl font-bold-">No Subjects Yet</h1>
              <p className="text-slate-500 text-md">Create your first subject and start making progress.</p>
            </div>
            <div className="mt-10 flex flex-col items-center">
              <button
                className="w-56 p-3 bg-black text-white mb-10 text-lg font-bold cursor-pointer whitespace-nowrap rounded-2xl hover:bg-purple-600 transition-all duration-300"
                onClick={() => router.push("/dashboard/subjects/new")}
              >
                + Create Subject
              </button>
              <p className="text-slate-500 text-sm bottom-6 relative">One subject. One step forward.</p>
            </div>
          </div>
        </div>
      </div>
    );


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
        <div>
          {/* <button
            className="w-42 h-[79px] p-3 bg-black text-white mb-10 text-lg font-bold cursor-pointer rounded-2xl hover:bg-purple-600 transition-all duration-200"
            onClick={() => router.push("/dashboard/subjects/new")}
          >
            + New Subject
          </button> */}
        </div>
      </div>

      <div className="flex gap-2 mb-4 mt-10">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm cursor-pointer transition-all",
              filter === f
                ? `bg-indigo-600 text-white border-none ${f === "completed" ? "bg-green-500" : ""}`
                : "border border-gray-700 text-slate-400 hover:text-white",
            )}
          >
            {f === "all" ? "All" : f === "pending" ? "Pending" : "Completed"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-4 ">
        {visible.map((s) => (
          <SubjectCard key={s.id} subject={s} />
        ))}
        {(filter === "all" || filter === "pending") && <GhostCard />}
      </div>
    </div>
  );
} 
