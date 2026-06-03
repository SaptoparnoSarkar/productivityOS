export type ChecklistItem = {
    id: number,
    milestone_id: number,
    label: string,
    is_done: boolean
}

export type CreateChecklistItemInput = {
    milestone_id: number,
    label: string
}

export type UpdateChecklistItemInput = {
    label?: string,
    is_done?: boolean
}
