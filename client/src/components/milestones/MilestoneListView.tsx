import { Milestone } from "@/types/milestone";
import { AlarmClock, Clock } from "lucide-react";

export function MilestoneListView({ milestones }: { milestones: Milestone[] }) {

  if (milestones.length === 0) return (

    <div className="flex flex-col items-center justify-center pt-5 ">
      <AlarmClock className="w-15 h-15 text-purple-500" />
      <p className="mt-4 cursor-default">No Milestones Yet.</p>
    </div>

  )
  return (
    <ul>
      {milestones.map((m) => (
        <li key={m.id} className="border-l-4 border-l-red-500 px-2">
          <strong>{m.title}</strong>
          <small>{m.type}</small>
        </li>
      ))}
    </ul>
  );
}
