"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Weakness } from "@/types/weakness";
import { getWeaknessById } from "@/lib/api/weakness";
import WeaknessForm from "@/components/weakness/WeaknessForm";


export default function EditWeaknessPage() {
    const params = useParams();
    const id = Number(params.weaknessId);
    const router = useRouter();

    const [weakness, setWeakness] = useState<Weakness | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (Number.isNaN(id)) {
            setError("Invalid Subject Id");
            setLoading(false);
            return;
        }
        async function fetchWeakness() {
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!weakness) return <div>Subject not found.</div>;

    return (
        <main className="flex justify-center h-[80vh] items-center">
            <WeaknessForm
                mode="edit"
                weakness={weakness}
                onSuccess={() => router.push(`/dashboard/weakness`)}
            />
        </main>
    );
}
