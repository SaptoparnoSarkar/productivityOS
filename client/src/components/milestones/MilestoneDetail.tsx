"use client";

import { deleteMilestone, getMilestone } from "@/lib/api/milestones";
import { Milestone } from "@/types/milestone";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChecklistItemsList from "../checklist/ChecklistItemsList";
import CounterDisplay from "../counter/CounterDisplay";

export default function MilestoneDetail() {
  const params = useParams();
  const milestoneId = Number(params.milestoneId);
  const subjectId = Number(params.id);

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
        const data = await getMilestone(subjectId, milestoneId);
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
  if (error) return <p>{error}</p>;
  if (!milestone) return <p>Milestone not found.</p>;

  return (
    <div className="text-white">
      <h1>{milestone.title}</h1>
      <p>Type: {milestone.type}</p>
      <p>
        {milestone.type === "checklist" ? (
          <ChecklistItemsList milestoneId={milestoneId} />
        ) : (
          <CounterDisplay milestoneId={milestoneId} />
        )}
      </p>

      <button onClick={handleDelete} disabled={deleting}>
        {deleting ? "Deleting..." : "Delete"}
      </button>
      {deleteError && <p className="form-error">{deleteError}</p>}
    </div>
  );
}
