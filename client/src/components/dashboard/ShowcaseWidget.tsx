"use client";
import { listShowcase } from "@/lib/api/showcase";
import { Showcase } from "@/types/showcase";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ShowcaseWidget() {
  const [showcase, setShowcase] = useState<Showcase[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetch() {
      try {
        const data = await listShowcase();
        setShowcase(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (showcase?.length === 0 || showcase === null)
    return (
      <div className="flex flex-col items-center justify-center h-35">
        <Trophy className="text-[#642ee2]" size={30} />
        <p className="mt-4 cursor-default text-white font-bold">No showcases yet</p>
      </div>
    );

  return (
    <ul className="flex flex-col gap-3 mt-2">
      {showcase.map((s) => (
        <li key={s.id} className="border-l-4 border-orange-400 pl-2.5 ml-2 hover:border-orange-600/90 cursor-pointer transition-all duration-300 text-white font-bold">
          <Link href={`/dashboard/showcase/${s.id}`}>
            <p className="">
              {s.subject_title}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
