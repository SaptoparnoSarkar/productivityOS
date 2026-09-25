"use client";

import { PomodoroSessionWire, PomodoroSummary, PresetSeconds, Verdict } from "@/types/pomodoro";
import { useEffect, useRef, useState } from "react";
import { WeekResponse } from "@/types/streak";
import { streakWeek } from "@/lib/api/streak";
import PomodoroSidePanel from "./PomodoroSidePanel";
import { PomodoroTimerCard } from "./PomodoroTimerCard";
import { Subject } from "@/types/subject";
import { listSubjects } from "@/lib/api/subjects";
import { abandonSession, completeSession, fetchActiveSession, fetchPomodoroSummary, pauseSession, resumeSession, startSession } from "@/lib/api/pomodoro";
import { toast } from "sonner";
import { calculatePauseBudget, formatFocusTime, secondsRemaining } from "@/lib/pomodoro/pomodoro";
import { cn } from "@/lib/utils";

export default function NewPomodoroHero() {
  const [streakData, setStreakData] = useState<WeekResponse | null>(null);
  const [session, setSession] = useState<PomodoroSessionWire | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    null,
  );
  const [summary, setSummary] = useState<PomodoroSummary | null>(null);


  const [, setTick] = useState(0);

  const [canPause, setCanPause] = useState(false);
  const [pausedBudget, setPausedBudget] = useState(0);
  const [pauseExpiryHandled, setPauseExpiryHandled] = useState(false);

  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string>("");
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingStreak, setLoadingStreak] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  // TODO: loading is doing two jobs. It works for now, but a cleaner later version uses separate names such as loadingStreak and loadingSession, then derives one isInitialLoading value.

  const DEFAULT_PRESET: PresetSeconds = 1800;
  const [selectedPreset, setSelectedPreset] =
    useState<PresetSeconds>(DEFAULT_PRESET);
  const displayedPreset = session ? session.planned_seconds : selectedPreset;
  const displayedPausedBudget = calculatePauseBudget(displayedPreset);



  //Streak
  useEffect(() => {
    async function fetchStreak() {
      try {
        const data = await streakWeek();
        setStreakData(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "An error occured. Please try again.",
        );
      } finally {
        setLoadingStreak(false);
      }
    }
    fetchStreak();
  }, []);

  // Summary Fetch

  async function loadSummary() {
    try {
      const data = await fetchPomodoroSummary();
      setSummary(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occured. Please try again.",
      );
    } finally {
      setLoadingSummary(false);
    }
  }
  useEffect(() => { void loadSummary(); }, []);


  //Subject Fetch
  useEffect(() => {
    async function fetchSubjects() {
      setLoadingSubjects(true);
      try {
        const data = await listSubjects();
        setSubjects(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "An error occured. Please try again.",
        );
      } finally {
        setLoadingSubjects(false);
      }
    }
    fetchSubjects();
  }, []);



  //Active - Session Fetch
  useEffect(() => {
    async function loadSession() {
      try {
        await refresh(true);
      } finally {
        setLoadingSession(false);
      }
    }
    loadSession();
  }, []);


  //Refresh (Sync Data)
  async function refresh(isInitialLoad = false) {
    setError("");
    try {
      const data = await fetchActiveSession();

      setSession(data.session);
      setVerdict(data.verdict);
      setCanPause(data.can_pause ?? false);
      setPausedBudget(data.remainingBudget ?? 0);
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Failed to refresh session.";

      if (isInitialLoad) {
        setError(errMessage);
      } else {
        toast.error(errMessage);
      }
      throw error;
    }
  }

  async function start(preset: PresetSeconds) {
    if (selectedSubjectId === null) {
      toast.error("Please select a subject");
      return;
    }
    try {
      await startSession({
        subject_id: selectedSubjectId,
        milestone_id: null,
        planned_seconds: preset,
      });
      await refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to start session");
      }
    }
  }

  async function pause() {
    try {
      await pauseSession();
      await refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to pause session");
      }
    }
  }

  async function resume() {
    try {
      await resumeSession();
      await refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to resume session");
      }
    }
  }

  async function abandon() {
    try {
      await abandonSession();
      await refresh()
      await loadSummary()
      toast.success("Session abandoned!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to abandon session");
      }
    }
  }

  // Completing Lock
  const hasReachedEnd = session !== null && Date.now() >= Date.parse(session.ends_at)

  const completingRef = useRef(false);

  useEffect(() => {
    if (session?.status !== "active" || !hasReachedEnd) return;

    void complete();
  }, [session?.status, hasReachedEnd])

  // Completing Lock Reset
  useEffect(() => {
    if (session === null) {
      completingRef.current = false
    }
  }, [session]);

  async function complete(): Promise<boolean> {
    if (isMutating || completingRef.current) return false;

    completingRef.current = true;
    setIsMutating(true);

    try {
      const result = await completeSession();
      toast.success(`Focus complete. + ${result.xp} XP`)
      await loadSummary();
      await refresh();
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to complete session."
      )
      completingRef.current = false;
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  // Ticker
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);


  const now = session?.status === "paused" && session.paused_at ? Date.parse(session.paused_at) : Date.now();
  const remainingTime = session ? secondsRemaining(session.ends_at, now) : selectedPreset;
  const pausedDurationRemaining = session?.status === "paused" && session.paused_at ? Math.max(0, pausedBudget - Math.floor((Date.now() - Date.parse(session.paused_at)) / 1000)) : pausedBudget;

  useEffect(() => {
    if (session?.status !== "paused") {
      setPauseExpiryHandled(false);
      return;
    }

    if (pauseExpiryHandled || pausedDurationRemaining > 0) return;

    setPauseExpiryHandled(true);
    refresh().catch(() => {
      setPauseExpiryHandled(false);
    })
  }, [session?.status, pausedDurationRemaining, pauseExpiryHandled])




  const initialLoading = loadingSession || loadingSubjects || loadingStreak || loadingSummary;

  if (initialLoading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }


  return (
    <main className="ml-14 mt-2 mr-12 mb-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="header-text">Pomodoro</h1>
          <p className="subheading-text">Deep work, one session at a time.</p>
        </div>
        <div className="text-white p-4 rounded-2xl bg-gray-600/40 flex flex-col justify-center items-center w-32 ">
          <p className="text-slate-300">Streak</p>
          <p className="text-2xl font-bold">
            {streakData?.streak} {streakData?.streak === 1 ? "Day" : "Days"}
          </p>
        </div>
      </header>

      <section className="mt-10 grid gap-5 lg:grid-cols-12 w-[1800px] mx-auto">
        <div className="lg:col-span-8">
          <PomodoroTimerCard
            pauseBudgetPreview={displayedPausedBudget}
            subjects={subjects}
            selectedSubjectId={selectedSubjectId}
            session={session}
            verdict={verdict}
            remainingTime={remainingTime}
            canPause={canPause}
            pausedBudget={pausedBudget}
            pausedDurationRemaining={pausedDurationRemaining}
            onSubjectChange={(id) => setSelectedSubjectId(id)}
            onStart={() => start(selectedPreset)}
            onPause={pause}
            onResume={resume}
            onComplete={complete}
            onAbandon={abandon}
            isMutating={isMutating}
          />
        </div>
        <aside className="lg:col-span-4 ">
          <PomodoroSidePanel
            setSelectedPreset={setSelectedPreset}
            displayedPreset={displayedPreset}
            session={session}
          />
        </aside>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-14 mx-auto w-[1800px]">

        <div className="lg:col-span-3 border p-6 rounded-2xl bg-gray-500/20 flex flex-col gap-4 justify-center items-center">
          <h1 className="text-slate-300">TODAY FOCUS</h1>
          <p className="font-semibold text-6xl text-white">{formatFocusTime(summary?.todayTotalHours.total_seconds ?? 0)}</p>
        </div>

        <div className="lg:col-span-3 border p-6 rounded-2xl bg-gray-500/20 flex flex-col gap-4 justify-center items-center">
          <h1 className="text-slate-300">SESSIONS TODAY</h1>
          <p className="font-semibold text-6xl text-white">{summary?.todayTotalHours.total_sessions ?? 0}</p>
        </div>

        <div className="lg:col-span-3 border p-6 rounded-2xl bg-gray-500/20 flex flex-col gap-4 justify-center items-center">
          <h1 className="text-slate-300">TOTAL FOCUS (ACTUAL)</h1>
          <p className="font-semibold text-6xl text-white">
            {formatFocusTime(summary?.subjectHours?.reduce((acc, hour) => acc + hour.total_seconds, 0) ?? 0)}
          </p>
        </div>

        <div className="lg:col-span-5 border p-6 rounded-2xl bg-gray-500/20 flex flex-col gap-4">
          <h1 className="text-slate-300">RECENT SESSIONS</h1>
          {summary?.recents.length === 0 ? (
            <p>No finished sessions yet.</p>
          ) : (
            summary?.recents.map((recent) => (
              <div key={recent.id} className="flex justify-between">
                <div>
                  <span className="text-white text-lg">{recent.subject_title}</span>
                </div>
                <div className="flex gap-4">
                  <p className="text-white text-lg">{formatFocusTime(recent.actual_seconds)}</p>
                  <p className={cn("text-white text-lg", recent.status === "completed" ? "text-green-500 px-1 py-0.5 bg-green-400/20 rounded-md" : "text-red-500 px-1 py-0.5 bg-red-400/20 rounded-md")}>{recent.status}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </section>
    </main>

  );

}
