"use client";

import { listMilestones } from "@/lib/api/milestones";
import { Milestone } from "@/types/milestone";
import Link from "next/link";
import { useEffect, useState } from "react";

type Prop = {
  subjectId: number;
};

export function MilestoneList({ subjectId }: Prop) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setError("");
    setLoading(true);
    async function fetchMilestones() {
      try {
        const data = await listMilestones(subjectId);
        setMilestones(data);
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
      {milestones.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-5">
          <p className="text-white/60">No Milestones Yet.</p>
          <Link
            className="text-purple-400 hover:text-purple-600 duration-200"
            href={`/dashboard/subjects/${subjectId}/milestones/new`}
          >
            Click here to create your first milestone.
          </Link>
        </div>
      ) : (
        <ul>
          {milestones.map((m) => (
            <li
              key={m.id}
              className="text-white hover:text-purple-600 duration-200 cursor-pointer"
            >
              <Link
                href={`/dashboard/subjects/${subjectId}/milestones/${m.id}`}
              >
                {m.title}
              </Link>
              <span> — {m.type}</span>
              {m.is_active ? <span> (Active)</span> : <span> (Archived)</span>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
