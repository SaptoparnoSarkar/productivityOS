"use client";

import { listUpcomingMilestone } from "@/lib/api/milestones";
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
    async function fetchUpcomingMilestones() {
      try {
        const data = await listUpcomingMilestone(5);
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
    fetchUpcomingMilestones();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (loading) return <p>Loading upcoming milestones...</p>;
  if (milestones === null) return <div>No upcoming milestones.</div>;
  return <MilestoneListView milestones={milestones} />;
}
