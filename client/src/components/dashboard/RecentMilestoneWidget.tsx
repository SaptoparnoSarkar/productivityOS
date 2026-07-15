"use client";

import { listRecentMilestones } from "@/lib/api/milestones";
import { Milestone } from "@/types/milestone";
import { useEffect, useState } from "react";
import { MilestoneListView } from "../milestones/MilestoneListView";

export function UpcomingMilestoneWidget() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setError("");
    setLoading(true);
    async function fetchRecentMilestones() {
      try {
        const data = await listRecentMilestones(5);
        setMilestones(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load upcoming milestones",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchRecentMilestones();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (loading) return <p>Loading upcoming milestones...</p>;

  return <MilestoneListView milestones={milestones} />;
}
