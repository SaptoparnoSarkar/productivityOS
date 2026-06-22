"use client";

import { listUpcomingSubjects } from "@/lib/api/subjects";
import { Subject } from "@/types/subject";
import { useEffect, useState } from "react";
import { SubjectListView } from "../subjects/SubjectListView";

export function SubjectWidget() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setError("");
    setLoading(true);
    async function fetchUpcomingSubjects() {
      try {
        const data = await listUpcomingSubjects(5);
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
    fetchUpcomingSubjects();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Loading Subjects</div>;



  return <SubjectListView subjects={subjects} />;
}
