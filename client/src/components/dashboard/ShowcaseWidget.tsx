"use client";
import { listShowcase } from "@/lib/api/showcase";
import { Showcase } from "@/types/showcase";
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
    return <div>You don't have any weakness</div>;

  return (
    <div>
      {showcase.map((s) => (
        <Link key={s.id} href={`/dashboard/showcase/${s.id}`}>
          <p className="border-l-4 border-green-500 pl-2.5 ml-2 mt-2 hover:border-green-700/90 cursor-pointer transition-all duration-300 text-white font-bold">
            {s.subject_title}
          </p>
        </Link>
      ))}
    </div>
  );
}
