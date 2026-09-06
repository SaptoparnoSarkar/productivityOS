import {
  ActiveSessionResponse,
  CompleteResult,
  PauseResult,
  PomodoroSessionWire,
  ResumeResult,
  SubjectHours,
} from "@/types/pomodoro";
import { apiClient } from "../apiClient";
import { StartSessionInput } from "@/schemas/pomodoro.schema";

type Envelope<T> = { message: string; data: T };

export async function fetchActiveSession(): Promise<ActiveSessionResponse> {
  const response =
    await apiClient<Envelope<ActiveSessionResponse>>(`/api/pomodoro/active`);
  return response.data;
}

export async function startSession(
  input: StartSessionInput,
): Promise<PomodoroSessionWire> {
  const response = await apiClient<Envelope<PomodoroSessionWire>>(
    `/api/pomodoro/start`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  return response.data;
}

export async function pauseSession(): Promise<PauseResult> {
  const response = await apiClient<Envelope<PauseResult>>(
    `/api/pomodoro/pause`,
    {
      method: "POST",
    },
  );
  return response.data;
}

export async function resumeSession(): Promise<ResumeResult> {
  const response = await apiClient<Envelope<ResumeResult>>(
    `/api/pomodoro/resume`,
    {
      method: "POST",
    },
  );
  return response.data;
}

export async function completeSession(): Promise<CompleteResult> {
  const response = await apiClient<Envelope<CompleteResult>>(
    `/api/pomodoro/complete`,
    {
      method: "POST",
    },
  );
  return response.data;
}

export async function fetchSubjectHours(): Promise<SubjectHours> {
  const response = await apiClient<Envelope<SubjectHours>>(
    `/api/pomodoro/subject-hours`,
  );
  return response.data;
}
