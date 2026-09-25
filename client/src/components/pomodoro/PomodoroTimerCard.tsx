import { PomodoroSessionWire, PresetSeconds, Verdict } from "@/types/pomodoro";
import TimerRingHalf from "./TimerRingHalf";
import { calculatePauseBudget, formatMMSS } from "@/lib/pomodoro/pomodoro";
import { Subject } from "@/types/subject";
import { SubjectPicker } from "./SubjectPicker";
import { cn } from "@/lib/utils";

type PomodoroTimerCardProps = {
  subjects: Subject[];
  selectedSubjectId: number | null;
  session: PomodoroSessionWire | null;
  verdict: Verdict | null;
  remainingTime: number;
  canPause: boolean;
  pausedBudget: number;
  pausedDurationRemaining: number;
  onSubjectChange: (id: number) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onAbandon: () => void;
  onComplete: () => void;
  pauseBudgetPreview: number;


  isMutating: boolean;
};

const MAX_PAUSES = 2;

export function PomodoroTimerCard({
  pauseBudgetPreview,
  subjects,
  selectedSubjectId,
  session,
  verdict,
  remainingTime,
  canPause,
  pausedBudget,
  pausedDurationRemaining,
  onSubjectChange,
  onStart,
  onPause,
  onResume,
  onAbandon,
  onComplete,
  isMutating
}: PomodoroTimerCardProps) {

  const used = session?.pause_count ?? 0;
  const displayedSubjectId = session?.subject_id ?? selectedSubjectId;
  const canManuallyComplete = verdict === "completable";


  return (
    <section className="flex min-h-[345px] flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/5 p-6 ">

      <TimerRingHalf
        remaining={remainingTime}
        total={session?.planned_seconds || 0}
        label={formatMMSS(remainingTime)}
        verdict={verdict}
      />
      <div>
        <p className="text-white flex justify-center items-center">
          Subject: <SubjectPicker subjects={subjects} value={displayedSubjectId} onChange={onSubjectChange} disabled={session !== null || isMutating} />
        </p>
        {/* <MilestonePicker /> */}
        <div className="flex justify-center gap-4">
          {session === null && (
            <button
              type="button"
              onClick={onStart}
              disabled={selectedSubjectId === null || isMutating}
              className="mt-5 rounded-full bg-purple-500 px-8 py-3 text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isMutating ? "Starting..." : "Start Focus"}
            </button>
          )}

          {session?.status === "active" && verdict === "running" && (
            <button
              className="mt-5 rounded-full bg-purple-500 px-8 py-3 text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={onPause}
              disabled={isMutating || !canPause}
            >
              Pause
            </button>
          )}

          {session?.status === "paused" && (
            <button
              className="mt-5 rounded-full bg-purple-500 px-8 py-3 text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={onResume}
              disabled={isMutating}
            >
              Resume
            </button>
          )}

          {canManuallyComplete && (
            <button
              type="button"
              onClick={onComplete}
              disabled={isMutating || verdict !== "completable"}
              className="mt-5 rounded-full bg-green-500 px-8 py-3 text-white transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isMutating ? "Completing..." : "Complete"}
            </button>
          )}



          <button
            className={cn("mt-5 rounded-full px-8 py-3 text-white disabled:cursor-not-allowed cursor-pointer hover:bg-red-400/10 ",
              verdict === "abandoned" ? "bg-red-500/40" : "bg-gray-700/40")}
            onClick={onAbandon}
            disabled={isMutating || verdict === "abandoned" || session === null}
          >
            {verdict === "abandoned" ? "Abandoned" : "Abandon"}
          </button>

        </div>
      </div>


      <p className="mt-4 text-sm text-neutral-400">
        Pauses left : {MAX_PAUSES - used}/{MAX_PAUSES}
        <span
          className={
            session?.status === "paused" &&
              pausedDurationRemaining <= 30
              ? "text-red-400"
              : "text-neutral-400"
          }
        >
          {" · "} Budget left{" "}
          {session?.status === "paused" || session?.status === "active"
            ? formatMMSS(pausedDurationRemaining)
            : formatMMSS(pauseBudgetPreview)}

        </span>

      </p>
    </section>
  );
}
