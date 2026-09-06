import { listWeaknesses } from "@/lib/api/weakness";
import { Weakness } from "@/types/weakness";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WeaknessWidget() {
  const [weakness, setWeakness] = useState<Weakness[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchWeakness() {
      try {
        const data = await listWeaknesses("active", 5);
        setWeakness(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchWeakness();
  }, []);

  if (loading) <div>Loading...</div>;
  if (error) <div>{error}</div>;
  if (weakness?.length === 0) return <div>You don't have any weakness</div>;

  return (
    <div>
      {weakness?.map((w) => (
        <Link key={w.id} href={`/dashboard/weakness/${w.id}`}>
          <p className="border-l-4 border-purple-500 pl-2.5 ml-2 mt-2 hover:border-purple-700/90 cursor-pointer transition-all duration-300 text-white font-bold ">
            {w.title}
          </p>
        </Link>
      ))}
    </div>
  );
}
