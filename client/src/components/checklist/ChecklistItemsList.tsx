'use client'

import { getChecklistTarget, setChecklistTarget } from "@/lib/api/checklist";
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

    //Target and Target Edit
    const [target, setTarget] = useState<number | null>(null);
    const [editingTarget, setEditingTarget] = useState(false);
    const [targetInput, setTargetInput] = useState<number>(1);

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
            const target = await getChecklistTarget(milestoneId);
            setTarget(target.target_count);

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
            await createChecklistItem(milestoneId, { label: label });
            setNewLabel('');
            await loadItems();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to add item');
        } finally {
            setAdding(false);
        }
    }


    //Save Handler for Editing Checklist Items
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

    //Save Handler for Editing Checklist Target
    async function handleSaveTarget() {
        try {
            await setChecklistTarget(milestoneId, { target_count: targetInput });
            setEditingTarget(false);
            await loadItems();
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update target');
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
    //Count of done checklist items
    const doneCount = items.filter(i => i.is_done).length;
    const isComplete = target !== null && doneCount >= target;


    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-red-500">{error}</div>

    return (
        <div>
            {editingTarget ? (
                <>
                    <input type="number" min={1} max={100} value={targetInput} onChange={(e) => setTargetInput(Number(e.target.value))} />
                    <button type="button" onClick={handleSaveTarget}>Save</button>
                    <button type="button" onClick={() => setEditingTarget(false)}>Cancel</button>
                </>
            ) : (
                <>
                    <span>{doneCount} / {target} done {isComplete && '✅'}</span>
                    <button type="button" onClick={() => { setEditingTarget(true); setTargetInput(target || 1) }}> Edit Target </button>
                </>
            )
            }

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
