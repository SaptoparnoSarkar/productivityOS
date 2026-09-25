"use client";

import { listShowcase } from "@/lib/api/showcase";
import { Showcase } from "@/types/showcase";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ShowcaseSubjectList() {
  const [showcase, setShowcase] = useState<Showcase[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetch() {
      try {
        const data = await listShowcase();
        setShowcase(data);
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

  return (
    <div className="w-200">
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
    </div>
  );
}
