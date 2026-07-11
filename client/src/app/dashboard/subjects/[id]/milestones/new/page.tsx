'use client'

import { ChecklistForm } from "@/components/milestones/ChecklistForm";
import { CounterForm, CounterFormValues } from "@/components/counter/CounterForm";
import MilestoneForm from "@/components/milestones/MilestoneForm";
import { setChecklistTarget } from "@/lib/api/checklist";
import { createChecklistItem } from "@/lib/api/checklistItems";
import { createCounter } from "@/lib/api/counters";
import { createMilestone } from "@/lib/api/milestones"
import { ChecklistFormOutput, ChecklistFormValues } from "@/schemas/checklist.schema";
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

    //Handles first stage form submission. Creates the milestone
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
    //Handles second stage form submission for checklist milestones.
    async function handleChecklistSubmit(values: ChecklistFormOutput) {
        if (!createdMilestone) return;
        try {
            // TODO Transaction
            await setChecklistTarget(createdMilestone.id, { target_count: values.target_count });
            await createChecklistItem(createdMilestone.id, { label: values.label });
            router.push(`/dashboard/subjects/${subjectId}/milestones/${createdMilestone.id}`);
        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError('An error occurred. Please try again.');
            }
        }
    }
    //Handles second stage form submission for counter milestones.
    async function handleCounterSubmit(values: CounterFormValues) {
        if (!createdMilestone) return;
        try {
            await createCounter(createdMilestone.id, values);
            router.push(`/dashboard/subjects/${subjectId}/milestones/${createdMilestone.id}`);
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

            {createdMilestone === null ? (
                //If no milestone is created yet, render the milestone form.
                <MilestoneForm mode="create" onSubmit={handleMilestoneSubmit} />
            ) : createdMilestone.type === 'checklist' ? (
                //If the milestone type is a checklist, render the checklist form.
                <ChecklistForm onSubmit={handleChecklistSubmit} />
            ) : (
                //If the milestone type is a counter, render the counter form.
                <CounterForm mode='create' onSubmit={handleCounterSubmit} />
            )}
        </div>
    )
}
