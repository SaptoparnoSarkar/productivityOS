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
    <ul className="flex flex-col gap-3 mt-2">
      {subjects.map((s) => (
        <li key={s.id} className="border-l-4 border-red-500 pl-2.5 ml-2 hover:border-red-700/90 cursor-pointer transition-all duration-300 text-white font-bold">
          <Link
            href={`/dashboard/subjects/${s.id}`}
            className="flex justify-between w-full min-w-0 gap-4 hover:border-purple-700/90 cursor-pointer transition-all duration-300 "
          >
            <p className="line-clamp-1">{s.title}</p>
            <p className="whitespace-nowrap mr-8">{s.due_date?.split('T')[0] ?? "No Due Date"}{s.due_date ? "(Due)" : ""}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
