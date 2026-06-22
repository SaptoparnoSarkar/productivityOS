"use client";

import { listSubjects } from "@/lib/api/subjects";
import { Subject } from "@/types/subject";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubjectCard } from "./SubjectCard";

export function SubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setError("");
    setLoading(true);
    async function fetchSubjects() {
      try {
        const data = await listSubjects();
        setSubjects(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, []);

  //Render states in order:
  if (loading) return <div>Loading...</div>;
  if (!subjects || subjects.length === 0) return (
    <div className="text-white">
      No Subjects Created Yet. Create One to start tracking your progress.
    </div>
  )
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center gap-1">

      <div className="subjects-grid">
        {subjects.map((s) => <SubjectCard key={s.id} subject={s} />)}
      </div>

      <button
        className="subject-submit-btn"
        onClick={() => router.push("/dashboard/subjects/new")}
      >
        Create New Subject
      </button>
    </div>
  );
}
