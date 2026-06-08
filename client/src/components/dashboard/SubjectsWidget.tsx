"use client";

import { listRecentSubjects } from "@/lib/api/subjects";
import { Subject } from "@/types/subject";
import { useEffect, useState } from "react";
import { SubjectListView } from "../subjects/SubjectListView";

export function SubjectWidget() {
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setError("");
    setLoading(true);
    async function fetchRecentSubjects() {
      try {
        const data = await listRecentSubjects(5);
        setSubjects(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchRecentSubjects();
  }, []);

  if (loading) return <div>Loading Subjects</div>;
  if (error) return <div>Error: {error}</div>;
  if (subjects === null) return <p>Loading</p>;

  return <SubjectListView subjects={subjects} />;
}
