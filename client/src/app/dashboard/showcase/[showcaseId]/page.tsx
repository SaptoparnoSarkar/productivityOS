"use client";

import { getShowcaseById } from "@/lib/api/showcase";
import { Showcase } from "@/types/showcase";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShowcaseDetailPage() {
  const [showcase, setShowcase] = useState<Showcase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const param = useParams();
  const id = Number(param.showcaseId);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getShowcaseById(id);
        setShowcase(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <div> Loading</div>;
  if (error) return <div> {error}</div>;
  return (
    <div className="text-white">
      {showcase?.subject_title}
      {showcase?.total_xp}
    </div>
  );
}
