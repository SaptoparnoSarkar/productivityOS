"use client";

import { ActiveCapacityBar } from "@/components/milestones/ActiveCapacityBar";
import MilestoneCard from "@/components/milestones/MilestoneCard";
import { getAllMilestones, setMilestoneActive } from "@/lib/api/milestones";
import { MilestoneWithSubject } from "@/types/milestone";
import { ChevronRight, Flag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MilestonePage() {
  const [milestones, setMilestones] = useState<MilestoneWithSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const router = useRouter();

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
      <div className="ml-14 mt-2 mr-12">
        <div className="mb-4">
          <h1 className="header-text">Milestones</h1>
          <p className="subheading-text">
            Activate your milestones for next week. This week's contract is
            locked.
          </p>
        </div>

        <div className="flex items-center justify-center mt-25">
          <div className="flex flex-col items-center justify-center border-2 border-dashed w-200 h-130 border-gray-700 bg-white/5 rounded-2xl">
            <div className="mt-10 p-5 bg-[#F59E0B]/20 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.8),0_0_30px_rgba(245,158,11,0.4)]"><Flag className="text-[#F59E0B]" size={50} /></div>
            <div className="flex flex-col items-center mt-10 gap-3">
              <h1 className="text-white text-3xl font-bold-">No Milestones Yet</h1>
              <p className="text-slate-500 text-md text-center">Add a Milestone to a Subject,<br /> then come back to activate it for XP and Streak.</p>
            </div>
            <div className="mt-10 flex flex-col items-center">
              <button
                className="w-56 p-3 bg-black flex items-center justify-center gap-2 text-white mb-10 text-lg font-bold cursor-pointer whitespace-nowrap rounded-2xl hover:bg-[#F59E0B] transition-all duration-300"
                onClick={() => router.push("/dashboard/subjects")}
              >
                Go To Subjects <ChevronRight size={20} />
              </button>
              <p className="text-slate-500 text-sm bottom-6 relative">Small steps. Meaningful progress.</p>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="ml-14 mt-2 mr-12">
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
