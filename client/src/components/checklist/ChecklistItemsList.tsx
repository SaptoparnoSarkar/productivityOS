"use client";

import { getChecklistTarget, setChecklistTarget } from "@/lib/api/checklist";
import {
  createChecklistItem,
  deleteChecklistItem,
  listChecklistItems,
  updateChecklistItem,
} from "@/lib/api/checklistItems";
import { ChecklistItem } from "@/types/checklistItem";
import { Pencil, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

type Props = {
  milestoneId: number;
};

export default function ChecklistItemsList({ milestoneId }: Props) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");

  //Target and Target Edit
  const [target, setTarget] = useState<number | null>(null);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState<number>(1);

  //Input for the inline "add item"
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);

  //For editing Label
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const loadItems = useCallback(async () => {
    try {
      const data = await listChecklistItems(milestoneId);
      setItems(data);
      const target = await getChecklistTarget(milestoneId);
      setTarget(target.target_count);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to Load");
    } finally {
      setLoading(false);
    }
  }, [milestoneId]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // useEffect(() => {
  //   if (inputError) {
  //     const timer = setTimeout(() => {
  //       setInputError("");
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [inputError]);

  //For toggling the checkbox
  async function handleToggle(item: ChecklistItem) {
    try {
      await updateChecklistItem(item.id, milestoneId, {
        is_done: !item.is_done,
      });
      await loadItems();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update");
    }
  }

  //Add Handler - create, clear input, refetch
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const label = newLabel.trim();
    if (!label) return setInputError("Please enter a label");
    setAdding(true);
    try {
      await createChecklistItem(milestoneId, { label: label });
      setNewLabel("");
      setInputError("");
      await loadItems();
    } catch (error) {
      setInputError(error instanceof Error ? error.message : "Failed to add item");
    } finally {
      setAdding(false);
    }
  }

  //Save Handler for Editing Checklist Items
  async function handleSaveLabel(itemId: number) {
    const label = editLabel.trim();
    if (!label) return setInputError("Please enter a label");
    try {
      await updateChecklistItem(itemId, milestoneId, { label });
      setEditingId(null);
      setInputError("");
      await loadItems();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update label",
      );
    }
  }

  //Save Handler for Editing Checklist Target
  async function handleSaveTarget() {
    try {
      await setChecklistTarget(milestoneId, { target_count: targetInput });
      setEditingTarget(false);
      setInputError("");
      await loadItems();
    } catch (error) {
      setInputError(
        error instanceof Error ? error.message : "Failed to update target",
      );
    }
  }

  //Delete Handler
  async function handleDelete(itemId: number) {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteChecklistItem(itemId, milestoneId);
      await loadItems();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete");
    }
  }
  //Count of done checklist items
  const doneCount = items.filter((i) => i.is_done).length;
  const isComplete = target !== null && doneCount >= target;

  const progressPercent = target ? Math.min(100, Math.round((doneCount / target) * 100)) : 0;

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <section className="w-280 max-w-6xl">

      {editingTarget && (
        <div className="relative">
          <div className="flex gap-2 w-full items-center justify-end absolute bottom-0.5 right-2 z-10">

            <input type="number" min={1} max={100} value={targetInput} onChange={(e) => setTargetInput(Number(e.target.value))} className="w-48 p-1 border border-zinc-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-zinc-100 cursor-pointer" />
            <button type="button" onClick={handleSaveTarget} className="bg-blue-500/80 p-1 px-2 border border-zinc-700 rounded-lg hover:bg-blue-500 transition duration-200 cursor-pointer text-zinc-100">Save</button>
            <button type="button" onClick={() => setEditingTarget(false)} className="bg-zinc-700/30 p-1 px-2 border border-zinc-700 rounded-lg hover:bg-zinc-600/40 transition duration-200 cursor-pointer text-zinc-100">Cancel</button>

            {inputError && <div className="text-red-500 absolute top-10">{inputError}</div>}

          </div>

        </div>
      )}
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span>{doneCount} / {target} done {isComplete && "✅"}</span>
          <button type="button" onClick={() => { setEditingTarget(true); setTargetInput(target || 1); }} disabled={editingTarget} className="cursor-pointer flex gap-2 items-center text-slate-500 hover:text-white transition duration-200 disabled:opacity-0 disabled:cursor-default">{`Target ${target}`}<Pencil size={20} /></button>
        </div>
        <div className="mt-2">
          <Progress value={progressPercent} className="w-full" />
        </div>
      </div>


      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <hr className="border-gray-500/30 mt-4" />
              {editingId === item.id ? (
                //EDIT MODE
                <div className="flex gap-2 mt-4">
                  <input className="w-[85%] p-2 border rounded-lg border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-white"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => handleSaveLabel(item.id)}
                    className="bg-blue-500/80 text-white px-2 pr-3 py-1 rounded-lg hover:bg-blue-500 transition duration-200 cursor-pointer"
                  >
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingId(null)} className="bg-zinc-700/30 p-1 px-2 border border-zinc-700 rounded-lg hover:bg-zinc-600/40 transition duration-200 cursor-pointer text-zinc-100">
                    Cancel
                  </button>
                </div>
              ) : (
                //NORMAL MODE
                <div className="flex gap-2 mt-4 justify-between">
                  <div className="flex gap-4">
                    <input
                      type="checkbox"
                      checked={item.is_done}
                      onChange={() => handleToggle(item)}
                      className="cursor-pointer"
                    />
                    <span className={cn("text-md", item.is_done && "line-through text-white/40")}>{item.label}</span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditLabel(item.label);
                      }}
                      className="cursor-pointer text-slate-500 hover:text-white transition duration-200"
                    >
                      <Pencil size={20} />
                    </button>
                    <button type="button" onClick={() => handleDelete(item.id)} className="cursor-pointer text-slate-500 hover:text-red-500 transition duration-200">
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
          <form onSubmit={handleAdd} className="flex gap-2 mt-4">
            <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Add item..." disabled={adding} className="w-[92%] p-2 border rounded-lg border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-white" />
            <button type="submit" disabled={adding || newLabel.trim() === ""} className="bg-blue-500/80 text-white px-2 pr-3 py-1 rounded-lg hover:bg-blue-500 transition duration-200 cursor-pointer">
              {adding ? "Adding..." : "+ Add"}
            </button>
          </form>
        </ul>
      )}
    </section>
  );
}
