// The server never runs a countdown, a session is a row with started_at and ends_at. All tabs agree for free sync.

// Constants and ladder preset
const POMODORO_TIMER_PRESETS = {
  600: { mins: 10, xp: 15 },
  1200: { mins: 20, xp: 35 },
  1800: { mins: 30, xp: 55 },
  2700: { mins: 45, xp: 90 },
  3600: { mins: 60, xp: 130 },
  5400: { mins: 90, xp: 210 },
  7200: { mins: 120, xp: 300 },
} as const;

export type PresetSeconds = keyof typeof POMODORO_TIMER_PRESETS;

const GRACE_PERIOD_SECONDS = 120;
const MAX_PAUSES_PER_SESSION = 2;
const PAUSE_BUDGET_RATIO = 0.25;
const MIN_PAUSE_BUDGET_SECONDS = 180;
const MAX_PAUSE_BUDGET_SECONDS = 600;

export const PRESET_SECONDS = Object.keys(POMODORO_TIMER_PRESETS).map(
  Number,
) as PresetSeconds[];

export type PomodoroSessionRow = {
  id: number;
  user_id: number;
  subject_id: number;
  milestone_id: number | null;
  planned_seconds: number;
  actual_seconds: number | null;
  status: "active" | "paused" | "completed" | "abandoned";
  paused_at: Date | null;
  total_paused_seconds: number;
  pause_count: number;
  started_at: Date;
  ends_at: Date;
  completed_at: Date | null;
};
export type PomodoroStatus =
  | "running"
  | "completable"
  | "abandoned"
  | "paused"
  | "pause_expired";

// Guard
export function isValidPreset(seconds: number): seconds is PresetSeconds {
  return PRESET_SECONDS.includes(seconds as PresetSeconds);
}

// lookup
export function getPresetXp(plannedSeconds: PresetSeconds) {
  return POMODORO_TIMER_PRESETS[plannedSeconds].xp;
}

export function calculatePauseBudget(plannedSeconds: number) {
  const base = Math.floor(
    Math.min(
      Math.max(plannedSeconds * PAUSE_BUDGET_RATIO, MIN_PAUSE_BUDGET_SECONDS),
      MAX_PAUSE_BUDGET_SECONDS,
    ),
  );
  return base;
}

// wallet minus spent
export function getRemainingPauseDuration(session: PomodoroSessionRow) {
  const totalBudget = calculatePauseBudget(session.planned_seconds);
  const remainingDuration = Math.max(
    0,
    totalBudget - session.total_paused_seconds,
  );
  return remainingDuration;
}

export function canStart(activeSession: unknown) {
  return !activeSession;
}

export function canPause(session: PomodoroSessionRow) {
  return (
    session.status === "active" &&
    session.pause_count < MAX_PAUSES_PER_SESSION &&
    getRemainingPauseDuration(session) > 0
  );
}

export function resolveSession(session: PomodoroSessionRow, now: Date) {
  if (session.status === "paused") {
    const remainingPausedDuration = getRemainingPauseDuration(session);
    const deadline = new Date(
      session.paused_at!.getTime() + remainingPausedDuration * 1000,
    );
    return now >= deadline ? "pause_expired" : "paused";
  }

  // Active row uses a ends_at
  if (session.status === "active") {
    const graceDeadline = new Date(
      session.ends_at!.getTime() + GRACE_PERIOD_SECONDS * 1000,
    );
    return now < session.ends_at
      ? "running"
      : now <= graceDeadline
        ? "completable"
        : "abandoned";
  }
  // Completed/abandoned are terminal
  return session.status as PomodoroStatus;
}

// pause duration + new ends_at
export function calculateResumeValues(session: PomodoroSessionRow, now: Date) {
  const remaining = getRemainingPauseDuration(session);
  const rawPaused = Math.floor(
    (now.getTime() - session.paused_at!.getTime()) / 1000,
  );
  const pausedSeconds = Math.min(rawPaused, remaining);
  const newEndsAt = new Date(session.ends_at.getTime() + pausedSeconds * 1000);
  const newTotalPaused = session.total_paused_seconds + pausedSeconds;

  return { pausedSeconds, newEndsAt, newTotalPaused };
}

// How many seconds the user actually worked, as opposed to planned_seconds, excludes the pauses and calculated the work seconds.
export function calculateActualSeconds(session: PomodoroSessionRow, now: Date) {
  const elapsedSeconds = (now.getTime() - session.started_at.getTime()) / 1000;
  const workedSeconds =
    Math.floor(elapsedSeconds) - session.total_paused_seconds;

  return Math.max(0, Math.min(workedSeconds, session.planned_seconds));
}
