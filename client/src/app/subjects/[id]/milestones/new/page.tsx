'use client'

import { ChecklistForm, ChecklistFormValues } from "@/components/milestones/ChecklistForm";
import { CounterForm, CounterFormValues } from "@/components/milestones/CounterForm";
import MilestoneForm from "@/components/milestones/MilestoneForm";

import { createChecklistItem } from "@/lib/api/checklistItems";
import { createCounter } from "@/lib/api/counters";
import { createMilestone } from "@/lib/api/milestones"
import { CreateMilestoneInput } from "@/schemas/milestone.schema";
import { useParams, useRouter } from "next/navigation"
import { useState } from "react";

//Renders <MilestoneForm onSuccess={setCreatedMilestone} /> when null. Renders <CounterForm /> or <ChecklistForm /> when set.


export default function NewMilestonePage() {

    const params = useParams();
    const subjectId = Number(params.id)

    const router = useRouter();

    const [formError, setFormError] = useState<string>("")
    const [createdMilestone, setCreatedMilestone] = useState<{ id: number; type: 'counter' | 'checklist' } | null>(null);

    async function handleMilestoneSubmit(data: CreateMilestoneInput) {
        setFormError("");

        try {
            const milestone = await createMilestone(subjectId, data);
            setCreatedMilestone({ id: milestone.id, type: milestone.type });

        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message)
            } else {
                setFormError('An error occurred. Please try again.')
            }
        }
    }

    async function handleChecklistSubmit(values: ChecklistFormValues) {
        if (!createdMilestone) return;
        try {
            await createChecklistItem(createdMilestone.id, values.label);
            router.push(`/subjects/${subjectId}/milestones/${createdMilestone.id}`);
        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError('An error occurred. Please try again.');
            }
        }
    }

    async function handleCounterSubmit(values: CounterFormValues) {
        if (!createdMilestone) return;
        try {
            await createCounter(createdMilestone.id, values);
            router.push(`/subjects/${subjectId}/milestones/${createdMilestone.id}`);
        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError('An error occurred. Please try again.');
            }
        }
    }

    return (
        <div>
            {formError && <p className="form-error">{formError}</p>}
            {createdMilestone === null ? (<MilestoneForm mode="create" onSubmit={handleMilestoneSubmit} />) : createdMilestone.type === 'checklist' ? (
                <ChecklistForm onSubmit={handleChecklistSubmit} />
            ) : (
                <CounterForm onSubmit={handleCounterSubmit} />
            )}
        </div>
    )
}
