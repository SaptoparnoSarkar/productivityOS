"use client";

import { ActiveCapacityBar } from "@/components/milestones/ActiveCapacityBar";
import MilestoneCard from "@/components/milestones/MilestoneCard";
import { getAllMilestones, setMilestoneActive } from "@/lib/api/milestones";
import { MilestoneWithSubject } from "@/types/milestone";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MilestonePage() {
  const [milestones, setMilestones] = useState<MilestoneWithSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchMilestones() {
      try {
        const data = await getAllMilestones();
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
  }, []);

  async function handleToggle(m: MilestoneWithSubject) {
    if (togglingId !== null) return;
    setTogglingId(m.id);
    try {
      await setMilestoneActive(m.id, !m.is_active);
      const freshData = await getAllMilestones();
      setMilestones(freshData);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setTogglingId(null);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="flex items-center justify-center w-full h-full text-white">
        Error: {error}
      </div>
    );
  if (milestones.length === 0)
    return (
      <div className="flex items-center justify-center w-full h-full text-white">
        No milestones created yet!
      </div>
    );

  return (
    <div className="ml-14 mt-15 mr-12">
      <div className="mb-4">
        <h1 className="header-text">Milestones</h1>
        <p className="subheading-text">
          Activate your milestones for next week. This week's contract is
          locked.
        </p>
        <div className="text-gray-400 mt-10 text-lg flex shrink-0 items-center gap-2 mr-5">
          Active: {milestones.filter((m) => m.is_active === true).length} of{" "}
          {milestones.length}
          <ActiveCapacityBar
            active={milestones.filter((m) => m.is_active === true).length}
            max={milestones.length}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        {milestones.map((m) => (
          <MilestoneCard
            key={m.id}
            milestone={m}
            onToggle={() => handleToggle(m)}
            isToggling={togglingId === m.id}
          />
        ))}
      </div>
    </div>
  );
}
