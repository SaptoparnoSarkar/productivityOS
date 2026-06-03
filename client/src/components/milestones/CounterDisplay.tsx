'use client';

import { getCounter, incrementCounter, resetCounter, updateCounter } from "@/lib/api/counters";
import { Counter } from "@/types/counter";
import { useCallback, useEffect, useState } from "react";
import { CounterForm } from "./CounterForm";

type Props = {
    milestoneId: number;
}

export default function CounterDisplay({ milestoneId }: Props) {

    const [counter, setCounter] = useState<Counter | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')
    const [isEditing, setIsEditing] = useState(false)

    const loadCounter = useCallback(async () => {
        try {
            const data = await getCounter(milestoneId);
            setCounter(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load counter');
        } finally {
            setLoading(false);
        }
    }, [milestoneId])

    useEffect(() => {
        loadCounter()
    }, [loadCounter]);

    async function handleIncrement() {
        if (!counter) return;
        try {
            await incrementCounter(milestoneId, { delta: 1 })
            await loadCounter();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update counter')
        }
    }
    async function handleReset() {
        if (!confirm('Reset counter to 0 ?')) return;
        try {
            await resetCounter(milestoneId);
            await loadCounter()
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to reset counter')
        }
    }


    if (loading) return <div>loading...</div>
    if (error) return <div className="form-error">{error}</div>
    if (!counter) return <div>No Counter Found</div>
    if (isEditing) {
        return (
            <CounterForm
                mode='edit'
                defaultValues={{ target_value: counter.target_value, unit: counter.unit }}
                onSubmit={async (values) => {
                    await updateCounter(milestoneId, values)
                    await loadCounter();
                    setIsEditing(false);
                }}
            />

        )
    }
    return (
        <div>
            <p>{counter.current_value}/{counter.target_value}{counter.unit}</p>
            <button type="button" onClick={handleIncrement} disabled={counter.current_value >= counter.target_value}>+1</button>
            <button type="button" onClick={handleReset} >Reset</button>
            <button type="button" onClick={() => setIsEditing(true)}>Edit</button>

        </div>
    )
}