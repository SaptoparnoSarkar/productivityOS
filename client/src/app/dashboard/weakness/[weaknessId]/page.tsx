"use client";

import { WeaknessNoteCard } from "@/components/weakness/WeaknessNoteCard";
import { listSubjects } from "@/lib/api/subjects";
import { createWeaknessNote, getWeaknessById, listWeaknessNotes } from "@/lib/api/weakness";
import { cn } from "@/lib/utils";
import { Subject } from "@/types/subject";
import { Weakness, WeaknessNote } from "@/types/weakness";
import { Dot, MoveLeft, MoveRight, Waypoints } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function WeaknessDetailPage() {
  const param = useParams();
  const id = Number(param.weaknessId);

  const [weakness, setWeakness] = useState<Weakness | null>(null);
  const [weaknessNotes, setWeaknessNotes] = useState<WeaknessNote[] | null>(null);
  const [subjects, setSubjects] = useState<Subject[] | null>(null);

  const [adding, setAdding] = useState(false);
  const [note, setNote] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");


  const load = useCallback(async () => {
    setError("");
    try {
      const weaknesses = await getWeaknessById(id);
      const weaknessNotes = await listWeaknessNotes(id)
      const subjects = await listSubjects();
      setWeakness(weaknesses);
      setWeaknessNotes(weaknessNotes);
      setSubjects(subjects);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load weakness",
      );
    } finally {
      setLoading(false);
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load]);


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!note.trim()) return;
    setAdding(true);
    try {
      await createWeaknessNote(id, { content: note })
      setNote("");
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create a note.")
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <div>Loading</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!weakness) return <div>Weakness not found</div>;

  return (
    <main className="flex flex-col gap-1 ml-14 mt-2 mr-12 mb-12">
      <Link href={"/dashboard/weakness/"} className="text-slate-500 flex gap-2 cursor-pointer hover:text-white transition-colors duration-200 "><MoveLeft />Back to Weaknessess</Link>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="header-text">{weakness.title}</h2>
          <div className={cn("flex items-center gap-2 p-2 border border-slate-500/50 rounded-3xl mt-2", weakness.status === "active" ? "text-orange-300 font-bold bg-orange-500/40 " : "text-green-300 font-bold bg-green-500/40 ")}>
            {weakness.status === "active" ? (
              <span>Active</span>
            ) : (
              <span>Resolved</span>
            )}
          </div>
        </div>

        <div>
          <button>Mark Resolved</button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-slate-400 font-semibold">
        <span className="bg-gray-500/40 p-2 px-3 rounded-2xl flex gap-2">Subject: <p className="text-slate-200">{weakness.subject_id ? (subjects?.find((s) => s.id === weakness.subject_id)?.title) : "No Subject"}</p> </span>
        <Dot />
        <span className="bg-gray-500/40 p-2 px-3 rounded-2xl flex gap-2">Created:  <p className="text-slate-200">{new Date(weakness.created_at).toLocaleDateString()}</p></span>
        <Dot />
        <span className="bg-gray-500/40 p-2 px-3 rounded-2xl flex gap-2"><p className="text-slate-200">{weaknessNotes?.length ?? 0}</p> Notes</span>
      </div>

      <div className="text-white text-2xl mt-8 border border-slate-400 p-5 pl-7 rounded-2xl bg-gray-400/40 max-w-[80%]">
        {weakness.description ? weakness.description : <p className="text-center text-slate-400">Weakness has no description</p>}
      </div>

      <div className="grid grid-cols-[1450px_450px] gap-6 mt-10">

        <div className="flex flex-col">
          <h2 className="text-4xl text-white font-bold mb-5">Journal</h2>
          {/* TODO 1: empty state. If weaknessNotes is null or length 0,
      show a dashed-border box like your weakness list page:
      icon + "No notes yet" + "Your first entry starts the timeline." */}
          {(weaknessNotes?.length ?? 0) < 1 ?
            (
              <div className="flex flex-col w-[1400px] items-center gap-3 justify-center border-2 border-dashed border-gray-700 rounded-2xl transition-all duration-300 h-120 cursor-default">
                <Waypoints size={64} strokeWidth={1.5} className="text-purple-500/40 mb-10" />
                <h3 className="text-white font-bold text-4xl">No notes yet</h3>
                <p className="text-slate-300 text-2xl ">Your first entry starts the timeline.</p>
                <p className="text-slate-400 text-lg">Write what you tried, what broke, and what you learned.</p>
                <p className="flex gap-2 text-purple-400/80 mt-9 font-semibold text-2xl items-center">Use the panel on the right <MoveRight /></p>

              </div>
            ) :
            (
              <div>
                {weaknessNotes?.map((notes) => (
                  <li key={notes.id} className="relative pl-8 pb-8 last:pb-0" >
                    <div
                      aria-hidden
                      className="absolute left-[5px] top-5 h-full w-px bg-slate-700 group-last:hidden"
                    />
                    <div
                      aria-hidden
                      className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-purple-500 ring-4 ring-purple-500/20"
                    />
                    <WeaknessNoteCard createdAt={notes.created_at} content={notes.content} />

                  </li>
                ))}
              </div>
            )}
        </div>

        <div className=" lg:sticky lg:top-6 self-start">
          <div className="bg-gray-500/40 p-6 rounded-2xl border border-slate-400">
            <h2 className="text-white text-3xl font-bold">Add a note</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <textarea
                rows={10}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What did you learn or try today?"
                disabled={adding}
                className=" p-2 w-auto mt-4 border rounded-lg border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-white"
              />
              <button type="submit" className="bg-purple-600/80 text-white py-3 rounded-lg hover:bg-purple-500/80 transition duration-200 cursor-pointer mt-4" disabled={adding || note.trim() === ""} >{adding ? "Saving..." : "Save Note"}</button>
              <p className="text-slate-300/80 text-sm mt-4">Notes are append-only. Short and honest beats long and perfect.</p>
            </form>

          </div>
        </div>
      </div>

    </main>
  )
}


