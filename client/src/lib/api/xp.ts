import { XpLogResponse, XpSummaryResponse } from "@/types/xp";
import { apiClient } from "../apiClient";

//  GET /api/xp/summary -> { message, summary: { totalXp, rank, progress } }
export async function getXpSummary(): Promise<XpSummaryResponse> {
    const response = await apiClient<XpSummaryResponse>(`/api/xp/summary`)
    return response;
}


// GET /api/xp/log?page={page}&limit=10
export async function getXpLog(page: number = 1): Promise<XpLogResponse> {
    const response = await apiClient<XpLogResponse>(`/api/xp/log?page=${page}&limit=10`)
    return response;
}
