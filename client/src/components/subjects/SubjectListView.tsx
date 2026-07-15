import { Subject } from "@/types/subject";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export function SubjectListView({ subjects }: { subjects: Subject[] }) {
  if (!subjects || subjects.length === 0)
    return (
      <div className="flex flex-col items-center justify-center pt-5">
        <BookOpen className="w-15 h-15 text-purple-500" />
        <p className="mt-4 cursor-default">No dues. Keep it up!</p>
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
