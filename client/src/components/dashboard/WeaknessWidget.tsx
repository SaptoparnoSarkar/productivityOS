import { recentWeaknesses } from "@/lib/api/weakness";
import { Weakness } from "@/types/weakness";
import { UnlinkIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WeaknessWidget() {
  const [weakness, setWeakness] = useState<Weakness[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchWeakness() {
      try {
        const data = await recentWeaknesses();
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!weakness || weakness?.length === 0) return (

    <div className="flex flex-col items-center justify-center h-35">
      <UnlinkIcon className="text-[#642ee2]" size={30} />
      <p className="text-white font-bold mt-4 cursor-default">No active weakness</p>
    </div>
  )

  return (
    <ul>
      {weakness?.map((w) => (
        <li key={w.id} className="border-l-4 border-purple-500 pl-2.5 ml-2 hover:border-purple-700/90 cursor-pointer transition-all duration-300 text-white font-bold">
          <Link href={`/dashboard/weakness/${w.id}`}>
            <p className="">
              {w.title}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
