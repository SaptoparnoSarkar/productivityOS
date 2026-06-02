"use client";

import SubjectForm from "@/components/subjects/SubjectForm";
import { getSubject } from "@/lib/api/subjects";
import { Subject } from "@/types/subject";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditSubjectPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (Number.isNaN(id)) {
      setError("Invalid Subject Id");
      setLoading(false);
      return;
    }

    async function fetchSubject() {
      try {
        const data = await getSubject(id);
        setSubject(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load subject",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchSubject();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!subject) return <div>Subject not found.</div>;

  return (
    <main>
      <SubjectForm
        mode="edit"
        subject={subject}
        onSuccess={() => router.push(`/subjects/${id}`)}
      />
    </main>
  );
}
