export type MilestoneType = 'counter' | 'checklist';

export type Milestone = {
    id: number;
    subject_id: number;
    type: MilestoneType;
    title: string;
    description: string | null;
    daily_minimum: number | null;
    daily_minimum_unit: string | null;
    weekly_minimum: number | null;
    created_at: string;
    updated_at: string;
}

export type CreateMilestoneInput = {
    type: MilestoneType;
    title: string;
    description?: string | null;
    daily_minimum?: number;
    daily_minimum_unit?: string;
    weekly_minimum?: number;

}

export type UpdateMilestoneInput = Partial<Omit<CreateMilestoneInput, 'type'>>;

