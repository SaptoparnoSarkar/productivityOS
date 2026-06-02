'use client'

import { listMilestones } from "@/lib/api/milestones";
import { Milestone } from "@/types/milestone";
import Link from "next/link";
import { useEffect, useState } from "react"

type Props = {
    subjectId: number
}


export function MilestoneList({ subjectId }: Props) {

    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        setError('');
        setLoading(true);
        async function fetchMilestones() {
            try {
                const data = await listMilestones(subjectId);
                setMilestones(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occured. Please try again.')
            }
            finally {
                setLoading(false)
            }
        }
        fetchMilestones();
    }, [subjectId])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    return (

        <>
            {milestones.length === 0 ? (
                <div>
                    <p>No Milestones Yet.</p>
                    <Link href={`/subjects/${subjectId}/milestones/new`}>
                        Click here to create your first milestone.
                    </Link>
                </div>
            ) : (

                <ul>
                    {milestones.map((m) => (
                        <li key={m.id}>
                            <Link href={`/subjects/${subjectId}/milestones/${m.id}`}>{m.title}</Link>
                            <span> — {m.type}</span>
                            {m.due_date && <span> (due {m.due_date})</span>}

                            <Link href={`/subjects/${subjectId}/milestones/new`}>
                                Create New Milestone
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}