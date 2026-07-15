import { Milestone } from "@/types/milestone";
import { AlarmClock } from "lucide-react";
import Link from "next/link";

export function MilestoneListView({ milestones }: { milestones: Milestone[] }) {
  if (milestones.length === 0)
    return (
      <div className="flex flex-col items-center justify-center pt-5 ">
        <AlarmClock className="w-15 h-15 text-purple-500" />
        <p className="mt-4 cursor-default">No Milestones Yet.</p>
      </div>
    );
  return (
    <ul className="flex flex-col gap-4 mt-2">
      {milestones.map((m) => (
        <li key={m.id} className="milestone-widget__links">
          <Link
            href={`/dashboard/subjects/milestones/${m.id}`}
            className="flex justify-between w-[350px]"
          >
            <p>{m.title}</p>
            <p className="text-muted-foreground">{m.type}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
