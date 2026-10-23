"use client";
import MilestoneForm from "@/components/milestones/MilestoneForm";
import { getMilestone } from "@/lib/api/milestones";
import { Milestone } from "@/types/milestone";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditMilestonePage() {
  const params = useParams();
  const subjectId = Number(params.subjectId);
  const milestoneId = Number(params.milestoneId);
  const router = useRouter();

  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (Number.isNaN(subjectId) || Number.isNaN(milestoneId)) {
      setError("Invalid Subject ID or Milestone ID");
      setLoading(false);
      return;
    }

    async function fetchMilestone() {
      try {
        const data = await getMilestone(milestoneId);
        setMilestone(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load milestone",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchMilestone();
  }, [subjectId, milestoneId]);



  if (loading) return <div>Loading...</div>;
  if (error) return <div className="render-error">Error: {error}</div>;
  if (!milestone) return <div>Milestone not found</div>;

  return (
    <div>
      <MilestoneForm
        mode="edit"
        subjectId={subjectId}
        milestone={milestone}
        onSuccess={() => router.push(`/dashboard/subjects/${subjectId}/milestones/${milestoneId}`)}
      />
    </div>
  );
}

