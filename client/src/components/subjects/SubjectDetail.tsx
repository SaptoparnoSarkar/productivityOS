'use client';

import { deleteSubject, getSubject } from "@/lib/api/subjects";
import { Subject } from "@/types/subject";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MilestoneList } from "../milestones/MilestoneList";
import Link from "next/link";

import { BookOpen, Edit2, Loader, Plus, PlusIcon, Target, Trash2 } from "lucide-react";


export default function SubjectDetail() {
    const params = useParams();
    const id = Number(params.id);

    const [subject, setSubject] = useState<Subject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    //Delete
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string>('');
    const router = useRouter();



    useEffect(() => {
        if (Number.isNaN(id)) {
            setError("Invalid subject ID");
            setLoading(false);
            return;
        }
        async function fetchSubject() {
            try {
                const data = await getSubject(id);
                setSubject(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An error occurred. Please try again",
                );
            } finally {
                setLoading(false);
            }
        }

        fetchSubject();
    }, [id]);

    //Delete Handler
    async function handleDelete() {
        if (!window.confirm('Are you sure?')) return;
        setDeleting(true);
        setDeleteError('');
        try {
            await deleteSubject(id);
            router.push('/dashboard/subjects')
        } catch (error) {
            setDeleteError(error instanceof Error ? error.message : "An error occurred while deleting.")
        };
        setDeleting(false);
    }

    //Render states in order
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error : {error}</div>;
    if (!subject) return <div>Subject not found.</div>;

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto py-8">
            <span>
                <Link className="text-white/70 hover:text-white transition duration-200 " href={'/dashboard/subjects'}>
                    ← Back to Subjects
                </Link>
            </span>



            <section className="detail-card">
                <div className="flex justify-between items-center">
                    {/* left: Logo + TEXT */}
                    <div className="flex gap-3">
                        <span><BookOpen className="detail-logo" size={60} /></span>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <h2 className="detail-title">{subject.title}</h2>
                                <span className="detail-badge">{subject.type}</span>
                            </div>
                            {subject.description && (
                                <p className="text-white/60">{subject.description}</p>
                            )}
                        </div>
                    </div>
                    {/* Right: Actions */}
                    <div className="flex gap-1.5 mb-15">
                        <Link href={`${id}/edit`} className="text-white bg-blue-600 rounded p-2 w-20 flex gap-1 justify-center hover:bg-blue-700 transition duration-200"><Edit2 /> Edit </Link>
                        <button type='button' onClick={handleDelete} disabled={deleting} className="text-white bg-red-500 rounded p-2 flex gap-1 justify-center cursor-pointer hover:bg-red-600 transition duration-200">{deleting ? <Loader /> : <Trash2 />} {deleting ? 'Deleting...' : 'Delete'} </button>
                    </div>
                </div>

                <div>{subject.due_date?.slice(0, 10)}</div>
                {/* TODO: Progress bar goes here, full width */}
            </section>

            <section className="detail-card">
                <div className="flex justify-between items-center">
                    {/* Left: Milestone Title + Desc */}
                    <div className="flex items-center gap-3">
                        <span><Target className="detail-logo" size={60} /></span>
                        <div className="flex flex-col gap-1">
                            <h2 className="detail-title">Milestones</h2>
                            <p className="text-white/60">Use milestones to track your progress.</p>
                        </div>
                    </div>
                    {/* Right: Action */}
                    <div>
                        <Link href={`/dashboard/subjects/${id}/milestones/new`} className="border border-purple-500/50 rounded-[10] py-2 px-5 text-white hover:bg-white/10 transition-colors duration-200 flex items-center gap-2">
                            <span className="text-purple-500 text-4xl pr-2"> {<PlusIcon />} </span>Create New Milestone <span className="text-white font-bold text-xl">{`> `}</span>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col mt-4 w-full justify-center">
                    <h3 className="text-white font-bold text-lg mb-3">Milestones List</h3>
                    <MilestoneList subjectId={id} />
                </div>

            </section>

            {/* Pomodoro stats card - 4-column GRID */}
            {/* TODO: Pomodoro Stats Component*/}

            {/* Recent sessions card - table */}
            {/* TODO: Recent Session Component */}

        </div >
    );
}


// <main>
//     <h1>{subject.title}</h1>
//     <p>{subject.type}</p>
//     <p>{subject.has_pomodoro ? "✅Pomodoro" : "❌Pomodoro"}</p>
//     <Link href="/dashboard/subjects"> Back to Subjects </Link>
//     <Link href={`/dashboard/subjects/${id}/edit`}> Edit </Link>

//     <button onClick={handleDelete} disabled={deleting}>
//         {deleting ? "Deleting..." : "Delete Subject"}
//     </button>
//     {deleteError && <p className="form-error">{deleteError}</p>}

//     <MilestoneList subjectId={subject.id} />
// </main>