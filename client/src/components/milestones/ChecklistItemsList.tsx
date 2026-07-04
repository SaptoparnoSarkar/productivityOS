'use client'

import { createChecklistItem, deleteChecklistItem, listChecklistItems, updateChecklistItem } from "@/lib/api/checklistItems";
import { ChecklistItem } from "@/types/checklistItem";
import { useCallback, useEffect, useState } from "react";



interface Props {
    milestoneId: number;
}

export default function ChecklistItemsList({ milestoneId }: Props) {

    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    //Input for the inline "add item"
    const [newLabel, setNewLabel] = useState('');
    const [adding, setAdding] = useState(false);

    //For editing Label
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editLabel, setEditLabel] = useState('');

    const loadItems = useCallback(async () => {
        try {
            const data = await listChecklistItems(milestoneId);
            setItems(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to Load');
        } finally {
            setLoading(false);
        }
    }, [milestoneId])

    useEffect(() => {
        loadItems();
    }, [loadItems])

    //For toggling the checkbox
    async function handleToggle(item: ChecklistItem) {
        try {
            await updateChecklistItem(item.id, milestoneId, { is_done: !item.is_done });
            await loadItems();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update');
        }
    }

    //Add Handler - create, clear input, refetch
    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        const label = newLabel.trim();
        if (!label) return;
        setAdding(true);
        try {
            await createChecklistItem({ milestone_id: milestoneId, label })
            setNewLabel('');
            await loadItems();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to add item');
        } finally {
            setAdding(false);
        }
    }

    //Save Handler for Edit
    async function handleSaveLabel(itemId: number) {
        const label = editLabel.trim();
        if (!label) return;
        try {
            await updateChecklistItem(itemId, milestoneId, { label });
            setEditingId(null);
            await loadItems();
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update label')
        }
    }

    //Delete Handler 
    async function handleDelete(itemId: number) {
        if (!confirm('Delete this item?')) return;
        try {
            await deleteChecklistItem(itemId, milestoneId)
            await loadItems();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete');
        }
    }


    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-red-500">{error}</div>

    return (
        <div>
            {/* tiny inline add form */}
            <form onSubmit={handleAdd}>
                <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Add an item..."
                    disabled={adding}
                />
                <button type="submit" disabled={adding || newLabel.trim() === ''}>
                    {adding ? 'Adding...' : 'Add'}
                </button>
            </form>

            {items.length === 0 ? (
                <p>No items yet.</p>
            ) : (
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>
                            {editingId === item.id ? (
                                //EDIT MODE
                                <>
                                    <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} />
                                    <button type="button" onClick={() => handleSaveLabel(item.id)}>Save</button>
                                    <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                                </>
                            ) : (
                                //NORMAL MODE
                                <>
                                    <input type="checkbox" checked={item.is_done} onChange={() => handleToggle(item)} />
                                    {item.label}
                                    <button type="button" onClick={() => { setEditingId(item.id); setEditLabel(item.label); }}>Edit</button>
                                    <button type='button' onClick={() => handleDelete(item.id)}>
                                        X
                                    </button>
                                </>
                            )}

                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
