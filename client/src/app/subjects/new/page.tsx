"use client";

import CreateSubjectForm from "@/components/subjects/CreateSubjectForm";
import { useRouter } from "next/navigation";

export default function SubjectCreatePage() {
  const router = useRouter();
  return (
    <main className="subject-page">
      <CreateSubjectForm onSuccess={() => router.push("/subjects")} />
    </main>
  );
}
