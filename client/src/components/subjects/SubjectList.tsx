"use client";

import { listSubjects } from "@/lib/api/subjects";
import { Subject } from "@/types/subject";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubjectListView } from "./SubjectListView";

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
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="flex flex-col gap-y-2 items-center justify-center">
      <SubjectListView subjects={subjects} />
      <button
        className="border rounded-md bg-black p-2 text-white"
        onClick={() => router.push("/subjects/new")}
      >
        Create New Subject
      </button>
    </main>
  );
}
