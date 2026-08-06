import { cn } from "@/lib/utils";
import { MilestoneWithSubject } from "@/types/milestone";
import Spinner from "../ui/spinner";
import { Goal } from "lucide-react";
import { Button } from "../ui/button";
import { Toggle } from "../ui/Toggle";

type Props = {
  milestone: MilestoneWithSubject;
  onToggle: (m: MilestoneWithSubject) => void;
  isToggling: boolean;
};

export default function MilestoneCard({
  milestone,
  onToggle,
  isToggling,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col h-60 p-4 rounded-xl border relative ",
        milestone.is_active
          ? "opacity-100 shadow-lg shadow-purple-500/10 ring-1 ring-purple-400 bg-gray-900"
          : "border border-slate-600 grayscale opacity-60 hover:opacity-100 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-150 hover:grayscale-25",
      )}
    >
      {isToggling && (
        <span className="absolute top-2 right-2 h-4 w-4 animate-spin text-white">
          <Spinner />
        </span>
      )}
      <div className="flex justify-between mb-4">
        {milestone.is_active ? (
          <div className="text-green-400 text-xs font-semibold">ACTIVE</div>
        ) : (
          <div className="text-red-400 text-xs font-semibold">INACTIVE</div>
        )}

        <div className="mr-2">
          <Toggle
            checked={milestone.is_active}
            onChange={() => onToggle(milestone)}
            disabled={isToggling}
          />{" "}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-white">{milestone.title}</h2>
        <p className="text-sm text-gray-400 mt-1">{milestone.subject_name}</p>
        {/* TODO: Progress  */}
      </div>

      <div className="border border-b-red-500 border-w-2 mt-8" />

      <div className="flex items-center mt-8">
        <Goal className="w-4 h-4 text-white/70" />
        <span className="text-white/70 ml-2">
          Daily minimum: {milestone.daily_minimum}
        </span>
      </div>
    </div>
  );
}
