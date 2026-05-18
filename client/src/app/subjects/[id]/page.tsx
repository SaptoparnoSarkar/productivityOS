"use client";

import { getSubject } from "@/lib/api/subjects";
import { Subject } from "@/types/subject";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SubjectPage() {
  const params = useParams();
  const id = Number(params.id);

  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
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
    if (Number.isNaN(id)) {
      setError("Invalid subject ID");
      setLoading(false);
      return;
    }
    fetchSubject();
  }, [id]);

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
    </main>
  );
}
