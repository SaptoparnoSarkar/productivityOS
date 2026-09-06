import { invalidateXpSummary } from "../cache/xp.cache.js";
import {
  dbCreateSession,
  dbFinishSession,
  dbFinishSessionWithXp,
  dbGetActiveSession,
  dbGetSubjectHours,
  dbPauseSession,
  dbResumeSession,
} from "../db/queries/pomodoro.queries.js";
import { getSubjectById } from "../db/queries/subjects.queries.js";
import type { startSessionSchemaInput } from "../schemas/pomodoro.schema.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/errors.js";
import {
  calculateActualSeconds,
  calculateResumeValues,
  canPause,
  canStart,
  getPresetXp,
  getRemainingPauseBudget,
  isValidPreset,
  resolveSession,
} from "../utils/pomodoro.utils.js";
import { getMilestone } from "./milestone.service.js";

// private helper shared 3 steps
async function resolveAndSync(userId: number, now: Date) {
  const session = await dbGetActiveSession(userId);
  if (!session) {
    return { session: undefined, verdict: null };
  }

  const verdict = resolveSession(session, now);
  if (verdict === "abandoned") {
    const actual = calculateActualSeconds(session, now);
    await dbFinishSession(userId, session.id, "abandoned", actual);
    return { session: undefined, verdict: "abandoned" };
  } else {
    return { session, verdict };
  }
}

// Service Starts Here
export async function getActiveSession(userId: number) {
  const now = new Date();
  const { session, verdict } = await resolveAndSync(userId, now);
  if (!session) {
    return { session: null, verdict };
  }
  const remainingBudget = getRemainingPauseBudget(session);
  const can_pause = canPause(session);
  return { session, verdict, remainingBudget, can_pause };
}

export async function startSession(
  userId: number,
  input: startSessionSchemaInput,
) {
  const now = new Date();
  const { session } = await resolveAndSync(userId, now);

  if (!canStart(session)) {
    throw new ConflictError("You already have a session running.");
  }
  if (!isValidPreset(input.planned_seconds)) {
    throw new ValidationError("Invalid duration");
  }

  //Ownership Check
  const subject = await getSubjectById(input.subject_id, userId);
  if (!subject) {
    throw new NotFoundError("Subject Not Found");
  }
  if (input.milestone_id) {
    const milestone = await getMilestone(input.milestone_id, userId);
    if (!milestone) {
      throw new NotFoundError("Milestone Not Found");
    }
    if (milestone.subject_id !== input.subject_id) {
      throw new ValidationError(
        "Milestone does not belong to the selected subject.",
      );
    }
  }

  try {
    return await dbCreateSession(
      userId,
      input.subject_id,
      input.milestone_id,
      input.planned_seconds,
    );
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "23505") {
      throw new ConflictError("You already have a session running.");
    }
    throw error;
  }
}

// The Payoff
export async function completeSession(userId: number) {
  const now = new Date();
  const { session, verdict } = await resolveAndSync(userId, now);
  if (!session) {
    throw new NotFoundError("No active session");
  }
  if (verdict === "running") {
    throw new ValidationError("Session is still running");
  }
  if (verdict === "paused") {
    throw new ValidationError("Resume before completing");
  }

  const actual = calculateActualSeconds(session, now);

  if (!isValidPreset(session.planned_seconds)) {
    throw new NotFoundError("Invalid Session Duration!");
  }

  const xp = getPresetXp(session.planned_seconds);
  const finished = await dbFinishSessionWithXp(
    userId,
    session.id,
    "completed",
    actual,
    session.subject_id,
    xp,
  );
  if (!finished) {
    throw new ConflictError("Session already finished.");
  }
  await invalidateXpSummary(userId);
  return { finished, xp };
}

// pause session
export async function pauseSession(userId: number) {
  const now = new Date();
  const { session, verdict } = await resolveAndSync(userId, now);
  if (!session) {
    throw new NotFoundError("No active session");
  }
  if (verdict !== "running") {
    throw new ValidationError("Session is not running");
  }
  if (!canPause(session)) {
    if (session.pause_count >= 2) {
      throw new ConflictError("Max pauses used.");
    }
    const remaining = getRemainingPauseBudget(session);
    throw new ConflictError(
      "You've used up your pause budget. Remaining: " + remaining + "s",
    );
  }

  const paused = await dbPauseSession(userId, session.id);
  if (!paused) {
    throw new ConflictError("Already Paused");
  }
  const remaining = getRemainingPauseBudget(paused);
  return { paused, remaining };
}

// resume session
export async function resumeSession(userId: number) {
  const now = new Date();
  const { session, verdict } = await resolveAndSync(userId, now);
  if (!session) {
    throw new NotFoundError("No session to resume");
  }
  if (verdict !== "paused") {
    throw new ValidationError("Not paused");
  }
  const { newEndsAt, newTotalPaused } = calculateResumeValues(session, now);
  const resumed = await dbResumeSession(
    userId,
    session.id,
    newEndsAt,
    newTotalPaused,
  );
  if (!resumed) {
    throw new ConflictError("Already Resumed");
  }
  return resumed;
}

// Get the actual hours invested in the subject
export async function getSubjectHours(userId: number) {
  return await dbGetSubjectHours(userId);
}
