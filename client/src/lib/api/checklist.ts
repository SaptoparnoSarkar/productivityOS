import { ChecklistTarget, SetChecklistTargetInput } from "@/types/checklist";
import { apiClient } from "../apiClient";


export async function setChecklistTarget(
    milestoneId: number,
    input: SetChecklistTargetInput
): Promise<ChecklistTarget> {
    const response = await apiClient<{ message: string, checklistTarget: ChecklistTarget }>(
        `/api/milestones/${milestoneId}/checklist-target`, {
        method: 'POST',
        body: JSON.stringify(input),
    }
    )
    return response.checklistTarget;
}

export async function getChecklistTarget(
    milestoneId: number
): Promise<ChecklistTarget> {
    const response = await apiClient<{ message: string, checklistTarget: ChecklistTarget }>(
        `/api/milestones/${milestoneId}/checklist-target`
    );
    return response.checklistTarget;
}
