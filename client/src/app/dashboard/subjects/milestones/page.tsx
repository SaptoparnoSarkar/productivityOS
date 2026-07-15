"use client";

import MilestoneCard from "@/components/milestones/MilestoneCard";
import { getAllMilestones, setMilestoneActive } from "@/lib/api/milestones";
import { MilestoneWithSubject } from "@/types/milestone";
import { useEffect, useState } from "react";

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
      setError(
        error instanceof Error
          ? error.message
          : "An error occured. Please try again.",
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
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Milestones</h1>
        <p className="text-gray-400">
          Active Milestones:{" "}
          {milestones.filter((m) => m.is_active === true).length}
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

// TODO: Toster message of at least one milestone needs to stay active
