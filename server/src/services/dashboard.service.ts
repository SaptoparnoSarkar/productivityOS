import { dbGetMetricData } from "../db/queries/dashboard.queries.js";
import { dbGetTodayXp } from "../db/queries/xp.queries.js";


export async function getDashboardMetrics(userId: number) {
  const result = Promise.all([dbGetMetricData(userId), dbGetTodayXp(userId)]);
  const [metrics, xpToday] = await result;
  return {
    totalSubjects: metrics.total_subjects,
    activeMilestones: metrics.active_milestones,
    completedDailies: metrics.completed_dailies,
    xpToday: xpToday,
  };
}
