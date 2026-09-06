import { WeekResponse, TodayContractStatus } from "@/types/streak";
import { apiClient } from "../apiClient";

export async function streakWeek(): Promise<WeekResponse> {
  const response = await apiClient<WeekResponse>(`/api/streaks/week`);
  return response;
}

export async function todayStatus(): Promise<TodayContractStatus> {
  const response = await apiClient<TodayContractStatus>(
    `/api/streaks/streak_contract/today-status`,
  );
  return response;
}
