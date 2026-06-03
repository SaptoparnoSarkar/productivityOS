export type Counter = {
    milestone_id: number,
    current_value: number,
    target_value: number,
    unit: string,
}

export type CreateCounterInput = {
    target_value: number,
    unit: string,
}

export type UpdateCounterInput = {
    current_value?: number;
    target_value?: number;
    unit?: string;
}

export type IncrementCounterInput = {
    delta: number;
}