import { invalidateXpSummary } from "../cache/xp.cache.js";
import {
  dbCreateSession,
  dbAbandonSession,
  dbFinishSessionWithXp,
  dbGetActiveSession,
  dbGetSubjectHours,
  dbGetTotalAllSubjectHours,
  dbPauseSession,
  dbResumeSession,
  dbGetRecentPomodoroSessions,
  dbGetTodayHours,
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
  getRemainingPauseDuration,
  isValidPreset,
  resolveSession,
} from "../utils/pomodoro.utils.js";
import { getMilestone } from "./milestone.service.js";

//Helper Function
async function resolveAndSync(userId: number, now: Date) {
  const session = await dbGetActiveSession(userId);
  if (!session) {
    return { session: undefined, verdict: null };
  }

  const verdict = resolveSession(session, now);

  if (verdict === "pause_expired") {
    const { newEndsAt, newTotalPaused } = calculateResumeValues(session, now);

    const resumed = await dbResumeSession(
      userId,
      session.id,
      newEndsAt,
      newTotalPaused,
    );

    // Handle another req winning the race
    if (!resumed) {
      const latestSession = await dbGetActiveSession(userId);

      return {
        session: latestSession,
        verdict: latestSession ? resolveSession(latestSession, now) : null,
      };
    }
    return {
      session: resumed,
      verdict: "running",
    };
  }

  if (verdict === "abandoned") {
    const actualSeconds = calculateActualSeconds(session, now);
    await dbAbandonSession(userId, session.id, actualSeconds);
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

  const remainingBudget = getRemainingPauseDuration(session);
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
    const remaining = getRemainingPauseDuration(session);
    throw new ConflictError(
      "You've used up your pause budget. Remaining: " + remaining + "s",
    );
  }

  const paused = await dbPauseSession(userId, session.id);
  if (!paused) {
    throw new ConflictError("Already Paused");
  }
  const remaining = getRemainingPauseDuration(paused);
  return { paused, remaining };
}

// resume session
export async function resumeSession(userId: number) {
  const now = new Date();
  const { session, verdict } = await resolveAndSync(userId, now);

  if (!session) {
    throw new NotFoundError("No session to resume");
  }
  if (verdict === "running" && session.status === "active") {
    return session;
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

export async function getTotalAllSubjectHours(userId: number) {
  return await dbGetTotalAllSubjectHours(userId);
}

export async function abandonSession(userId: number) {
  const now = new Date();
  const session = await dbGetActiveSession(userId);
  if (!session) throw new NotFoundError("Session not found");

  const actualSeconds = calculateActualSeconds(session, now);
  const abandoned = await dbAbandonSession(userId, session.id, actualSeconds);

  if (!abandoned) throw new ConflictError("Session already finished");
  return abandoned;
}

export async function getSummary(userId: number) {
  const recents = await dbGetRecentPomodoroSessions(userId, 5);
  const todayTotalHours = await dbGetTodayHours(userId);
  const subjectHours = await dbGetSubjectHours(userId);

  return { recents, todayTotalHours, subjectHours };
}
