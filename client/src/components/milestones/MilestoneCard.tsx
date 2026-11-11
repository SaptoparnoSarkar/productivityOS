import { cn } from "@/lib/utils";
import { MilestoneWithSubject } from "@/types/milestone";
import Spinner from "../ui/spinner";
import { Goal } from "lucide-react";
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
          ? "opacity-100 shadow-lg shadow-cyan-500/10 ring-1 border-cyan-500/30 bg-slate-900/40"
          : "border border-slate-600 grayscale opacity-60 hover:opacity-100 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-150 hover:grayscale-25",
      )}
    >
      {isToggling && (
        <span className="absolute top-2 right-2 h-4 w-4 animate-spin text-white">
          <Spinner />
        </span>
      )}
      <div className="flex justify-between mb-4">
        {milestone.is_active ? (
          <div className="text-cyan-400 text-xs font-semibold">ACTIVE</div>
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
        <h2 className="font-semibold text-slate-100">{milestone.title}</h2>
        <p className="text-sm text-slate-400 mt-1">{milestone.subject_name}</p>
        {/* TODO: Progress  */}
      </div>

      {milestone.is_active ? (
        <div className="border border-b-cyan-500 border-w-2 mt-8" />
      ) :
        (
          <div className="border border-b-red-500 border-w-2 mt-8" />
        )}


      <div className="flex items-center mt-8">
        <Goal className="w-4 h-4 text-white/70" />
        <span className="text-white/70 ml-2">
          Daily minimum: {milestone.daily_minimum}
        </span>
      </div>
    </div>
  );
}
