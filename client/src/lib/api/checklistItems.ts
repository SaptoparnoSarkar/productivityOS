import { ChecklistItem, CreateChecklistItemInput, UpdateChecklistItemInput } from "@/types/checklistItem";
import { apiClient } from "../apiClient";


export async function createChecklistItem(
    milestoneId: number,
    input: CreateChecklistItemInput
): Promise<ChecklistItem> {
    const response = await apiClient<{ message: string; checklistItem: ChecklistItem }>(`/api/milestones/${milestoneId}/checklist-items`, {
        method: "POST",
        body: JSON.stringify(input),
    })
    return response.checklistItem
}

export async function listChecklistItems(
    milestoneId: number,
): Promise<ChecklistItem[]> {
    const response = await apiClient<{ checklistItems: ChecklistItem[] }>(`/api/milestones/${milestoneId}/checklist-items`);
    return response.checklistItems;
}

export async function updateChecklistItem(
    checklistItemId: number,
    milestoneId: number,
    input: UpdateChecklistItemInput,
): Promise<ChecklistItem> {
    const response = await apiClient<{ checklistItem: ChecklistItem }>(`/api/milestones/${milestoneId}/checklist-items/${checklistItemId}`, {
        method: "PATCH",
        body: JSON.stringify(input),
    });
    return response.checklistItem;
}

export async function deleteChecklistItem(
    milestoneId: number,
    checklistItemId: number,
): Promise<void> {
    await apiClient<{ message: string }>(`/api/milestones/${milestoneId}/checklist-items/${checklistItemId}`, {
        method: "DELETE",
    });
}