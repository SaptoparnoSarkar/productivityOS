import { Dashboard } from "@/types/dashboard";
import { apiClient } from "../apiClient";

export async function dashboardMetric(): Promise<Dashboard> {
  const response = await apiClient<Dashboard>(`/api/dashboard/stats`);
  return response;
}
