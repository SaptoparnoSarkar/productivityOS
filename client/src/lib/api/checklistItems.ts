import { ChecklistItem } from "@/types/checklistItem";
import { apiClient } from "../apiClient";


export async function createChecklistItem(
    milestoneId: number,
    label: string,
): Promise<ChecklistItem> {
    const response = await apiClient<{ message: string; checklistItem: ChecklistItem }>(`/api/milestones/${milestoneId}/checklist-items`, {
        method: "POST",
        body: JSON.stringify({ label }),
    })
    return response.checklistItem
}

export async function listChecklistItems(
    milestoneId: number,
): Promise<ChecklistItem[]> {
    const response = await apiClient<{ checklistItems: ChecklistItem[] }>(`/api/milestones/${milestoneId}/checklist-items`);
    return response.checklistItems;
}

export async function getChecklistItem(
    checklistItemId: number
): Promise<ChecklistItem> {
    const response = await apiClient<{ checklistItem: ChecklistItem }>(`/api/checklist-items/${checklistItemId}`)
    return response.checklistItem
}

export async function updateChecklistItem(
    checklistItemId: number,
    input: {
        label?: string;
        is_done?: boolean;
    },
): Promise<ChecklistItem> {
    const response = await apiClient<{ checklistItem: ChecklistItem }>(`/api/checklist-items/${checklistItemId}`, {
        method: "PATCH",
        body: JSON.stringify(input),
    });
    return response.checklistItem;
}

export async function deleteChecklistItem(
    checklistItemId: number,
): Promise<void> {
    await apiClient<{ message: string }>(`/api/checklist-items/${checklistItemId}`, {
        method: "DELETE",
    });
}