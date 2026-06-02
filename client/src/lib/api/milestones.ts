//unwrapper of envelope

import { apiClient } from "../apiClient";
import { CreateMilestoneInput, Milestone, UpdateMilestoneInput } from "@/types/milestone";

export async function listMilestones(subjectId: number): Promise<Milestone[]> {
    const response = await apiClient<{ milestones: Milestone[] }>(`/api/subjects/${subjectId}/milestones`,
        { method: "GET" }
    );
    return response.milestones;
}

export async function getMilestone(
    subjectId: number,
    milestoneId: number,
): Promise<Milestone> {
    const response = await apiClient<{ milestone: Milestone }>(`/api/subjects/${subjectId}/milestones/${milestoneId}`,
        { method: "GET" }
    );
    return response.milestone;
}

export async function createMilestone(
    subjectId: number,
    input: CreateMilestoneInput,
): Promise<Milestone> {
    const response = await apiClient<{ message: string; milestone: Milestone }>(`/api/subjects/${subjectId}/milestones`, {
        method: "POST",
        body: JSON.stringify(input),
    })

    return response.milestone;
}


export async function updateMilestone(
    subjectId: number,
    milestoneId: number,
    input: UpdateMilestoneInput,
): Promise<Milestone> {
    const response = await apiClient<{ message: string, milestone: Milestone }>(`/api/subjects/${subjectId}/milestones/${milestoneId}`, {
        method: "PATCH",
        body: JSON.stringify(input),
    },
    )
    return response.milestone;
}


export async function deleteMilestone(
    subjectId: number,
    milestoneId: number,
): Promise<void> {
    await apiClient<{ message: string }>(`/api/subjects/${subjectId}/milestones/${milestoneId}`, {
        method: "DELETE"
    })
}