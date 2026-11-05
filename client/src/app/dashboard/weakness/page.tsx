"use client";
import { useCallback, useEffect, useState } from "react";
import type { Weakness } from "@/types/weakness";
import { listWeaknesses } from "@/lib/api/weakness";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Target } from "lucide-react";
import WeaknessCard from "@/components/weakness/WeaknessCard";
import { Subject } from "@/types/subject";
import { listSubjects } from "@/lib/api/subjects";
import { GhostCard } from "@/components/weakness/GhostCard";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "active", "resolved"] as const;
type Filter = (typeof FILTERS)[number];

export default function WeaknessPage() {
  const [items, setItems] = useState<Weakness[]>([]);
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("all");

  const router = useRouter();

  // Search Params (Read)
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const status =
    statusParam === "active" || statusParam === "resolved"
      ? statusParam
      : undefined;


  const load = useCallback(async () => {
    setLoading(true);
    try {
      const weakness = await listWeaknesses(status);
      const subject = await listSubjects();
      setSubjects(subject);
      setItems(weakness);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }, [status])

  useEffect(() => {
    load();
  }, [load]);

  const visible = filter === "all" ? items : items.filter((w) => w.status === filter);


  if (loading) return <div>Loading</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!items || items.length === 0) return (

    <div className="ml-14 mt-2 mr-12 mb-10">
      <div className="flex gap-4 mb-4 justify-between w-full">
        <div>
          <h1 className="header-text">Weakness Items</h1>
          <p className="subheading-text">
            Write down about your weaknessess you wanna work on.
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-25  ">
        <div className="flex flex-col items-center border-2 border-dashed w-200 h-100 border-gray-700 bg-white/5  ">
          <div className="mt-16">
            <div className="relative inline-flex items-center justify-center">
              <Shield className="text-blue-500 w-20 h-20 " strokeWidth={1.5} />
              <Target className="text-red-500 w-8 h-8 absolute" strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex flex-col items-center mt-4">
            <h2 className="text-white text-2xl font-bold">
              No weaknessess logged yet
            </h2>
            <p className="text-white/70">
              Track topics that hold you back
            </p>
            <p className="text-white/70">
              Acknowledge it, then start working on it.
            </p>
          </div>

          <div className="mt-10">
            <button
              className="w-42 p-3 bg-black text-white mb-10 text-lg font-bold cursor-pointer rounded-2xl hover:bg-purple-600 transition-all duration-300"
              onClick={() => router.push("/dashboard/weakness/new")}
            >
              New Weakness
            </button>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <div className="ml-14 mt-2 mr-12 mb-10">
      <div className="flex gap-4 mb-4 justify-between w-full">
        <div>
          <h1 className="header-text">Weakness Items</h1>
          <p className="subheading-text">
            Write down about your weaknessess you wanna work on.
          </p>
        </div>

        {/* <div>
          <button
            className="w-fit py-2 px-4  bg-black/80 text-white text-md font-semibold cursor-pointer rounded-md hover:bg-blue-500/70 transition-all duration-200 whitespace-nowrap"
            onClick={() => router.push("/dashboard/weakness/new")}
          >
            + New Weakness
          </button>
        </div> */}
      </div>

      <div className="flex gap-2 mb-4 mt-10">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm cursor-pointer transition-all",
              filter === f
                ? "bg-indigo-600 text-white border-none"
                : "border border-gray-700 text-slate-400 hover:text-white",
            )}
          >
            {f === "all" ? "All" : f === "active" ? "Active" : "Resolved"}
          </button>
        ))}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 gap-y-4 mt-10">
        {visible.map((s) => (
          <WeaknessCard key={s.id} items={s} subjects={subjects ?? []} onChange={load} />
        ))}
        {(filter === "all" || filter === "active") && <GhostCard />}
      </div>

    </div>
  )
}
