"use client";

import { deleteMilestone, getMilestone } from "@/lib/api/milestones";
import { Milestone } from "@/types/milestone";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChecklistItemsList from "../checklist/ChecklistItemsList";
import CounterDisplay from "../counter/CounterDisplay";
import Link from "next/link";

export default function MilestoneDetail() {
  const params = useParams();
  const milestoneId = Number(params.milestoneId);
  const subjectId = Number(params.subjectId);

  //States
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  //Delete
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (Number.isNaN(subjectId)) {
      setError("Invalid subject Id");
      setLoading(false);
      return;
    }
    if (Number.isNaN(milestoneId)) {
      setError("Invalid milestone Id");
      setLoading(false);
      return;
    }
    async function fetchMilestone() {
      try {
        const data = await getMilestone(milestoneId);
        setMilestone(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchMilestone();
  }, [subjectId, milestoneId]);

  //Delete Handler
  async function handleDelete() {
    if (!window.confirm(`Delete this milestone?`)) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteMilestone(subjectId, milestoneId);
      router.push(`/dashboard/subjects/${subjectId}`);
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "An error occurred.",
      );
    }
    setDeleting(false);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="render-error">{error}</p>;
  if (!milestone) return <p>Milestone not found.</p>;

  return (
    <main className="flex flex-col gap-6 max-w-6xl mx-auto py-8">
      <section className="detail-card ">

        <Link href={`/dashboard/subjects/${subjectId}`} className="text-white/50 text-sm font-bold hover:text-white transition duration-200">← Back</Link>

        <div className="my-2 flex justify-between items-center">
          <h1 className="text-white text-3xl font-bold cursor-default">{milestone.title}</h1>
          <span className="p-1 border bg-purple-400/30 rounded-lg text-xs text-purple-400 cursor-default font-bold ">{milestone.type.toUpperCase()}</span>
        </div>
        <p className="text-sm text-white/60 font-semibold">{milestone.description ? milestone.description : "No Description"}</p>

        <div className="flex flex-col gap-6 max-w-7xl mt-10 ">
          {milestone.type === "checklist" ? (
            <ChecklistItemsList milestoneId={milestoneId} />
          ) : (
            <CounterDisplay milestoneId={milestoneId} />
          )}
        </div>
        <hr className="border-gray-500/30 mt-5" />
        <div className="w-full mt-2 flex items-center justify-center gap-2">

          {milestone.daily_minimum && <p className="text-sm text-white/70 font-semibold mt-3 whitespace-nowrap border border-gray-500/30 rounded-lg p-2">Daily Minimum: {milestone.daily_minimum} {milestone.daily_minimum_unit} </p>}
          {milestone.weekly_minimum && <p className="text-sm text-white/70 font-semibold mt-3 whitespace-nowrap border border-gray-500/30 rounded-lg p-2">Weekly Minimum: {milestone.weekly_minimum} {milestone.weekly_minimum === 1 ? "day" : "days"} </p>}
          <div className="w-full text-right">
            <Link href={`/dashboard/subjects/${subjectId}/milestones/${milestoneId}/edit`} className="text-white/70 hover:text-white transition duration-200 cursor-pointer font-bold text-sm mr-5">Edit Milestone</Link>
            <button onClick={handleDelete} disabled={deleting} className="text-red-500/60 hover:text-red-500 transition duration-200 cursor-pointer font-bold text-sm ">{deleting ? "Deleting..." : "Delete Milestone"}</button>
            {deleteError && <p className="form-error">{deleteError}</p>}
          </div>
        </div>

      </section>
    </main>
  );
}
