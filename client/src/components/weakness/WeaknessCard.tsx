'use client';
import { deleteWeakness, resolveWeakness } from "@/lib/api/weakness";
import { cn } from "@/lib/utils";
import { Subject } from "@/types/subject";
import { Weakness } from "@/types/weakness";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type Props = {
    items: Weakness;
    subjects: Subject[];
}


export default function WeaknessCard({ items, subjects }: Props) {

    async function handleResolve(weaknessId: number) {
        try {
            await resolveWeakness(weaknessId);
            toast.success("Weakness resolved successfully");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        }
    }

    async function handleDelete(weaknessId: number) {
        try {
            await deleteWeakness(weaknessId);
            toast.success("Weakness deleted successfully");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        }
    }

    return (
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

            <div className="mt-4 flex justify-between items-center">
                <div className="bg-slate-500/50 w-fit rounded-md px-2 py-1 text-md text-white">{items.subject_id ? (subjects.find((s) => s.id === items.subject_id)?.title) : "No Subject"}</div>
                <div className="flex gap-1">
                    <Link className="text-blue-700 bg-gray-700/30 rounded-lg p-2 flex gap-1 justify-center hover:bg-gray-600/50 transition duration-200" href={`/dashboard/weakness/${items.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                    <button type="button" className="text-red-700 bg-gray-700/30 rounded-lg p-2 flex gap-1 justify-center hover:bg-gray-600/50 transition duration-200 cursor-pointer" onClick={() => handleDelete(items.id)}><Trash className="h-4 w-4" /></button>
                </div>

            </div>

            <div className="mt-2 text-sm text-slate-400 font-medium">
                {items.description}
            </div>

            <div className="flex justify-between mt-auto">
                <Link href={`/dashboard/weakness/${items.id}`} className="text-white py-4 px-2 bg-slate-500/20 rounded-2xl w-40 text-center cursor-pointer hover:bg-slate-500/70 transition-all duration-200">Notes</Link>
                {items.status === "active" && (
                    <button type="button" className="text-white py-4 px-2 bg-slate-500/20 rounded-2xl w-40 text-center cursor-pointer hover:bg-slate-500/70 transition-all duration-200" onClick={() => handleResolve(items.id)}>Mark Resolved</button>
                )}
            </div>
        </div>
    );
}