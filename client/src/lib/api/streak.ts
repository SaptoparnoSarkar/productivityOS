import { StreakWeek } from "@/types/streak";
import { apiClient } from "../apiClient";

export async function streakWeek(): Promise<StreakWeek> {
  const response = await apiClient<StreakWeek>(`/api/streaks/week`);
  return response;
}
