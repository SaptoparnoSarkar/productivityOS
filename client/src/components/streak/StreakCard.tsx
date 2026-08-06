'use client'

import { StreakWeek } from "@/types/streak";
import { streakWeek } from "@/lib/api/streak";
import { useEffect, useState } from "react"

export default function StreakCard() {
    const [streak, setStreak] = useState<StreakWeek | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchData = async()=>{
            try {
                const data = await streakWeek();
                setStreak(data)
            } catch (error) {
                setError(error instanceof Error ? error.message : "An error occured.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    },[])
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!streak) return <p></p>;

    return(
        
    )
}