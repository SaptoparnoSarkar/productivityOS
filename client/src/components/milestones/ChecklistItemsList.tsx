'use client'

import { listChecklistItems } from "@/lib/api/checklistItems";
import { ChecklistItem } from "@/types/checklistItem";
import { useEffect, useState } from "react";

interface Props {
    milestoneId: number;
}

export default function ChecklistItemsList({ milestoneId }: Props) {

    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        setError('');
        setLoading(true);
        async function loadItems() {
            try {
                const data = await listChecklistItems(milestoneId);
                setItems(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to Load');
            } finally {
                setLoading(false);
            }
        }
        loadItems();
    }, [milestoneId]);

    if (loading) return <p>Loading...</p>
    if (error) return <p className="text-red-500">{error}</p>
    if (items.length === 0) return <p>No items yet.</p>
    return (
        <ul>
            {items.map((item) => (

                <li key={item.id}>
                    <input type="checkbox" checked={item.is_done} readOnly />
                    {item.label}
                </li>

            ))}
        </ul>
    )
}