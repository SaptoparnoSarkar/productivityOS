import { cn } from "@/lib/utils";
import { Subject } from "@/types/subject";
import { Weakness } from "@/types/weakness";
import Link from "next/link";

type Props = {
    items: Weakness;
    subjects: Subject[];
}


function handleResolve(id: number) {

}



export default function WeaknessCard({ items, subjects }: Props) {
    return (
        <Link
            className="text-white block h-full"
            href={`/dashboard/weakness/${items.id}`}
        >
            <div className="border border-slate-500/50 rounded-2xl p-4.5 h-90 bg-white/5 flex flex-col">
                <div className="flex items-center justify-between">
                    <h3 className="text-[30px] font-bold text-white truncate">{items.title}</h3>
                    <div className={cn("flex items-center gap-2 p-2 border border-slate-500/50 rounded-2xl", items.status === "active" ? "text-orange-300 font-bold bg-orange-500/40 " : "text-green-300 font-bold bg-green-500/40 ")}>
                        {items.status === "active" ? (
                            <span>Active</span>
                        ) : (
                            <span>Resolved</span>
                        )}
                    </div>
                </div>

                <div className="mt-2 bg-slate-500/50 w-fit rounded-md px-2 py-1 text-md">
                    {items.subject_id ? (subjects.find((s) => s.id === items.subject_id)?.title) : "No Subject"}
                </div>

                <div className="mt-2 text-sm text-slate-400 font-medium">
                    {items.description}
                </div>

                <div className="flex justify-between mt-auto">
                    <Link href={`/dashboard/weakness/${items.id}/notes`} className="text-white py-4 px-2 bg-slate-500/50 rounded-2xl">Notes</Link>
                    <button type="button" className="text-white py-4 px-2 bg-slate-500/50 rounded-2xl" onClick={() => handleResolve(items.id)}>Mark Resolved</button>
                </div>
            </div>
        </Link>
    );
}