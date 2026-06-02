import { Counter, CreateCounterInput } from "@/types/counter";
import { apiClient } from "../apiClient";

export async function createCounter(
    milestoneId: number,
    input: CreateCounterInput
): Promise<Counter> {
    const response = await apiClient<{ message: string, counter: Counter }>(`/api/milestones/${milestoneId}/counter`, {
        method: 'POST',
        body: JSON.stringify(input)
    })
    return response.counter;
}

export async function getCounter(
    milestoneId: number
): Promise<Counter> {
    const response = await apiClient<{ counter: Counter }>(`/api/milestones/${milestoneId}/counter`);
    return response.counter;
}

//Code smell, fix it later
export async function updateCounter(
    milestoneId: number,
    input: CreateCounterInput
): Promise<Counter> {
    const response = await apiClient<{ message: string, counter: Counter }>(`/api/milestones/${milestoneId}/counter`, {
        method: 'PATCH',
        body: JSON.stringify(input)
    });
    return response.counter;
}
