'use client'
import MilestoneForm from "@/components/milestones/MilestoneForm";
import { getMilestone, updateMilestone } from "@/lib/api/milestones";
import { UpdateMilestoneInput } from "@/schemas/milestone.schema";
import { Milestone } from "@/types/milestone";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function EditMilestonePage() {
    const params = useParams();
    const subjectId = Number(params.subjectId);
    const milestoneId = Number(params.milestoneId);
    const router = useRouter();

    const [milestone, setMilestone] = useState<Milestone | null>(null);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState<string>('');

    useEffect(() => {
        if (Number.isNaN(subjectId) || Number.isNaN(milestoneId)) {
            setFormError('Invalid Subject ID or Milestone ID');
            setLoading(false);
            return;
        }

        async function fetchMilestone() {
            try {
                const data = await getMilestone(subjectId, milestoneId);
                setMilestone(data);
            } catch (error) {
                setFormError(
                    error instanceof Error ? error.message : 'Failed to load milestone'
                )
            } finally {
                setLoading(false);
            }
        }
        fetchMilestone();
    }, [subjectId, milestoneId])

    async function handleSubmit(data: UpdateMilestoneInput) {
        setFormError('');
        try {
            await updateMilestone(subjectId, milestoneId, data)
            router.push(`/dashboard/subjects/${subjectId}/milestones/${milestoneId}`)
        }
        catch (error) {
            setFormError(
                error instanceof Error ? error.message : 'Failed to update milestone'
            )
        }
    }

    if (loading) return <div>Loading...</div>;
    if (formError) return <div>Error: {formError}</div>;
    if (!milestone) return <div>Milestone not found</div>

    return (
        <div>
            <MilestoneForm
                mode="edit"
                milestone={milestone}
                onSubmit={handleSubmit} />

        </div>
    )

}