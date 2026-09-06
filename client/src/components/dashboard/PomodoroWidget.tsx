"use client";

import { PomodoroSessionWire, PresetSeconds, Verdict } from "@/types/pomodoro";
import { useEffect, useState } from "react";
import { TimerRing } from "../pomodoro/TimerRing";
import { formatMMSS, secondsRemaining } from "@/lib/pomodoro/pomodoro";
import { fetchActiveSession } from "@/lib/api/pomodoro";
import { PauseBars } from "../pomodoro/PauseBars";
import { cn } from "@/lib/utils";

export function PomodoroWidget() {
  // Remaining, total, label, verdict
  const [session, setSession] = useState<PomodoroSessionWire | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [pauseExpiryHandled, setPauseExpiryHandled] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [error, setError] = useState<string>("");

  // Ticker
  const [, forceTicker] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceTicker((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Preset Timer
  const DEFAULT_PRESET: PresetSeconds = 3600;
  const [selectedPreset, setSelectedPreset] =
    useState<PresetSeconds>(DEFAULT_PRESET);

  // Now and Remaining Time
  const now =
    session?.status === "paused" && session.paused_at
      ? Date.parse(session.paused_at)
      : Date.now();
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

  // Paused Budget Expiry Refresher
  useEffect(() => {
    if (session?.status !== "paused" || pausedBudgetRemaining > 0) {
      setPauseExpiryHandled(false);
      return;
    }

    if (pauseExpiryHandled) return;

    setPauseExpiryHandled(true);
    refresh();
  }, [session?.status, pausedBudgetRemaining, pauseExpiryHandled]);

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
      setRemainingBudget(data.remainingBudget ?? 0);
    } catch (error) {}
  }
  const size = 160;

  return (
    <div className="grid grid-cols-2 min-w-50 ">
      {session ? (
        <>
          <TimerRing
            remaining={remaining}
            total={session.planned_seconds}
            label={formatMMSS(remaining)}
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
      <div className="mt-10 flex flex-col gap-2 opacity-0 2xl:opacity-100">
        <PauseBars pauseCount={session?.pause_count ?? 0} />
        {verdict}
        <div>
          <p
            className={cn(
              "text-sm font-semibold mt-5",
              pausedBudgetRemaining <= 30 ? "text-red-400" : "text-neutral-400",
            )}
          >
            Pause Budget: {formatMMSS(pausedBudgetRemaining)}
          </p>
        </div>
      </div>
    </div>
  );
}
