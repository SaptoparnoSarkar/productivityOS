'use client';

import { getCounter, incrementCounter, updateCounter } from "@/lib/api/counters";
import { Counter } from "@/types/counter";
import { useCallback, useEffect, useState } from "react";
import { Progress } from "../ui/progress";

type Props = {
    milestoneId: number;
}

export default function CounterDisplay({ milestoneId }: Props) {

    const [counter, setCounter] = useState<Counter | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')
    const [inputError, setInputError] = useState<string>('')

    // Editing Values in the Counter
    const [isEditing, setIsEditing] = useState(false)
    const [targetInput, setTargetInput] = useState<number>(1);
    const [unitInput, setUnitInput] = useState<string>('');



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
            setInputError(error instanceof Error ? error.message : 'Failed to update counter')
        }
    }

    async function handleDecrement() {
        if (!counter) return;
        setInputError("");
        try {
            await incrementCounter(milestoneId, { delta: -1 })
            await loadCounter()
        } catch (error) {
            setInputError(error instanceof Error ? error.message : 'Failed to update counter')
        }
    }


    async function handleSave() {
        try {
            await updateCounter(milestoneId, { target_value: targetInput, unit: unitInput })
            setIsEditing(false)
            setInputError('')
            await loadCounter()
        } catch (error) {
            setInputError(error instanceof Error ? error.message : 'Failed to edit counter')
        }
    }



    const progressPercent = counter?.target_value ? (
        Math.min(100, Math.round((counter.current_value / counter.target_value) * 100))
    ) : 0;

    if (loading) return <div>loading...</div>
    if (error) return <div className="form-error">{error}</div>
    if (!counter) return <div>No Counter Found</div>


    return (
        <section>
            {isEditing && (
                <div className="relative">
                    <div className="flex gap-2 w-full items-center justify-end absolute top-3 right-2 z-10">
                        <input type="number" min={1} max={1000} defaultValue={counter.target_value} onChange={(e) => { setTargetInput(Number(e.target.value)) }} className="w-15 p-1 border border-zinc-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-zinc-100 cursor-pointer" />
                        <input type="text" defaultValue={counter.unit} onChange={(e) => setUnitInput(e.target.value)} className="w-40 p-1 border border-zinc-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-zinc-100 cursor-pointer" />
                        <button type="button" onClick={handleSave} className="bg-blue-500/80 p-1 px-2 border border-zinc-700 rounded-lg hover:bg-blue-500 transition duration-200 cursor-pointer text-zinc-100">Save</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="bg-zinc-700/30 p-1 px-2 border border-zinc-700 rounded-lg hover:bg-zinc-600/40 transition duration-200 cursor-pointer text-zinc-100">Cancel</button>
                        {inputError && <div className="text-red-500 absolute top-10">{inputError}</div>}
                    </div>


                </div>
            )}
            <div className="flex justify-between">
                <div className="flex gap-4 items-center">
                    <p className="text-6xl font-bold">{counter.current_value}</p>
                    <p className="text-6xl font-bold text-white/60">/{counter.target_value}</p>
                </div>
                <button type="button" onClick={() => { setTargetInput(counter.target_value); setUnitInput(counter.unit); setIsEditing(true) }} disabled={isEditing} className="cursor-pointer text-slate-500 hover:text-white transition duration-200 disabled:opacity-0 disabled:cursor-default">Edit Target</button>
            </div>
            <span className="text-sm text-white/60 font-semibold">{counter.unit}</span>

            <div className="mt-4"><Progress value={progressPercent} className="w-full" /></div>

            <div className="flex gap-4 mt-4">
                <button type="button" onClick={handleDecrement} disabled={counter.current_value <= 0} className="bg-gray-400/10 border border-slate-500/40 px-4 py-2 rounded-lg hover:bg-gray-400/20 transition duration-200 cursor-pointer text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">-1</button>
                <button type="button" onClick={handleIncrement} disabled={counter.current_value >= counter.target_value} className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-400 transition duration-200 cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed">+1</button>

            </div>


        </section>
    )
}