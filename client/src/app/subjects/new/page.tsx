"use client";

import SubjectForm from "@/components/subjects/SubjectForm";
import { useRouter } from "next/navigation";

export default function SubjectCreatePage() {
  const router = useRouter();
  return (
    <main className="subject-page">
      <SubjectForm mode="create" onSuccess={() => router.push("/subjects")} />
    </main>
  );
}
