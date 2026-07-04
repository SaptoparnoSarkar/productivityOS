'use client';

import { getXpLog } from "@/lib/api/xp";
import { XpLogResponse } from "@/types/xp";
import { BookOpen, Calendar, CalendarDays, CalendarRange, ChevronLeft, ChevronRight, Flag, Flame, ListChecks, LucideIcon, Timer, TrendingDown, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function XpLogPage() {
    const [data, setData] = useState<XpLogResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Event Icons
    const EVENT_ICONS: Record<string, LucideIcon> = {
        daily_completion: CalendarDays,
        subject_completion: BookOpen,
        streak_multiplier: Flame,
        decay: TrendingDown,
        pomodoro_session: Timer,
        weekly_completion: CalendarRange,
        per_tick: Zap,
    };

    useEffect(() => {
        setError('');
        setLoading(true);
        async function fetchData() {
            try {
                const result = await getXpLog(currentPage);
                setData(result);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Something went wrong');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [currentPage])

    if (loading) return <div className="text-center text-slate-500">Loading Xp Log...</div>
    if (error) return <div className="text-center text-red-500">{error}</div>
    if (!data) return null;

    //destructure
    const { events, page, totalPages, totalCount } = data.log;

    //Sliding Window Pagination
    const WINDOW_SIZE = 5;
    function getPageWindow(currentPage: number, totalPages: number, windowSize: number) {
        const halfWindow = Math.floor(windowSize / 2);
        let start = Math.max(1, currentPage - halfWindow);
        let end = Math.min(totalPages, start + windowSize - 1);

        if (end - start + 1 < windowSize) {
            start = Math.max(1, end - windowSize + 1);
        }

        let pages = []

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }

    const pageNumbers = getPageWindow(currentPage, totalPages, WINDOW_SIZE);

    return (
        <div className="text-white px-10 mb-6 ">

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-2xl font-bold">XP Log</h1>
                <p className="text-slate-400 text-sm mt-1">Track all XP you've earned on your producitivity journey. </p>
            </div>


            {/* Table Contents */}
            <div className="border border-purple-300/20 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-4 bg-purple-950/60 px-6 py-6 text-sm font-medium text-slate-300">
                    <div className="flex items-center gap-2"><ListChecks size={20} /> Type</div>
                    <div className="flex items-center gap-2"><Flag size={20} /> Milestone</div>
                    <div className="flex items-center gap-2"><Zap size={20} /> Amount</div>
                    <div className="flex items-center gap-2"><Calendar size={20} /> Date</div>
                </div>

                {/* Table Row */}
                <div>
                    {events.map(event => {
                        const Icon = EVENT_ICONS[event.type] ?? Zap;
                        return (
                            <div key={event.id} className="grid grid-cols-4 px-6 py-4 items-center text-sm hover:bg-white/6 transition-colors">

                                <div className="flex items-center gap-2">
                                    <span className="border p-2 border-purple-400/80 rounded-lg bg-purple-400/25">
                                        <Icon size={20} className="text-purple-400" />
                                    </span>
                                    {event.type}
                                </div>

                                <div>{event.milestone_title ?? "Milestone deleted"}</div>
                                <div>{event.amount > 0 ? `+${event.amount}` : event.amount} XP</div>
                                <div>{new Date(event.created_at).toLocaleDateString()}</div>
                            </div>
                        )
                    })}
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center gap-3 mt-6 bg-purple-950/60 py-4">
                    <div className="flex items-center gap-5">

                        <button
                            type="button"
                            onClick={() => setCurrentPage(p => p - 1)}
                            disabled={currentPage === 1}
                            className="disabled:text-slate-600 transition-colors hover:text-purple-400 cursor-pointer hover:scale-110">
                            <ChevronLeft />
                        </button>


                        {pageNumbers.map(num => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setCurrentPage(num)}
                                className={num === currentPage ? "border border-purple-500 bg-purple-400/10 rounded-[8] px-3 py-1 cursor-pointer" : "text-slate-300 border border-purple-400/10 rounded-[8] px-3 py-1 cursor-pointer hover:bg-purple-400/20 transition-colors"}
                            >
                                {num}
                            </button>
                        ))}


                        <button
                            type="button"
                            onClick={() => setCurrentPage(p => p + 1)}
                            disabled={currentPage >= totalPages}
                            className="disabled:text-slate-600 transition-colors hover:text-purple-400 cursor-pointer hover:scale-110">
                            <ChevronRight />
                        </button>
                    </div>
                    <span className="text-sm text-slate-400"> Page {currentPage} of {totalPages}</span>
                </div>
            </div>
        </div>
    )
}