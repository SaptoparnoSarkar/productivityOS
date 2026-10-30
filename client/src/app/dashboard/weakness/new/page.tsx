"use client";
import WeaknessForm from "@/components/weakness/WeaknessForm";
import { useRouter } from "next/navigation";

export default function WeaknessCreatePage() {
  const router = useRouter();
  return (
    <main className="flex justify-center h-[80vh] items-center">
      <WeaknessForm mode="create" onSuccess={() => router.push("/dashboard/weakness")} />
    </main>
  );
}
