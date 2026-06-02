export type MilestoneType = 'counter' | 'checklist';

export type Milestone = {
    id: number;
    subject_id: number;
    type: MilestoneType;
    title: string;
    description: string | null;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}

export type CreateMilestoneInput = {
    type: MilestoneType;
    title: string;
    description?: string | null;
    due_date?: string | null;
}

export type UpdateMilestoneInput = Partial<Omit<CreateMilestoneInput, 'type'>>;

