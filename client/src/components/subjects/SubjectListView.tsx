import { Subject } from "@/types/subject";
import Link from "next/link";

export function SubjectListView({ subjects }: { subjects: Subject[] }) {
  if (!subjects || subjects.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-5 h-40">
        <p className="text-white font-bold cursor-default">No subjects yet</p>
        <Link href={"/dashboard/subjects/new"} className="btn-primary">
          + Add Subject
        </Link>
      </div>
    );

  return (
    <ul className="flex flex-col gap-4 mt-2">
      {subjects.map((s) => (
        <li key={s.id} className="subject-widget__links">
          <Link
            href={`/dashboard/subjects/${s.id}`}
            className="flex justify-between w-[350px]"
          >
            <p>{s.title}</p> <p> {s.due_date?.slice(0, 10)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
