"use client";

import { listShowcase } from "@/lib/api/showcase";
import { Showcase } from "@/types/showcase";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ShowcaseHero() {
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

  return (
    <div>
      {showcase?.map((s) => (
        <div className="text-white" key={s.id}>
          <Link key={s.id} href={`/dashboard/showcase/${s.id}`}>
            {s.subject_title}
          </Link>
        </div>
      ))}
    </div>
  );
}

// TODO: Fix the messy structure.
