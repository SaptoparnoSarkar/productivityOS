import { cn } from "@/lib/utils";
import { MilestoneWithSubject } from "@/types/milestone";
import Spinner from "../ui/spinner";

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
      onClick={() => !isToggling && onToggle(milestone)}
      className={cn(
        "flex flex-col h-40 p-4 rounded-xl border justify-between relative",
        milestone.is_active
          ? "opacity-100 shadow-lg shadow-purple-500/50 ring-1 ring-purple-400"
          : "opacity-50 grayscale hover:opacity-100 hover:grayscale-0 hover:shadow-lg hover:shadow-purple-500/50",
      )}
    >
      {isToggling && (
        <span className="absolute top-2 right-2 h-4 w-4 animate-spin text-white">
          <Spinner />
        </span>
      )}
      <h2 className="font-semibold text-white">{milestone.title}</h2>
      <p className="text-sm text-gray-300">{milestone.subject_name}</p>
      {/* TODO: Progress  */}
    </div>
  );
}
