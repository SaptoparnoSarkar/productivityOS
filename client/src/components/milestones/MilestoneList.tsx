"use client";

import { listMilestones } from "@/lib/api/milestones";
import { cn } from "@/lib/utils";
import { Milestone } from "@/types/milestone";
import Link from "next/link";
import { useEffect, useState } from "react";

type Prop = {
  subjectId: number;
};

export function MilestoneList({ subjectId }: Prop) {
  const [milestone, setMilestone] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setError("");
    setLoading(true);
    async function fetchMilestones() {
      try {
        const data = await listMilestones(subjectId);
        setMilestone(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "An error occured. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchMilestones();
  }, [subjectId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {milestone.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-5">
          <p className="text-white/60">No Milestones Yet.</p>
          <Link
            className="text-purple-500 hover:font-bold transition duration-200 "
            href={`/dashboard/subjects/${subjectId}/milestones/new`}
          >
            Click here to create your first milestone.
          </Link>
        </div>
      ) : (
        <ul>
          {milestone?.map((m) => (
            <li
              key={m.id}
              className="text-white"
            >
              <Link
                href={`/dashboard/subjects/${subjectId}/milestones/${m.id}`}
              >
                <div className="flex justify-between border border-slate-50/20 p-4 rounded-lg mb-3 hover:border-purple-300 hover:text-purple-400 transition duration-300 cursor-pointer">
                  <div className="flex gap-3 items-center">
                    <h3 className="text-xl">{m.title}</h3>
                    <span className={cn(
                      "bg-gray-500/30 text-white/20 px-2 py-0.5 rounded-2xl",
                      m.is_active == true && "bg-green-500/40 text-green-500"
                    )}>
                      {m.type}
                    </span>
                    {m.is_active !== true && (
                      <div className="text-sm pr-3 pl-2 py-0.5 rounded-xl font-bold flex items-center bg-red-500/40 text-red-500">
                        <span className="text-xl">•</span>
                        Activate to earn XP
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <div className="h-2 w-[160px] bg-gray-600 rounded-full">
                      <div
                        className={cn(
                          "h-2 rounded-full",
                          m.current_progress / m.target === 1
                            ? "bg-green-500"
                            : "bg-purple-500",
                        )}
                        style={{
                          width: `${(m.current_progress / m.target) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p
                      className={cn(
                        "ml-3",
                        m.is_done === true
                          ? "text-green-500"
                          : "text-slate-400",
                      )}
                    >
                      {m.current_progress}/{m.target}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
