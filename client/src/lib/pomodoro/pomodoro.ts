import { PresetSeconds } from "@/types/pomodoro";

//Seconds Remaining
export function secondsRemaining(endsAt: string, now: number) {
  const remainingMs = Date.parse(endsAt) - now;
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

//Format
export function formatMMSS(totalSeconds: number) {
  const min = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return String(min).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}
// Presets
export type Preset = {
  seconds: PresetSeconds;
  minutes: string;
  xp: number;
};

export const PRESETS: Preset[] = [
  {
    seconds: 600,
    minutes: "10",
    xp: 15,
  },
  {
    seconds: 1200,
    minutes: "20",
    xp: 35,
  },
  {
    seconds: 1800,
    minutes: "30",
    xp: 55,
  },
  {
    seconds: 2700,
    minutes: "45",
    xp: 90,
  },
  {
    seconds: 3600,
    minutes: "60",
    xp: 130,
  },
  {
    seconds: 5400,
    minutes: "90",
    xp: 210,
  },
  {
    seconds: 7200,
    minutes: "120",
    xp: 300,
  },
];

// Budget Calc
const PAUSE_BUDGET_RATIO = 0.25;
const MIN_PAUSE_BUDGET_SECONDS = 180;
const MAX_PAUSE_BUDGET_SECONDS = 600;

export function calculatePauseBudget(plannedSeconds: number) {
  const base = Math.floor(
    Math.min(
      Math.max(plannedSeconds * PAUSE_BUDGET_RATIO, MIN_PAUSE_BUDGET_SECONDS),
      MAX_PAUSE_BUDGET_SECONDS,
    ),
  );
  return base;
}

export function formatFocusTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);

  return `${hours}h ${mins}m`;
}
