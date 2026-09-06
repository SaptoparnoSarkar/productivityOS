"use client";

import { PresetPicker } from "@/components/pomodoro/PresetPicker";
import { SubjectPicker } from "@/components/pomodoro/SubjectPicker";
import { TimerRing } from "@/components/pomodoro/TimerRing";
import {
  completeSession,
  fetchActiveSession,
  pauseSession,
  resumeSession,
  startSession,
} from "@/lib/api/pomodoro";
import { listSubjects } from "@/lib/api/subjects";
import { formatMMSS, secondsRemaining } from "@/lib/pomodoro/pomodoro";
import { PomodoroSessionWire, PresetSeconds, Verdict } from "@/types/pomodoro";
import { Subject } from "@/types/subject";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PauseBars } from "./PauseBars";
import { cn } from "@/lib/utils";

export function PomodoroHero() {
  const [session, setSession] = useState<PomodoroSessionWire | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [canPause, setCanPause] = useState(false);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [pauseExpiryHandled, setPauseExpiryHandled] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingSession, setLoadingSession] = useState(true);
  const [error, setError] = useState<string>("");

  //Ticker
  const [, forceTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  //PresetSelector
  const DEFAULT_PRESET: PresetSeconds = 3600;
  const [selectedPreset, setSelectedPreset] =
    useState<PresetSeconds>(DEFAULT_PRESET);

  const displayedPreset = session ? session.planned_seconds : selectedPreset;

  //Subject Selector
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    null,
  );

  //Subject Fetcher
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

  //Session Fetcher
  useEffect(() => {
    async function loadSession() {
      setLoadingSession(true);
      try {
        await refresh(true);
      } catch {
      } finally {
        setLoadingSession(false);
      }
    }
    loadSession();
  }, []);

  const now =
    session?.status === "paused" && session.paused_at
      ? Date.parse(session.paused_at)
      : Date.now();
  //Remaining Time
  const remaining = session
    ? secondsRemaining(session.ends_at, now)
    : selectedPreset;

  const pausedBudgetRemaining =
    session?.status === "paused" && session.paused_at
      ? Math.max(
          0,
          remainingBudget -
            Math.floor((Date.now() - Date.parse(session.paused_at)) / 1000),
        )
      : remainingBudget;

  //Pause Budget Expiry Refresher
  useEffect(() => {
    if (session?.status !== "paused" || pausedBudgetRemaining > 0) {
      setPauseExpiryHandled(false);
      return;
    }

    if (pauseExpiryHandled) return;

    setPauseExpiryHandled(true);
    refresh();
  }, [session?.status, pausedBudgetRemaining, pauseExpiryHandled]);

  //Refresh
  async function refresh(isInitialLoad = false) {
    setError("");
    try {
      const data = await fetchActiveSession();

      setSession(data.session);
      setVerdict(data.verdict);
      setCanPause(data.can_pause ?? false);
      setRemainingBudget(data.remainingBudget ?? 0);
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

  //Start Handler
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
      // The start response has a different shape. Don't teach your component two shapes.
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to start session");
      }
    }
  }
  //Pause Handler
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
  //Resume Handler
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

  //Complete Lock
  const hasReachedEnd =
    session !== null && Date.now() >= Date.parse(session.ends_at);
  const completingRef = useRef(false);
  useEffect(() => {
    if (session?.status !== "active" || !hasReachedEnd) return;
    if (completingRef.current) return;
    completingRef.current = true;

    complete().then((success) => {
      if (!success) {
        completingRef.current = false;
      }
    });
  }, [session?.status, remaining]);

  async function complete(): Promise<boolean> {
    try {
      const result = await completeSession();
      toast.success(`Completed! + ${result.xp} XP.`);
      setSelectedPreset(DEFAULT_PRESET);
      await refresh();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Completion failed");
      return false;
    }
  }

  if (loadingSubjects || loadingSession) return <div> Loading </div>;
  if (error)
    return (
      <div className="text-white flex justify-center items-center gap-1">
        <p>{error}</p>
        <button
          className="text-blue-300 underline underline-offset-4 hover:text-blue-400"
          onClick={() => void refresh(true)}
        >
          Retry
        </button>
      </div>
    );
  return (
    <div className="text-white relative flex flex-col items-center justify-center h-[700px] w-[500px] bg-neutral-900/80 border border-neutral-800 rounded-2xl backdrop-blur-md">
      <div className="relative bottom-10">
        {session ? (
          <>
            <TimerRing
              remaining={remaining}
              total={session.planned_seconds}
              label={formatMMSS(remaining)}
              verdict={verdict}
            />
          </>
        ) : (
          <TimerRing
            remaining={selectedPreset}
            total={selectedPreset}
            label={formatMMSS(selectedPreset)}
            verdict={verdict}
          />
        )}
        <div className="relative bottom-35 left-44">
          <PauseBars pauseCount={session?.pause_count ?? 0} />

          {session?.status === "paused" && (
            <p
              className={cn(
                "text-sm font-semibold relative right-15 top-5",
                pausedBudgetRemaining <= 30
                  ? "text-red-400"
                  : "text-neutral-400",
              )}
            >
              Pause Budget: {formatMMSS(pausedBudgetRemaining)}
            </p>
          )}
        </div>
      </div>
      <PresetPicker
        value={displayedPreset}
        onChange={setSelectedPreset}
        disabled={!!session}
      />
      <SubjectPicker
        subjects={subjects}
        value={selectedSubjectId}
        onChange={setSelectedSubjectId}
        disabled={!!session}
      />
      {!session && (
        <button
          className="relative top-15 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors cursor-pointer"
          onClick={() => start(selectedPreset)}
        >
          Start
        </button>
      )}
      {session?.status === "active" && (
        <button
          className="relative top-15 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors cursor-pointer hover:scale-110 disabled:bg-neutral-800 disabled:cursor-not-allowed"
          onClick={() => pause()}
          disabled={!canPause}
        >
          Pause
        </button>
      )}
      {session?.status === "paused" && (
        <button
          className="relative top-15 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors cursor-pointer hover:scale-110"
          onClick={() => resume()}
        >
          Resume
        </button>
      )}
    </div>
  );
}

// TODO: Implement the auto-complete and award xp feature.
