import { Counter, CreateCounterInput, IncrementCounterInput, UpdateCounterInput } from "@/types/counter";
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

export async function updateCounter(
    milestoneId: number,
    input: UpdateCounterInput
): Promise<Counter> {
    const response = await apiClient<{ message: string, counter: Counter }>(`/api/milestones/${milestoneId}/counter`, {
        method: 'PATCH',
        body: JSON.stringify(input)
    });
    return response.counter;
}

export async function incrementCounter(
    milestoneId: number,
    input: IncrementCounterInput
): Promise<Counter> {
    const response = await apiClient<{ message: string, increment: Counter }>(`/api/milestones/${milestoneId}/counter/increment`, {
        method: 'POST',
        body: JSON.stringify(input)
    })
    return response.increment;
}

export async function resetCounter(
    milestoneId: number
): Promise<Counter> {
    const response = await apiClient<{ message: string, counter: Counter }>(`/api/milestones/${milestoneId}/counter/reset`, {
        method: 'POST',
    })
    return response.counter;
}