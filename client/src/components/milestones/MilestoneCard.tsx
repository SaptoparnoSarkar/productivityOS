import { cn } from "@/lib/utils";
import { MilestoneWithSubject } from "@/types/milestone";

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
        "rounded-xl p-4 cursor-pointer transition-all duration-300 text-white ",
        milestone.is_active
          ? "opacity-100 shadow-lg shadow-amber-500/50 ring-1 ring-amber-500"
          : "opacity-50 grayscale hover:opacity-100 hover:grayscale-0 hover:shadow-lg hover:shadow-amber-500/50",
      )}
    >
      {milestone.title}
      {milestone.subject_name}
      {/* TODO: Progress  */}
    </div>
  );
}
