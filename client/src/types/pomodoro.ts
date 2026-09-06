export type PresetSeconds = 600 | 1200 | 1800 | 2700 | 3600 | 5400 | 7200;
export type PomodoroStatus = "active" | "completed" | "paused" | "abandoned";
export type Verdict = "running" | "completable" | "paused" | "abandoned";

export type PomodoroSessionWire = {
  id: number;
  user_id: number;
  subject_id: number;
  milestone_id: number | null;
  planned_seconds: PresetSeconds;
  actual_seconds: number | null;
  status: "active" | "paused" | "completed" | "abandoned";
  paused_at: string | null;
  total_paused_seconds: number;
  pause_count: number;
  started_at: string;
  ends_at: string;
  completed_at: string | null;
};

export type ActiveSessionResponse = {
  session: PomodoroSessionWire | null;
  verdict: Verdict | null;
  remainingBudget?: number;
  can_pause?: boolean;
};

export type PauseResult = {
  paused: PomodoroSessionWire;
  remainingBudget: number;
};

export type ResumeResult = {
  resumed: PomodoroSessionWire;
};

export type CompleteResult = {
  finished: PomodoroSessionWire;
  xp: number;
};

export type SubjectHours = {
  subject_id: number;
  title: string;
  total_seconds: number;
};
