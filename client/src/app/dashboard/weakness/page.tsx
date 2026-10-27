"use client";
import { useEffect, useState } from "react";
import type { Weakness } from "@/types/weakness";
import { listWeaknesses } from "@/lib/api/weakness";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Target } from "lucide-react";
import WeaknessCard from "@/components/weakness/WeaknessCard";
import { Subject } from "@/types/subject";
import { listSubjects } from "@/lib/api/subjects";
import { GhostCard } from "@/components/weakness/GhostCard";

export default function WeaknessPage() {
  const [items, setItems] = useState<Weakness[] | null>(null);
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  // Search Params (Read)
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const status =
    statusParam === "active" || statusParam === "resolved"
      ? statusParam
      : undefined;

  useEffect(() => {
    setLoading(true);
    async function load() {
      setError("");
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
    }
    load();
  }, [status]);

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

        <div>
          <button
            className="w-fit py-2 px-4  bg-black/80 text-white text-md font-semibold cursor-pointer rounded-md hover:bg-blue-500/70 transition-all duration-200 whitespace-nowrap"
            onClick={() => router.push("/dashboard/weakness/new")}
          >
            + New Weakness
          </button>
        </div>
      </div>

      <div className="flex gap-4 mt-10 ">
        <Link href="/dashboard/weakness" className="text-slate-500">
          All
        </Link>
        <Link
          href="/dashboard/weakness?status=active"
          className="text-slate-500"
        >
          Active
        </Link>
        <Link
          href="/dashboard/weakness?status=resolved"
          className="text-slate-500"
        >
          Resolved
        </Link>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 gap-y-4 mt-10">
        {items.map((s) => (
          <WeaknessCard key={s.id} items={s} subjects={subjects ?? []} />
        ))}
        <GhostCard />
      </div>

    </div>
  );
}
