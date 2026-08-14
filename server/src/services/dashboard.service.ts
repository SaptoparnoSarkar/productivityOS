import { dbGetMetricData } from "../db/queries/dashboard.queries.js";
import { getStreakCount } from "./streak.service.js";

export async function getDashboardMetrics(userId: number) {
  const result = Promise.all([dbGetMetricData(userId), getStreakCount(userId)]);
  const [metrics, streakCount] = await result;
  return {
    totalSubjects: metrics.total_subjects,
    activeMilestones: metrics.active_milestones,
    completedDailies: metrics.completed_dailies,
    streak: streakCount,
  };
}
