import { Subject } from "@/types/subject";
import Link from "next/link";


export function SubjectCard({ subject }: { subject: Subject }) {

    return (
        <Link className="text-white" href={`/dashboard/subjects/${subject.id}`}>
            <div className="subject-card">

                <div className="subject-card__top">
                    <h3 className="subject-card__title">{subject.title}</h3>
                    <span className="subject-card__badge">{subject.type}</span>
                </div>
                {subject.description && (
                    <p className="subject-card__desc">{subject.description}</p>
                )}

            </div>
        </Link>
    );
}

