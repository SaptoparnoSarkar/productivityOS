
type props = {
    createdAt: string;
    content: string;
}


export function WeaknessNoteCard({ createdAt, content }: props) {
    return (
        <div>
            <p className="text-xs text-slate-400">
                {new Date(createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-slate-100">{content}</p>
        </div>
    )
}