import { Subject } from "@/types/subject";
import Link from "next/link";

export function SubjectListView({ subjects }: { subjects: Subject[] }) {
  if (subjects.length === 0) return <div>No Subject Yet.</div>;
  return (
    <ul>
      {subjects.map((s) => (
        <li key={s.id}>
          <Link href={`/subjects/${s.id}`}>{s.title}</Link>
        </li>
      ))}
    </ul>
  );
}
