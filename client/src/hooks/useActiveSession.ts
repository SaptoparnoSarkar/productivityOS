import { fetchActiveSession } from "@/lib/api/pomodoro";
import { secondsRemaining } from "@/lib/pomodoro/pomodoro";
import { PomodoroSessionWire, PresetSeconds, Verdict } from "@/types/pomodoro";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useActiveSession() {
  // Remaining, total, label, verdict
  const [session, setSession] = useState<PomodoroSessionWire | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const DEFAULT_PRESET: PresetSeconds = 3600;
  const [selectedPreset, setSelectedPreset] =
    useState<PresetSeconds>(DEFAULT_PRESET);
  const [canPause, setCanPause] = useState(false);
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
  // Refresher
  async function refresh(isInitialLoad = false) {
    setError("");
    try {
      const data = await fetchActiveSession();

      setSession(data.session);
      setVerdict(data.verdict);
      setRemainingBudget(data.remainingBudget ?? 0);
    } catch (error) {
      if (isInitialLoad) {
        setError("Failed to fetch session");
      } else {
        toast.error("Failed to refresh session");
      }
      throw error;
    }
  }

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

  return {
    session,
    verdict,
    remaining,
    pausedBudgetRemaining,
    canPause,
    loadingSession,
    error,
    refresh,
  };
}
