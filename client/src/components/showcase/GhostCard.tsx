import { Ghost } from "lucide-react";


export function GhostCard() {
    return (
        <div className="shrink-0 w-[320px] border-2 border-dashed border-slate-700 rounded-2xl bg-white/5 flex flex-col text-white/50 items-center justify-center gap-2">
            <Ghost />
            <p>Next Trophy</p>
        </div>
    )
}