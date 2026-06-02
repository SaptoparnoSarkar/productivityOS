'use client';

import { deleteSubject, getSubject } from "@/lib/api/subjects";
import { Subject } from "@/types/subject";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MilestoneList } from "../milestones/MilestoneList";
import Link from "next/link";

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
            router.push('/subjects')
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
        <main>
            <h1>{subject.title}</h1>
            <p>{subject.type}</p>
            <p>{subject.has_pomodoro ? "✅Pomodoro" : "❌Pomodoro"}</p>
            <Link href="/subjects"> Back to Subjects </Link>
            <Link href={`/subjects/${id}/edit`}> Edit </Link>

            <button onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete Subject"}
            </button>
            {deleteError && <p className="form-error">{deleteError}</p>}

            <MilestoneList subjectId={subject.id} />
        </main>
    );
}