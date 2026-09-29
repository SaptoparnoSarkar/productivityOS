"use client";

import { PomodoroSessionWire, PresetSeconds, Verdict } from "@/types/pomodoro";
import { useEffect, useState } from "react";
import { TimerRing } from "../pomodoro/TimerRing";
import { formatMMSS, secondsRemaining } from "@/lib/pomodoro/pomodoro";
import { fetchActiveSession, pauseSession, resumeSession } from "@/lib/api/pomodoro";
import { Dot } from "lucide-react";
import { Subject } from "@/types/subject";
import { toast } from "sonner";
import { listSubjects } from "@/lib/api/subjects";

export function PomodoroWidget() {

  const [session, setSession] = useState<PomodoroSessionWire | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [pauseBudget, setPauseBudget] = useState(0);
  const [pauseExpiryHandled, setPauseExpiryHandled] = useState(false);
  const [canPause, setCanPause] = useState(false);


  const [, setTicker] = useState(0);

  const [isMutating, setIsMutating] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingSession, setLoadingSession] = useState(true);
  const [error, setError] = useState<string>("");

  const DEFAULT_PRESET: PresetSeconds = 3600;
  const [selectedPreset, setSelectedPreset] =
    useState<PresetSeconds>(DEFAULT_PRESET);


  useEffect(() => {
    const id = setInterval(() => setTicker((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);



  // Now and Remaining Time
  const now = session?.status === "paused" && session.paused_at ? Date.parse(session.paused_at) : Date.now();
  const remainingTime = session ? secondsRemaining(session.ends_at, now) : selectedPreset;
  const pausedDurationRemaining = session?.status === "paused" && session.paused_at ? Math.max(0, pauseBudget - Math.floor((Date.now() - Date.parse(session.paused_at)) / 1000),) : pauseBudget;

  useEffect(() => {
    if (session?.status !== "paused") {
      setPauseExpiryHandled(false);
      return;
    }

    if (pauseExpiryHandled || pausedDurationRemaining > 0) return;

    setPauseExpiryHandled(true);
    refresh().catch(() => {
      setPauseExpiryHandled(false);
    });
  }, [session?.status, pausedDurationRemaining, pauseExpiryHandled]);

  // Subject Fetcher
  useEffect(() => {
    async function loadSubjects() {
      setLoadingSubjects(true);
      try {
        const data = await listSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to load subjects:", error);
      } finally {
        setLoadingSubjects(false);
      }
    }
    loadSubjects();
  }, []);


  // Session Fetcher
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

  async function refresh(isInitialLoad = false) {
    setError("");
    try {
      const data = await fetchActiveSession();

      setSession(data.session);
      setVerdict(data.verdict);
      setCanPause(data.can_pause ?? false);
      setPauseBudget(data.remainingBudget ?? 0);
    } catch (error) {
      if (isInitialLoad) {
        setError(error instanceof Error ? error.message : "Failed to load session");
      } else {
        setError(error instanceof Error ? error.message : "Failed to load session");
      }
    } finally {
      setLoadingSession(false);
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
  const size = 120;


  if (loadingSession) return <div>Loading Session</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex items-center gap-2">
      <div className="">
        {session ? (
          <>
            <TimerRing
              remaining={remainingTime}
              total={session.planned_seconds}
              label={formatMMSS(remainingTime)}
              verdict={null}
              size={size}
            />
          </>
        ) : (
          <TimerRing
            remaining={selectedPreset}
            total={selectedPreset}
            label={formatMMSS(selectedPreset)}
            verdict={null}
            size={size}
          />
        )}
        <p className="relative bottom-16 left-11 font-semibold text-neutral-400 text-sm">
          {session?.status === "active" || session?.status === "paused"
            ? "of " + formatMMSS(session?.planned_seconds ?? selectedPreset)
            : ""}{" "}
        </p>
      </div>

      <div>
        {session?.status === "active" && verdict === "running" && (
          <button
            className="mt-5 rounded-full bg-purple-500 px-8 py-3 text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={pause}
            disabled={isMutating || !canPause}
          >
            Pause
          </button>
        )}

        {session?.status === "paused" && (
          <button
            className="mt-5 rounded-full bg-purple-500 px-8 py-3 text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={resume}
            disabled={isMutating}
          >
            Resume
          </button>
        )}

      </div>

      <div>
        {subjects.map((subject) => {
          return (
            <div key={subject.id}>{subject.title}</div>
          );
        })}
      </div>

      <div className="text-white">
        {session?.status === "active" ? (
          <div>
            <div className="flex">
              <div className="text-green-400 relative bottom-2 left-2">
                <Dot size={40} />
              </div>
              running
            </div>
          </div>
        ) : session?.status === "paused" ? (
          <div>
            <div className="flex">
              <div className="text-red-400 relative bottom-2 left-2">
                <Dot size={40} />
              </div>
              paused
            </div>
          </div>
        ) : session?.status === "completed" ? (
          <div>
            <div className="flex">
              <div className="text-green-400 relative bottom-2 left-2">
                <Dot size={40} />
              </div>
              completed
            </div>
          </div>
        ) : (
          <div>
            <div className="flex">
              <div className="text-neutral-400 relative bottom-2 left-2">
                <Dot size={40} />
              </div>
              idle
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
