import { Verdict } from "@/types/pomodoro";


type TimerRingHalfProps = {
    remaining: number;
    total: number;
    label: string;
    verdict: Verdict | null;
}

const RADIUS = 110;
const ARC_LENGTH = Math.PI * RADIUS;

export default function TimerRingHalf({ remaining, total, label, verdict }: TimerRingHalfProps) {
    const safeTotal = Math.max(total, 1);
    const remainingProgress = Math.min(1, Math.max(0, remaining / safeTotal));
    const dashOffset = ARC_LENGTH * (1 - remainingProgress);


    const statusLabel = verdict === 'paused' ? "PAUSED" : "FOCUS";

    return (
        <div className="relative h-[190px] w-[300px] bottom-4">
            <svg
                viewBox="0 0 300 170"
                className="h-full w-full"
                aria-hidden="true"
            >
                <path
                    d="M 40 145 A 110 110 0 0 1 260 145"
                    fill="none"
                    stroke="rgba(168, 85, 247, 0.22)"
                    strokeWidth="12"
                    strokeLinecap="round"
                />
                <path
                    d="M 40 145 A 110 110 0 0 1 260 145"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={ARC_LENGTH}
                    strokeDashoffset={dashOffset}
                    className="transition-[stroke-dashoffset] duration-300"
                />
            </svg>
            <div className="absolute inset-x-0 bottom-3 text-center">
                <p className="text-xs font-medium tracking-[3px] text-neutral-400">{statusLabel}</p>
                <p className="mt-1 font-mono text-6xl font-bold tabular-nums text-white">{label}</p>
            </div>
        </div>
    )

}