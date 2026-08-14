import formatDate from "@/lib/subjects/derive";
import { cn } from "@/lib/utils";
import { Subject } from "@/types/subject";
import { Calendar, Timer, TimerOff } from "lucide-react";
import Link from "next/link";

export function SubjectCard({ subject }: { subject: Subject }) {
  const dateLabel = formatDate(subject);
  return (
    <Link
      className="text-white block h-full"
      href={`/dashboard/subjects/${subject.id}`}
    >
      <div className="flex flex-col relative bg-gray-900 p-4.5 border border-gray-700 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 h-75 ">
        <div className="flex justify-between items-center min-w-0">
          <h3 className="text-[30px] font-bold text-white truncate ">
            {subject.title}
          </h3>
          <div
            className={cn(
              "text-[15px] capitalize py-1 px-2 rounded-4xl shrink-0 whitespace-nowrap",
              subject.status === "completed"
                ? "bg-green-400"
                : "bg-purple-700/70",
            )}
          >
            {subject.status === "completed" ? "Completed" : "In Progress"}
          </div>
        </div>
        {subject.description && (
          <p className="mt-2 text-sm text-slate-400 font-medium">
            {subject.description}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/70" />
            <span className="text-sm text-slate-400 font-medium">
              {dateLabel}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            {subject.has_pomodoro === true ? (
              <>
                <Timer className="w-5 h-5 text-green-400/70 mb-0.5" />
                <span>Pomodoro</span>
              </>
            ) : (
              <>
                <TimerOff className="w-5 h-5 text-red-400/70 mb-0.5" />
                <span>No Pomodoro</span>
              </>
            )}
          </div>
          <div className="px-3 py-2 bg-gray-600 rounded-2xl text-white text-sm">
            {subject.type === "completable" ? "One-off" : "Habit"}
          </div>
        </div>
      </div>
    </Link>
  );
}
