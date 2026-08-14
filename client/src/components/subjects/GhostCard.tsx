import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function GhostCard() {
  const router = useRouter();
  return (
    <div
      className="flex flex-col relative p-4.5 border-2 border-dashed cursor-pointer border-gray-700 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 h-75"
      aria-hidden="true"
      onClick={() => router.push(`/dashboard/subjects/new`)}
    >
      <div className="flex flex-col items-center justify-center h-full text-white">
        <Plus className="h-10 w-10" />
        <p className="mt-2 text-lg font-bold">Create new subject</p>
      </div>
    </div>
  );
}
