"use client";

import { getWeaknessById } from "@/lib/api/weakness";
import { Weakness } from "@/types/weakness";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WeaknessDetailPage() {
  const param = useParams();
  const id = Number(param.weaknessId);

  const [weakness, setWeakness] = useState<Weakness | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchWeakness() {
      setError("");
      try {
        const data = await getWeaknessById(id);
        setWeakness(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load weakness",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchWeakness();
  }, [id]);

  if (loading) return <div>Loading</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!weakness) return <div>Weakness not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white">{weakness.title}</h1>
      <p className="text-slate-500">{weakness.status}</p>
    </div>
  );
}
